import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password is required' 
    });
  }
  
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  
  if (!ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server configuration error' 
    });
  }
  
  try {
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (isValid) {
      const token = jwt.sign(
        { admin: true, iat: Math.floor(Date.now() / 1000) },
        process.env.JWT_SECRET || 'your-very-secure-jwt-secret-key',
        { expiresIn: '1h' }
      );
      
      res.status(200).json({ 
        success: true, 
        token,
        message: 'Login successful' 
      });
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
}
