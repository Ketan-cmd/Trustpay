import React, { useEffect, useState } from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchFraudAlerts } from '../store/slices/fraudSlice';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transactions);
  const { alerts } = useAppSelector((state) => state.fraud);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchFraudAlerts());
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-bolt-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-bolt-green-600';
      case 'pending': return 'text-amber-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600';
    if (riskScore >= 40) return 'text-amber-600';
    return 'text-bolt-green-600';
  };

  const getTransactionAlert = (transactionId: string) => {
    return alerts.find(alert => alert.transactionId === transactionId);
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'payment' && amount > 0 ? '-' : '+';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bolt-green-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-base text-gray-600 dark:text-gray-400">Your payment history</p>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">Your transactions will appear here</p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const alert = getTransactionAlert(transaction.id);
            const isExpanded = selectedTransaction === transaction.id;
            
            return (
              <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedTransaction(isExpanded ? null : transaction.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {formatAmount(transaction.amount, transaction.type)}
                          </h3>
                          {alert && (
                            <Shield className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.type} • {transaction.toUser}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                          {new Date(transaction.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm font-medium capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Risk:</span>
                        <span className={`text-xs font-medium ${getRiskColor(transaction.riskScore)}`}>
                          {transaction.riskScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50 transition-colors">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Transaction ID</p>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">From</p>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.fromUser}</p>
                        </div>
                      </div>

                      {/* Fraud Alert Details */}
                      {alert && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Shield className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Fraud Alert: {alert.type}
                              </h4>
                              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                {alert.description}
                              </p>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-red-600 dark:text-red-400">
                                <span className="capitalize">Severity: {alert.severity}</span>
                                <span>
                                  {new Date(alert.timestamp).toLocaleString()}
                                </span>
                              </div>
                              
                              {/* Fraud Explanation */}
                              {alert.metadata && (
                                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-800 dark:text-red-200">
                                  <p className="font-medium">Why this was flagged:</p>
                                  {alert.type === 'velocity' && alert.metadata.transaction_count && (
                                    <p>• {alert.metadata.transaction_count} payments in 1 hour (limit: {alert.metadata.threshold || 10})</p>
                                  )}
                                  {alert.type === 'amount' && alert.metadata.multiplier && (
                                    <p>• Amount is {alert.metadata.multiplier.toFixed(1)}x higher than usual</p>
                                  )}
                                  {alert.type === 'pattern' && alert.metadata.pattern_type === 'round_amount' && (
                                    <p>• Round number amounts may indicate automation</p>
                                  )}
                                  {alert.type === 'pattern' && alert.metadata.pattern_type === 'unusual_time' && (
                                    <p>• Transaction made during unusual hours ({alert.metadata.hour}:00)</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Real-time Risk Score */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Score</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  transaction.riskScore >= 70 ? 'bg-red-500' :
                                  transaction.riskScore >= 40 ? 'bg-amber-500' : 'bg-bolt-green-500'
                                }`}
                                style={{ width: `${transaction.riskScore}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${getRiskColor(transaction.riskScore)}`}>
                              {transaction.riskScore}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {transaction.riskScore < 25 ? 'Low risk - Normal transaction' :
                           transaction.riskScore < 50 ? 'Medium risk - Monitor closely' :
                           transaction.riskScore < 75 ? 'High risk - Review required' :
                           'Critical risk - Immediate attention needed'}
                        </p>
                      </div>

                      {/* SMS Method Indicator */}
                      {transaction.metadata?.method === 'sms' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Sent via SMS</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Fee: ${transaction.metadata.fee?.toFixed(2) || '0.01'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Transactions;