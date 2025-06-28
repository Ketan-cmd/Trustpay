import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Activity,
  Eye,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';

interface DemoTransaction {
  id: string;
  amount: number;
  fromUser: string;
  toUser: string;
  timestamp: string;
  location: string;
  riskScore: number;
  alerts: FraudAlert[];
  status: 'analyzing' | 'flagged' | 'approved' | 'blocked';
}

interface FraudAlert {
  type: 'velocity' | 'amount' | 'location' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: string;
  riskPoints: number;
}

const FraudDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [demoTransaction, setDemoTransaction] = useState<DemoTransaction | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Demo scenarios
  const scenarios = [
    {
      title: "Normal Transaction",
      description: "A typical payment with low risk",
      transaction: {
        id: "txn_001",
        amount: 25.00,
        fromUser: "john_doe",
        toUser: "coffee_shop",
        timestamp: new Date().toISOString(),
        location: "Lagos, Nigeria",
        riskScore: 12,
        alerts: [],
        status: 'approved' as const
      }
    },
    {
      title: "High Velocity Attack",
      description: "Multiple rapid transactions triggering velocity alerts",
      transaction: {
        id: "txn_002",
        amount: 50.00,
        fromUser: "suspicious_user",
        toUser: "merchant_xyz",
        timestamp: new Date().toISOString(),
        location: "Lagos, Nigeria",
        riskScore: 85,
        alerts: [
          {
            type: 'velocity' as const,
            severity: 'high' as const,
            description: "High transaction velocity detected",
            details: "15 transactions in the last hour (limit: 10)",
            riskPoints: 35
          },
          {
            type: 'pattern' as const,
            severity: 'medium' as const,
            description: "Round number amounts detected",
            details: "Last 5 transactions were exact round numbers",
            riskPoints: 20
          }
        ],
        status: 'flagged' as const
      }
    },
    {
      title: "Amount Anomaly",
      description: "Transaction amount significantly higher than user's average",
      transaction: {
        id: "txn_003",
        amount: 500.00,
        fromUser: "regular_user",
        toUser: "electronics_store",
        timestamp: new Date().toISOString(),
        location: "Abuja, Nigeria",
        riskScore: 72,
        alerts: [
          {
            type: 'amount' as const,
            severity: 'high' as const,
            description: "Amount significantly higher than average",
            details: "$500 is 10x higher than user's $50 average",
            riskPoints: 40
          }
        ],
        status: 'flagged' as const
      }
    },
    {
      title: "Location Anomaly",
      description: "Transaction from unusual geographic location",
      transaction: {
        id: "txn_004",
        amount: 75.00,
        fromUser: "traveler_user",
        toUser: "hotel_booking",
        timestamp: new Date().toISOString(),
        location: "London, UK",
        riskScore: 68,
        alerts: [
          {
            type: 'location' as const,
            severity: 'medium' as const,
            description: "Transaction from unusual location",
            details: "User typically transacts in Lagos, Nigeria",
            riskPoints: 25
          },
          {
            type: 'pattern' as const,
            severity: 'low' as const,
            description: "Transaction during unusual hours",
            details: "Payment made at 3:00 AM local time",
            riskPoints: 15
          }
        ],
        status: 'flagged' as const
      }
    },
    {
      title: "Critical Fraud Attempt",
      description: "Multiple red flags indicating potential fraud",
      transaction: {
        id: "txn_005",
        amount: 1000.00,
        fromUser: "compromised_account",
        toUser: "suspicious_merchant",
        timestamp: new Date().toISOString(),
        location: "Unknown Location",
        riskScore: 95,
        alerts: [
          {
            type: 'velocity' as const,
            severity: 'critical' as const,
            description: "Extreme velocity pattern detected",
            details: "25 transactions in 30 minutes",
            riskPoints: 45
          },
          {
            type: 'amount' as const,
            severity: 'critical' as const,
            description: "Extremely high amount anomaly",
            details: "$1000 is 50x higher than user's average",
            riskPoints: 40
          },
          {
            type: 'location' as const,
            severity: 'high' as const,
            description: "Location completely unknown",
            details: "IP address not matching any known locations",
            riskPoints: 30
          }
        ],
        status: 'blocked' as const
      }
    }
  ];

  const runDemo = async (scenarioIndex: number) => {
    setIsRunning(true);
    setCurrentStep(scenarioIndex);
    setAnalysisProgress(0);
    
    const scenario = scenarios[scenarioIndex];
    
    // Set initial transaction state
    setDemoTransaction({
      ...scenario.transaction,
      status: 'analyzing',
      alerts: [],
      riskScore: 0
    });

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      setAnalysisProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Add alerts progressively
    for (let i = 0; i < scenario.transaction.alerts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDemoTransaction(prev => prev ? {
        ...prev,
        alerts: [...prev.alerts, scenario.transaction.alerts[i]],
        riskScore: prev.riskScore + scenario.transaction.alerts[i].riskPoints
      } : null);
    }

    // Final status
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDemoTransaction(prev => prev ? {
      ...prev,
      status: scenario.transaction.status,
      riskScore: scenario.transaction.riskScore
    } : null);

    setIsRunning(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setDemoTransaction(null);
    setAnalysisProgress(0);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'approved': return 'text-bolt-green-600 bg-bolt-green-100 dark:bg-bolt-green-900/20 dark:text-bolt-green-400';
      case 'flagged': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
      case 'blocked': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'velocity': return <TrendingUp className="w-4 h-4" />;
      case 'amount': return <DollarSign className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'pattern': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Fraud Detection Demo
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          See how TrustPay's AI detects fraud in real-time
        </p>
      </div>

      {/* Demo Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Choose a Fraud Scenario
        </h3>
        
        <div className="grid grid-cols-1 gap-3 mb-6">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => runDemo(index)}
              disabled={isRunning}
              className={`p-4 text-left rounded-lg border-2 transition-all ${
                currentStep === index 
                  ? 'border-bolt-green-500 bg-bolt-green-50 dark:bg-bolt-green-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {scenario.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {currentStep === index && isRunning ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bolt-green-600"></div>
                  ) : (
                    <Play className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={resetDemo}
          disabled={isRunning}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Analysis Results */}
      {demoTransaction && (
        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction Analysis
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(demoTransaction.status)}`}>
                {demoTransaction.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${demoTransaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {demoTransaction.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {demoTransaction.fromUser}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {demoTransaction.toUser}
                </p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Risk Score
                </span>
                <span className={`text-lg font-bold ${
                  demoTransaction.riskScore >= 80 ? 'text-red-600' :
                  demoTransaction.riskScore >= 50 ? 'text-amber-600' :
                  demoTransaction.riskScore >= 25 ? 'text-yellow-600' : 'text-bolt-green-600'
                }`}>
                  {demoTransaction.riskScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    demoTransaction.riskScore >= 80 ? 'bg-red-500' :
                    demoTransaction.riskScore >= 50 ? 'bg-amber-500' :
                    demoTransaction.riskScore >= 25 ? 'bg-yellow-500' : 'bg-bolt-green-500'
                  }`}
                  style={{ width: `${demoTransaction.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {demoTransaction.riskScore < 25 ? 'Low Risk - Transaction approved' :
                 demoTransaction.riskScore < 50 ? 'Medium Risk - Additional verification' :
                 demoTransaction.riskScore < 80 ? 'High Risk - Manual review required' :
                 'Critical Risk - Transaction blocked'}
              </p>
            </div>
          </div>

          {/* Analysis Progress */}
          {demoTransaction.status === 'analyzing' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Analyzing Transaction...
                </h3>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Running AI fraud detection algorithms...
              </p>
            </div>
          )}

          {/* Fraud Alerts */}
          {demoTransaction.alerts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Fraud Alerts Detected</span>
              </h3>
              
              <div className="space-y-3">
                {demoTransaction.alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${
                      alert.severity === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                      alert.severity === 'high' ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800' :
                      alert.severity === 'medium' ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' :
                      'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {alert.description}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="capitalize">Type: {alert.type}</span>
                          <span>Risk Points: +{alert.riskPoints}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Decision */}
          {demoTransaction.status !== 'analyzing' && (
            <div className={`rounded-xl p-6 border-2 ${
              demoTransaction.status === 'approved' 
                ? 'bg-bolt-green-50 dark:bg-bolt-green-900/20 border-bolt-green-300 dark:border-bolt-green-800'
                : demoTransaction.status === 'flagged'
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
            }`}>
              <div className="flex items-center space-x-3">
                {demoTransaction.status === 'approved' ? (
                  <CheckCircle className="w-8 h-8 text-bolt-green-600 dark:text-bolt-green-400" />
                ) : demoTransaction.status === 'flagged' ? (
                  <Eye className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    demoTransaction.status === 'approved' 
                      ? 'text-bolt-green-800 dark:text-bolt-green-200'
                      : demoTransaction.status === 'flagged'
                      ? 'text-amber-800 dark:text-amber-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {demoTransaction.status === 'approved' ? 'Transaction Approved' :
                     demoTransaction.status === 'flagged' ? 'Transaction Flagged for Review' :
                     'Transaction Blocked'}
                  </h3>
                  <p className={`text-sm ${
                    demoTransaction.status === 'approved' 
                      ? 'text-bolt-green-700 dark:text-bolt-green-300'
                      : demoTransaction.status === 'flagged'
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {demoTransaction.status === 'approved' 
                      ? 'Payment processed successfully with low fraud risk'
                      : demoTransaction.status === 'flagged'
                      ? 'Manual review required due to suspicious patterns'
                      : 'Payment blocked due to high fraud risk'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-bolt-green-600" />
          <span>How TrustPay Detects Fraud</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Velocity Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitors transaction frequency to detect rapid-fire attacks
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Amount Anomalies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compares transaction amounts to user's historical patterns
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Location Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identifies transactions from unusual geographic locations
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Pattern Recognition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI detects suspicious behavioral patterns and automation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDemo;