const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Mock database
const mockData = {
  users: [
    {
      id: '1',
      email: 'demo@boltfinance.com',
      name: 'Demo User',
      role: 'user',
      kycStatus: 'verified'
    }
  ],
  transactions: [
    {
      id: '1',
      amount: 150.00,
      currency: 'USD',
      type: 'payment',
      status: 'completed',
      timestamp: new Date().toISOString(),
      fromUser: 'user123',
      toUser: 'driver456',
      riskScore: 15,
      metadata: { rideId: 'ride_789' }
    },
    {
      id: '2',
      amount: 89.50,
      currency: 'USD',
      type: 'cashout',
      status: 'pending',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      fromUser: 'driver456',
      toUser: 'wallet',
      riskScore: 8,
      metadata: { walletId: 'bolt_wallet_123' }
    }
  ],
  fraudAlerts: [
    {
      id: '1',
      transactionId: '2',
      type: 'velocity',
      severity: 'medium',
      description: 'Unusual transaction frequency detected',
      timestamp: new Date().toISOString(),
      status: 'active',
      metadata: { transactions_per_hour: 15 }
    }
  ]
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email === 'demo@boltfinance.com' && password === 'demo123') {
    const user = mockData.users[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({ user, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const user = mockData.users.find(u => u.id === req.user.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/transactions', authenticateToken, (req, res) => {
  res.json({
    transactions: mockData.transactions,
    totalVolume: 12500.00,
    successRate: 98.5
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  const transaction = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'pending',
    riskScore: Math.floor(Math.random() * 100)
  };
  
  mockData.transactions.unshift(transaction);
  res.json(transaction);
});

app.get('/api/fraud/alerts', authenticateToken, (req, res) => {
  res.json({
    alerts: mockData.fraudAlerts,
    riskScore: 22,
    blockedTransactions: 3,
    totalSaved: 2500.00
  });
});

app.post('/api/fraud/analyze/:transactionId', authenticateToken, (req, res) => {
  const { transactionId } = req.params;
  const shouldAlert = Math.random() > 0.7;
  
  const response = {
    riskScore: Math.floor(Math.random() * 100),
    alert: shouldAlert ? {
      id: Math.random().toString(36).substr(2, 9),
      transactionId,
      type: 'pattern',
      severity: 'low',
      description: 'Potential suspicious pattern detected',
      timestamp: new Date().toISOString(),
      status: 'active',
      metadata: {}
    } : null
  };
  
  if (response.alert) {
    mockData.fraudAlerts.unshift(response.alert);
  }
  
  res.json(response);
});

app.post('/api/bolt/verify-driver', authenticateToken, (req, res) => {
  const { id, licenseNumber, vehicleDetails } = req.body;
  
  // Mock driver verification
  const verified = Math.random() > 0.3; // 70% success rate
  
  res.json({
    verified,
    driverId: id,
    walletAddress: verified ? `bolt_wallet_${Math.random().toString(36).substr(2, 9)}` : null
  });
});

app.post('/api/bolt/cashout', authenticateToken, (req, res) => {
  const { amount, walletId } = req.body;
  
  res.json({
    transactionId: Math.random().toString(36).substr(2, 9),
    status: 'processing',
    estimatedTime: '2-5 minutes',
    amount,
    walletId
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});