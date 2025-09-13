import { firebaseDB } from '../../lib/firebase';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Input validation
  const { name, url, category, logo } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ 
      error: 'Playlist name is required and must be a string' 
    });
  }
  
  if (name.length > 100) {
    return res.status(400).json({ 
      error: 'Playlist name must be less than 100 characters' 
    });
  }
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ 
      error: 'Playlist URL is required and must be a string' 
    });
  }
  
  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ 
      error: 'Invalid playlist URL format' 
    });
  }
  
  // Optional logo validation - can be any valid image URL
  if (logo && typeof logo === 'string') {
    try {
      new URL(logo);
      // Optional: Basic validation for image URLs
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const lowerLogo = logo.toLowerCase();
      const hasImageExtension = imageExtensions.some(ext => lowerLogo.includes(ext));
      
      // If no image extension, we still allow it
      if (logo.length > 2000) {
        return res.status(400).json({ 
          error: 'Logo URL is too long (max 2000 characters)' 
        });
      }
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid logo URL format' 
      });
    }
  }
  
  try {
    const newPlaylist = await firebaseDB.addPlaylist(req.body);
    
    res.status(200).json({ 
      success: true, 
      message: 'Playlist added successfully',
      playlist: newPlaylist
    });
  } catch (error) {
    console.error('Error adding playlist:', error);
    res.status(500).json({ error: 'Failed to add playlist' });
  }
}
