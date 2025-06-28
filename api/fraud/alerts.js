// Vercel serverless function for fraud alerts
export default function handler(req, res) {
  const alerts = [
    {
      id: '1',
      transactionId: '2',
      type: 'velocity',
      severity: 'high',
      description: 'High transaction velocity detected',
      timestamp: new Date().toISOString(),
      status: 'active',
      metadata: { 
        transaction_count: 12,
        threshold: 10,
        time_window: '1 hour'
      }
    },
    {
      id: '2',
      transactionId: '2',
      type: 'amount',
      severity: 'medium',
      description: 'Transaction amount significantly higher than average',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      status: 'active',
      metadata: { 
        amount: 89.50,
        average: 25.00,
        multiplier: 3.58
      }
    }
  ];

  res.status(200).json({
    alerts,
    riskScore: 22,
    blockedTransactions: 3,
    totalSaved: 2500.00
  });
}