import { firebaseDB } from '../../lib/firebase';

export default async function handler(req, res) {
  try {
    // Get all data from Firebase
    const categories = await firebaseDB.getCategories();
    const playlists = await firebaseDB.getPlaylists();
    
    res.status(200).json({
      categories,
      playlists
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
