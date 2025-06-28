from flask import Flask, request, jsonify
import redis
import json
import numpy as np
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

# Redis connection
try:
    redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
except:
    # Fallback for development
    redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class FraudDetector:
    def __init__(self):
        self.velocity_threshold = 10  # transactions per hour
        self.amount_threshold = 1000  # suspicious amount threshold
        self.location_radius = 50  # km radius for location anomaly
        
    def analyze_transaction(self, transaction_data):
        alerts = []
        risk_score = 0
        
        # Velocity check
        velocity_alert = self.check_velocity(transaction_data)
        if velocity_alert:
            alerts.append(velocity_alert)
            risk_score += 30
            
        # Amount anomaly check
        amount_alert = self.check_amount_anomaly(transaction_data)
        if amount_alert:
            alerts.append(amount_alert)
            risk_score += 25
            
        # Location check
        location_alert = self.check_location_anomaly(transaction_data)
        if location_alert:
            alerts.append(location_alert)
            risk_score += 20
            
        # Pattern analysis
        pattern_alert = self.check_pattern_anomaly(transaction_data)
        if pattern_alert:
            alerts.append(pattern_alert)
            risk_score += 15
            
        return {
            'risk_score': min(risk_score, 100),
            'alerts': alerts,
            'timestamp': datetime.now().isoformat()
        }
    
    def check_velocity(self, transaction_data):
        user_id = transaction_data.get('fromUser')
        current_time = datetime.now()
        hour_ago = current_time - timedelta(hours=1)
        
        # Get recent transactions from Redis
        recent_key = f"user_transactions:{user_id}"
        recent_transactions = redis_client.zrangebyscore(
            recent_key, 
            hour_ago.timestamp(), 
            current_time.timestamp()
        )
        
        if len(recent_transactions) > self.velocity_threshold:
            return {
                'type': 'velocity',
                'severity': 'high' if len(recent_transactions) > 15 else 'medium',
                'description': f'High transaction velocity: {len(recent_transactions)} in the last hour',
                'metadata': {
                    'transaction_count': len(recent_transactions),
                    'threshold': self.velocity_threshold
                }
            }
        return None
    
    def check_amount_anomaly(self, transaction_data):
        amount = transaction_data.get('amount', 0)
        user_id = transaction_data.get('fromUser')
        
        # Get user's historical average
        avg_key = f"user_avg_amount:{user_id}"
        historical_avg = redis_client.get(avg_key)
        
        if historical_avg:
            avg_amount = float(historical_avg)
            if amount > avg_amount * 5:  # 5x average
                return {
                    'type': 'amount',
                    'severity': 'high' if amount > avg_amount * 10 else 'medium',
                    'description': f'Transaction amount ${amount} significantly higher than average ${avg_amount:.2f}',
                    'metadata': {
                        'amount': amount,
                        'average': avg_amount,
                        'multiplier': amount / avg_amount
                    }
                }
        elif amount > self.amount_threshold:
            return {
                'type': 'amount',
                'severity': 'medium',
                'description': f'Large transaction amount: ${amount}',
                'metadata': {
                    'amount': amount,
                    'threshold': self.amount_threshold
                }
            }
        return None
    
    def check_location_anomaly(self, transaction_data):
        # Mock location check - in reality, would use geolocation data
        user_id = transaction_data.get('fromUser')
        location = transaction_data.get('location')
        
        if location:
            # Simulate location anomaly detection
            if np.random.random() > 0.8:  # 20% chance of location anomaly
                return {
                    'type': 'location',
                    'severity': 'medium',
                    'description': 'Transaction from unusual location',
                    'metadata': {
                        'current_location': location,
                        'usual_locations': ['Lagos', 'Abuja']  # Mock usual locations
                    }
                }
        return None
    
    def check_pattern_anomaly(self, transaction_data):
        # Simple pattern analysis
        transaction_type = transaction_data.get('type')
        amount = transaction_data.get('amount', 0)
        timestamp = datetime.fromisoformat(transaction_data.get('timestamp', datetime.now().isoformat()))
        
        # Check for round number amounts (potential automation)
        if amount % 100 == 0 and amount > 100:
            return {
                'type': 'pattern',
                'severity': 'low',
                'description': 'Round number transaction amount may indicate automation',
                'metadata': {
                    'amount': amount,
                    'pattern_type': 'round_amount'
                }
            }
        
        # Check for off-hours transactions
        if timestamp.hour < 6 or timestamp.hour > 22:
            return {
                'type': 'pattern',
                'severity': 'low',
                'description': 'Transaction during unusual hours',
                'metadata': {
                    'hour': timestamp.hour,
                    'pattern_type': 'unusual_time'
                }
            }
        
        return None

detector = FraudDetector()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'service': 'fraud-detection'})

@app.route('/analyze', methods=['POST'])
def analyze_transaction():
    try:
        transaction_data = request.json
        
        if not transaction_data:
            return jsonify({'error': 'No transaction data provided'}), 400
        
        # Store transaction for velocity analysis
        user_id = transaction_data.get('fromUser')
        if user_id:
            timestamp = datetime.now().timestamp()
            redis_client.zadd(
                f"user_transactions:{user_id}",
                {json.dumps(transaction_data): timestamp}
            )
            # Expire old data after 24 hours
            redis_client.expire(f"user_transactions:{user_id}", 86400)
            
            # Update user average amount
            amount = transaction_data.get('amount', 0)
            avg_key = f"user_avg_amount:{user_id}"
            current_avg = redis_client.get(avg_key)
            if current_avg:
                new_avg = (float(current_avg) + amount) / 2
            else:
                new_avg = amount
            redis_client.set(avg_key, new_avg, ex=86400 * 30)  # 30 days expiry
        
        # Analyze transaction
        analysis_result = detector.analyze_transaction(transaction_data)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        app.logger.error(f"Error analyzing transaction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/risk-score/<user_id>', methods=['GET'])
def get_user_risk_score(user_id):
    try:
        # Calculate user risk score based on recent activity
        recent_key = f"user_transactions:{user_id}"
        recent_count = redis_client.zcard(recent_key)
        
        base_score = min(recent_count * 2, 50)  # Base score from activity
        
        # Add randomization for demo
        risk_score = base_score + np.random.randint(0, 20)
        
        return jsonify({
            'user_id': user_id,
            'risk_score': min(risk_score, 100),
            'factors': {
                'transaction_frequency': recent_count,
                'base_score': base_score
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error calculating risk score: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__=='__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)