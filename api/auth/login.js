// Vercel serverless function for authentication
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  
  // Mock authentication for demo
  if (email === 'demo@trustpay.com' && password === 'demo123') {
    const user = {
      id: '1',
      email: 'demo@trustpay.com',
      name: 'Demo User',
      role: 'user',
      kycStatus: 'verified'
    };
    
    const token = 'mock_jwt_token_vercel_' + Date.now();
    
    res.status(200).json({ user, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}