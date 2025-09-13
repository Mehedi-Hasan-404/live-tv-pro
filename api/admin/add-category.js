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
  const { name, playlistUrl, icon } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ 
      error: 'Category name is required and must be a string' 
    });
  }
  
  if (name.length > 100) {
    return res.status(400).json({ 
      error: 'Category name must be less than 100 characters' 
    });
  }
  
  if (!playlistUrl || typeof playlistUrl !== 'string') {
    return res.status(400).json({ 
      error: 'Playlist URL is required and must be a string' 
    });
  }
  
  // Validate URL format
  try {
    new URL(playlistUrl);
  } catch (e) {
    return res.status(400).json({ 
      error: 'Invalid playlist URL format' 
    });
  }
  
  // Optional icon validation - can be any valid image URL
  if (icon && typeof icon === 'string') {
    try {
      new URL(icon);
      // Optional: Check if it's an image URL by extension or content-type
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const lowerIcon = icon.toLowerCase();
      const hasImageExtension = imageExtensions.some(ext => lowerIcon.includes(ext));
      
      // If no image extension, we still allow it (could be dynamic image service)
      if (icon.length > 2000) {
        return res.status(400).json({ 
          error: 'Icon URL is too long (max 2000 characters)' 
        });
      }
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid icon URL format' 
      });
    }
  }
  
  try {
    const newCategory = await firebaseDB.addCategory(req.body);
    
    res.status(200).json({ 
      success: true, 
      message: 'Category added successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
}
