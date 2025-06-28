import React from 'react';
import { 
  User, 
  Shield, 
  CheckCircle, 
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Leaf,
  Moon,
  Sun
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { toggleDarkMode } from '../store/slices/themeSlice';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const menuItems = [
    { 
      icon: isDarkMode ? Sun : Moon, 
      label: isDarkMode ? 'Light Mode' : 'Dark Mode', 
      action: handleToggleDarkMode,
      toggle: true,
      isActive: isDarkMode
    },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: handleLogout, danger: true },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-bolt-green-600 to-bolt-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-bolt-green-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-bolt-green-100">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-bolt-green-300 rounded-full"></div>
              <span className="text-sm text-bolt-green-100">Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your account is protected</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700 dark:text-gray-300">Two-factor authentication</span>
            <CheckCircle className="w-5 h-5 text-bolt-green-600" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700 dark:text-gray-300">Fraud monitoring</span>
            <CheckCircle className="w-5 h-5 text-bolt-green-600" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700 dark:text-gray-300">Encrypted transactions</span>
            <CheckCircle className="w-5 h-5 text-bolt-green-600" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700 dark:text-gray-300">SMS payment backup</span>
            <CheckCircle className="w-5 h-5 text-bolt-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-bolt-green-100 dark:bg-bolt-green-900 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-bolt-green-600 dark:text-bolt-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Security</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Advanced fraud protection</p>
          </div>
        </div>
        
        <div className="bg-bolt-green-50 dark:bg-bolt-green-900/20 border border-bolt-green-200 dark:border-bolt-green-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-bolt-green-600 dark:text-bolt-green-400" />
            <p className="text-sm text-bolt-green-800 dark:text-bolt-green-200">
              <strong>AI Fraud Detection Active:</strong> Every transaction is monitored in real-time for suspicious activity.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
            } ${item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span className="text-base font-medium">{item.label}</span>
            </div>
            
            {item.toggle && (
              <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                item.isActive ? 'bg-bolt-green-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* App Info */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Leaf className="w-5 h-5 text-bolt-green-600" />
          <span className="text-base font-semibold text-gray-900 dark:text-white">TrustPay</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Bank the unbanked. Simply. Securely.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Profile;