import React, { useEffect, useState } from 'react';
import { Send, DollarSign, WifiOff, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { addPendingTransaction } from '../store/slices/offlineSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { totalVolume } = useAppSelector((state) => state.transactions);
  const { isOnline, pendingTransactions } = useAppSelector((state) => state.offline);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [cashoutAmount, setCashoutAmount] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const balance = 1250.75; // Mock balance

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      // Offline SMS flow
      dispatch(addPendingTransaction({
        amount: parseFloat(sendAmount),
        currency: 'USD',
        type: 'payment',
        fromUser: 'current_user',
        toUser: sendTo,
        metadata: { 
          method: 'sms',
          fee: 0.01 
        }
      }));
      alert('Payment queued for SMS processing. Fee: 1¢');
    } else {
      // Online processing
      alert('Payment sent successfully!');
    }
    
    setShowSendModal(false);
    setSendAmount('');
    setSendTo('');
  };

  const handleCashout = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cashout request submitted!');
    setShowCashoutModal(false);
    setCashoutAmount('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-bolt-green-600 to-bolt-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-bolt-green-100 text-base">Available Balance</p>
            <h2 className="text-3xl font-bold">${balance.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 bg-bolt-green-500 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        
        {pendingTransactions.length > 0 && (
          <div className="bg-bolt-green-500 rounded-lg p-3 mt-4">
            <p className="text-sm text-bolt-green-100">
              {pendingTransactions.length} transactions pending sync
            </p>
          </div>
        )}
      </div>

      {/* Offline Mode Alert */}
      {!isOnline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start space-x-3 transition-colors">
          <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-base font-medium text-amber-800 dark:text-amber-200">Offline Mode</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Payments will be sent via SMS. Fee: 1¢ per transaction.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-bolt-green-600 hover:bg-bolt-green-700 text-white rounded-xl p-6 flex flex-col items-center space-y-3 transition-colors"
        >
          <div className="w-12 h-12 bg-bolt-green-500 rounded-full flex items-center justify-center">
            {!isOnline ? <MessageSquare className="w-6 h-6" /> : <Send className="w-6 h-6" />}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Send Money</h3>
            <p className="text-sm text-bolt-green-100">
              {!isOnline ? 'Via SMS' : 'Instant transfer'}
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowCashoutModal(true)}
          className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-xl p-6 flex flex-col items-center space-y-3 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Cash Out</h3>
            <p className="text-sm text-gray-300">To Bolt Wallet</p>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">This Month</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sent</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${totalVolume.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
          </div>
        </div>
      </div>

      {/* Send Money Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Send Money</h3>
            
            {!isOnline && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-700 dark:text-amber-300">SMS fee: 1¢</p>
              </div>
            )}
            
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bolt-green-500 focus:border-bolt-green-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {!isOnline ? 'Phone Number' : 'Recipient'}
                </label>
                <input
                  type="text"
                  required
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bolt-green-500 focus:border-bolt-green-500 transition-colors"
                  placeholder={!isOnline ? '+1234567890' : 'Enter recipient'}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 py-3 px-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-base font-medium text-white bg-bolt-green-600 rounded-lg hover:bg-bolt-green-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cash Out Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cash Out</h3>
            
            <form onSubmit={handleCashout} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value)}
                  className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bolt-green-500 focus:border-bolt-green-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Funds will be transferred to your Bolt Wallet within 2-5 minutes.
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCashoutModal(false)}
                  className="flex-1 py-3 px-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-base font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                >
                  Cash Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;