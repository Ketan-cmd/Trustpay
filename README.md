# TrustPay - Financial Inclusion Platform

**Bank the unbanked. Simply. Securely.**

A simplified, mobile-first financial inclusion web application featuring AI-powered fraud detection, offline SMS payments, and secure money transfers for emerging markets.

## 🚀 Quick Start (3-Line Deployment)

```bash
# 1. Clone and setup
git clone <repo-url> && cd trustpay-financial-inclusion && npm install

# 2. Start all services
docker-compose up -d

# 3. Access the application
open http://localhost:3000
```

## 🎯 Core Features

### Simplified Mobile-First Design
- **Minimalist UI**: Clean, focused interface optimized for <5" screens
- **Large Touch Targets**: All interactive elements ≥44px for accessibility
- **Font Size**: Minimum 16px for readability on small screens
- **Color Scheme**: Trust-building green with neutral whites/blacks

### Key Screens
- **Dashboard**: Clean balance display with 2 primary actions (Send Money, Cash Out)
- **Transactions**: Single-column list with integrated fraud alerts (🛡️ icon)
- **Profile**: Secure account management and fraud protection settings

### Enhanced Offline Capabilities
- **Auto-detect Offline Mode**: Automatically switches to SMS flow when offline
- **SMS Payment Processing**: Encrypted pending transactions with 1¢ fee disclosure
- **Offline-first Architecture**: Works seamlessly without internet connection

### AI-Powered Fraud Detection
- **Real-time Risk Scoring**: 0-100% risk assessment for each transaction
- **Detailed Explanations**: Clear fraud alert descriptions ("Flagged: 5 payments in 2 minutes")
- **Pattern Recognition**: Velocity, amount, location, and behavioral analysis
- **Visual Indicators**: Shield icons and color-coded risk levels

### Secure Money Transfers
- **Instant Online Transfers**: Real-time payment processing
- **SMS Backup**: Reliable offline payment method
- **Encrypted Storage**: Secure transaction data protection
- **Multi-layer Security**: JWT authentication, rate limiting, fraud monitoring

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom green color system
- **Routing**: React Router v6
- **Mobile Optimization**: Progressive Web App features

### Backend Services
- **API Server**: Node.js + Express with JWT authentication
- **Fraud Detection**: Python Flask microservice with Redis
- **Database**: MongoDB for user data, Redis for caching
- **Real-time**: WebSocket support for live fraud alerts

### Infrastructure
- **Containerization**: Docker with multi-service compose
- **Deployment**: Ready for Heroku/AWS with environment configs
- **Monitoring**: Health checks and fraud alert logging

## 🎨 Design System

### Color Palette
- **Primary**: Trust Green (#22c55e) - Security and growth
- **Success**: Green variants for completed transactions
- **Warning**: Amber (#f59e0b) - Pending actions and alerts
- **Error**: Red (#ef4444) - Fraud alerts and failures
- **Neutral**: Clean whites and blacks for clarity

### Typography
- **Base Size**: 16px minimum for mobile readability
- **Headings**: 18px-30px with 120% line height
- **Body**: 16px with 150% line height for easy reading
- **Weights**: Regular (400), Medium (500), Bold (700)

### Mobile-First Responsive Design
- **Small Phones**: 320px+ (feature phone support)
- **Smartphones**: 375px-768px (optimized layouts)
- **Tablets**: 768px+ (enhanced features)
- **Desktop**: 1024px+ (full feature set)

## 🔒 Security Features

### Enhanced Fraud Detection
- **Velocity Checking**: Monitors transaction frequency patterns
- **Amount Anomalies**: Detects unusual transaction amounts
- **Location Analysis**: IP/location mismatch detection
- **Pattern Recognition**: Behavioral analysis and automation detection

### Offline Security
- **Encrypted Storage**: Pending transactions encrypted locally
- **SMS Verification**: Two-factor authentication for offline payments
- **Secure Sync**: Encrypted data transmission when online

### Data Protection
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive data sanitization

## 📱 Mobile Optimization

### Low-Bandwidth Support
- **Optimized Assets**: Compressed images and minimal JavaScript
- **Progressive Loading**: Critical content first
- **Offline Caching**: Service worker for offline functionality
- **Data Compression**: Efficient API responses

### Emerging Market Features
- **SMS Fallback**: Works without internet connection
- **Simple Navigation**: Bottom tab navigation for one-handed use
- **Large Touch Targets**: Accessibility-focused design
- **Battery Optimization**: Minimal background processing

## 🧪 Testing

### API Testing (Postman Collection)
```bash
# Import the collection
postman_collection.json

# Test endpoints
1. Authentication (Login/Verify)
2. Transaction Management
3. Fraud Detection
4. Health Checks
```

### Manual Testing Scenarios
1. **Offline Mode**: Disconnect internet, create SMS transactions
2. **Fraud Detection**: Create high-velocity transactions to trigger alerts
3. **Mobile Responsive**: Test on various screen sizes (320px-1024px+)
4. **Security**: Test authentication and fraud protection

## 🚀 Deployment Options

### Heroku Deployment
```bash
# 1. Create Heroku apps
heroku create trustpay-web
heroku create trustpay-api

# 2. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set REDIS_URL=<your-redis-uri>

# 3. Deploy
git push heroku main
```

### AWS Deployment
```bash
# 1. Build Docker images
docker build -t trustpay-web .
docker build -t trustpay-api -f Dockerfile.api .

# 2. Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag trustpay-web:latest <account>.dkr.ecr.<region>.amazonaws.com/trustpay-web:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/trustpay-web:latest

# 3. Deploy with ECS/EKS
```

## 🔧 Environment Variables

### Required Variables
```env
# API Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key

# Database
MONGODB_URI=mongodb://localhost:27017/trustpay
REDIS_URL=redis://localhost:6379

# Twilio (SMS/USSD)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## 📊 Monitoring & Analytics

### Health Checks
- `/health` - API server status
- `/health` - Fraud service status
- Database connectivity monitoring
- Redis cache status

### Fraud Detection Metrics
- Real-time risk score tracking
- Alert accuracy monitoring
- False positive rate analysis
- Transaction pattern insights

## 🎯 Demo Credentials

**Login**: demo@trustpay.com  
**Password**: demo123

## 🔗 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Token verification

### Transaction Endpoints
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction

### Fraud Detection Endpoints
- `GET /api/fraud/alerts` - Get fraud alerts
- `POST /api/fraud/analyze/:id` - Analyze transaction

## 🌟 Key Features

### Simplified User Experience
- **Core Focus**: Send money, cash out, and fraud protection
- **Mobile-First**: Optimized for emerging market smartphones
- **One-Handed Use**: Bottom navigation for easy thumb access

### Enhanced Fraud Detection
- **Real-time Scoring**: Live risk assessment with explanations
- **Visual Feedback**: Clear fraud indicators and alerts
- **Pattern Analysis**: Advanced ML-based detection

### Better Offline Support
- **SMS Integration**: Automatic offline mode detection
- **Fee Transparency**: Clear 1¢ SMS fee disclosure
- **Reliable Sync**: Robust offline-to-online synchronization

### Financial Inclusion Focus
- **Emerging Markets**: Designed for low-bandwidth, offline-first usage
- **Simple Interface**: Minimal complexity, maximum accessibility
- **Trust Building**: Clear security indicators and fraud protection

---

**Built with ❤️ for financial inclusion in emerging markets**

*TrustPay - Bank the unbanked. Simply. Securely.*