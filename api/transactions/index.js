// Vercel serverless function for transactions
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return mock transactions
    const transactions = [
      {
        id: '1',
        amount: 150.00,
        currency: 'USD',
        type: 'payment',
        status: 'completed',
        timestamp: new Date().toISOString(),
        fromUser: 'user123',
        toUser: 'merchant456',
        riskScore: 15,
        metadata: { method: 'online' }
      },
      {
        id: '2',
        amount: 89.50,
        currency: 'USD',
        type: 'cashout',
        status: 'pending',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        fromUser: 'user123',
        toUser: 'bank_account',
        riskScore: 85,
        metadata: { method: 'bank_transfer' }
      },
      {
        id: '3',
        amount: 25.00,
        currency: 'USD',
        type: 'payment',
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        fromUser: 'user123',
        toUser: 'merchant789',
        riskScore: 5,
        metadata: { method: 'sms', fee: 0.01 }
      }
    ];

    res.status(200).json({
      transactions,
      totalVolume: 12500.00,
      successRate: 98.5
    });
  } else if (req.method === 'POST') {
    // Create new transaction
    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      timestamp: new Date().toISOString(),
      status: 'pending',
      riskScore: Math.floor(Math.random() * 100)
    };
    
    res.status(201).json(transaction);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}