import React, { useEffect } from 'react';
import { WifiOff, Wifi, FolderSync as Sync, Clock, MessageSquare, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  addPendingTransaction, 
  updateSyncStatus, 
  removeSyncedTransaction,
  setSyncProgress,
  setLastSyncTime,
  toggleSmsEnabled,
  toggleUssdEnabled
} from '../store/slices/offlineSlice';

const OfflineSync: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    isOnline, 
    pendingTransactions, 
    lastSyncTime, 
    syncProgress, 
    smsEnabled, 
    ussdEnabled 
  } = useAppSelector((state) => state.offline);

  const [syncing, setSyncing] = React.useState(false);

  const handleManualSync = async () => {
    if (!isOnline || syncing) return;
    
    setSyncing(true);
    dispatch(setSyncProgress(0));

    // Simulate syncing process
    for (let i = 0; i < pendingTransactions.length; i++) {
      const transaction = pendingTransactions[i];
      dispatch(updateSyncStatus({ localId: transaction.localId, status: 'syncing' }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        dispatch(removeSyncedTransaction(transaction.localId));
      } else {
        dispatch(updateSyncStatus({ localId: transaction.localId, status: 'failed' }));
      }
      
      dispatch(setSyncProgress(((i + 1) / pendingTransactions.length) * 100));
    }

    dispatch(setLastSyncTime(new Date().toISOString()));
    setSyncing(false);
    dispatch(setSyncProgress(0));
  };

  const createTestTransaction = () => {
    dispatch(addPendingTransaction({
      amount: Math.floor(Math.random() * 500) + 10,
      currency: 'USD',
      type: 'payment',
      fromUser: 'user_123',
      toUser: 'merchant_456',
      metadata: { 
        location: 'offline',
        created_offline: true 
      }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'syncing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'synced': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offline Sync</h1>
        <p className="text-gray-600">Manage offline transactions and sync settings</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
              {isOnline ? (
                <Wifi className="h-6 w-6 text-green-600" />
              ) : (
                <WifiOff className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isOnline ? 'Online' : 'Offline'}
              </h3>
              <p className="text-sm text-gray-500">
                {isOnline ? 'Connected to server' : 'No internet connection'}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {pendingTransactions.length}
              </h3>
              <p className="text-sm text-gray-500">Pending transactions</p>
            </div>
          </div>
        </div>

        {/* Last Sync */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Sync className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {lastSyncTime ? 'Synced' : 'Never'}
              </h3>
              <p className="text-sm text-gray-500">
                {lastSyncTime 
                  ? new Date(lastSyncTime).toLocaleString()
                  : 'No sync yet'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Sync Control</h3>
            <p className="text-sm text-gray-500">
              {pendingTransactions.length > 0 
                ? `${pendingTransactions.length} transactions waiting to sync`
                : 'All transactions are up to date'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={createTestTransaction}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Test Transaction
            </button>
            <button
              onClick={handleManualSync}
              disabled={!isOnline || pendingTransactions.length === 0 || syncing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sync className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>

        {syncing && syncProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Syncing transactions...</span>
              <span>{Math.round(syncProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Offline Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Offline Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Payments</h4>
                <p className="text-sm text-gray-500">Enable payments via SMS when offline</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleSmsEnabled())}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                smsEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  smsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">USSD Payments</h4>
                <p className="text-sm text-gray-500">Enable payments via USSD codes</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleUssdEnabled())}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                ussdEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  ussdEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Transactions List */}
      {pendingTransactions.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Transactions</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {pendingTransactions.map((transaction) => (
              <li key={transaction.localId} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.syncStatus)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        ${transaction.amount?.toFixed(2)} {transaction.currency}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.type} • {transaction.fromUser} → {transaction.toUser}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 capitalize">
                      {transaction.syncStatus.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-400">
                      Local ID: {transaction.localId.slice(-8)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OfflineSync;