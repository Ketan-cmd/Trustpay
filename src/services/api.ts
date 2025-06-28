import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API responses for demo purposes
const mockResponses = {
  login: {
    user: {
      id: '1',
      email: 'demo@trustpay.com',
      name: 'Demo User',
      role: 'user' as const,
      kycStatus: 'verified' as const,
    },
    token: 'mock_jwt_token_123456789',
  },
  transactions: {
    transactions: [
      {
        id: '1',
        amount: 150.00,
        currency: 'USD',
        type: 'payment' as const,
        status: 'completed' as const,
        timestamp: new Date().toISOString(),
        fromUser: 'user123',
        toUser: 'merchant456',
        riskScore: 15,
        metadata: { method: 'online' },
      },
      {
        id: '2',
        amount: 89.50,
        currency: 'USD',
        type: 'cashout' as const,
        status: 'pending' as const,
        timestamp: new Date(Date.now() - 30000).toISOString(),
        fromUser: 'user123',
        toUser: 'bank_account',
        riskScore: 85,
        metadata: { method: 'bank_transfer' },
      },
      {
        id: '3',
        amount: 25.00,
        currency: 'USD',
        type: 'payment' as const,
        status: 'completed' as const,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        fromUser: 'user123',
        toUser: 'merchant789',
        riskScore: 5,
        metadata: { method: 'sms', fee: 0.01 },
      },
    ],
    totalVolume: 12500.00,
    successRate: 98.5,
  },
  fraudAlerts: {
    alerts: [
      {
        id: '1',
        transactionId: '2',
        type: 'velocity' as const,
        severity: 'high' as const,
        description: 'High transaction velocity detected',
        timestamp: new Date().toISOString(),
        status: 'active' as const,
        metadata: { 
          transaction_count: 12,
          threshold: 10,
          time_window: '1 hour'
        },
      },
      {
        id: '2',
        transactionId: '2',
        type: 'amount' as const,
        severity: 'medium' as const,
        description: 'Transaction amount significantly higher than average',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        status: 'active' as const,
        metadata: { 
          amount: 89.50,
          average: 25.00,
          multiplier: 3.58
        },
      },
    ],
    riskScore: 22,
    blockedTransactions: 3,
    totalSaved: 2500.00,
  },
};

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponses.login;
  },
  verifyToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockResponses.login;
  },
};

export const transactionAPI = {
  getTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockResponses.transactions;
  },
  createTransaction: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending',
      riskScore: Math.floor(Math.random() * 100),
    };
  },
};

export const fraudAPI = {
  getAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockResponses.fraudAlerts;
  },
  analyzeTransaction: async (transactionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const shouldAlert = Math.random() > 0.7;
    return {
      riskScore: Math.floor(Math.random() * 100),
      alert: shouldAlert ? {
        id: Math.random().toString(36).substr(2, 9),
        transactionId,
        type: 'pattern' as const,
        severity: 'low' as const,
        description: 'Potential suspicious pattern detected',
        timestamp: new Date().toISOString(),
        status: 'active' as const,
        metadata: {},
      } : null,
    };
  },
};

export default api;