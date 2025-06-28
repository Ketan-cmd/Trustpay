import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign,
  Eye,
  CheckCircle,
  X,
  Search
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFraudAlerts, updateAlertStatus } from '../store/slices/fraudSlice';

const FraudDetection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, loading, riskScore, blockedTransactions, totalSaved } = useAppSelector((state) => state.fraud);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchFraudAlerts());
  }, [dispatch]);

  const handleStatusUpdate = (alertId: string, status: string) => {
    dispatch(updateAlertStatus({ id: alertId, status }));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': 
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium': 
        return <Clock className="h-5 w-5" />;
      case 'low': 
        return <Shield className="h-5 w-5" />;
      default: 
        return <Shield className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      name: 'Risk Score',
      value: riskScore,
      icon: Shield,
      color: riskScore > 50 ? 'text-red-600' : riskScore > 25 ? 'text-yellow-600' : 'text-green-600',
    },
    {
      name: 'Blocked Transactions',
      value: blockedTransactions,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      name: 'Total Saved',
      value: `$${totalSaved.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      name: 'Active Alerts',
      value: alerts.filter(a => a.status === 'active').length,
      icon: Eye,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fraud Detection</h1>
        <p className="text-gray-600">AI-powered fraud detection and risk management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Fraud Alerts</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading fraud alerts...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No fraud alerts found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <li key={alert.id} className="p-6">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{alert.description}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Transaction: {alert.transactionId}
                      </div>
                      <div className="flex items-center capitalize">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {alert.type} alert
                      </div>
                    </div>

                    {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Additional Details</h5>
                        <div className="mt-1 text-sm text-gray-600">
                          {Object.entries(alert.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {alert.status === 'active' && (
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(alert.id, 'investigating')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Investigate
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(alert.id, 'false_positive')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-gray-600 hover:bg-gray-700"
                        >
                          <X className="h-3 w-3 mr-1" />
                          False Positive
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FraudDetection;