// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, push, update, remove } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKz_hVm9a34Us36M4Uu7MlIEE47wH-5Ds",
  authDomain: "live-tv-pro-302b8.firebaseapp.com",
  projectId: "live-tv-pro-302b8",
  storageBucket: "live-tv-pro-302b8.firebasestorage.app",
  messagingSenderId: "536478798061",
  appId: "1:536478798061:web:eadca349b64e14c48ffce4",
  measurementId: "G-LW16BGCNZQ",
  databaseURL: "https://live-tv-pro-302b8-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Data access functions
export const firebaseDB = {
  // Categories
  getCategories: async () => {
    try {
      const snapshot = await get(child(ref(database), 'categories'));
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },
  
  addCategory: async (category) => {
    try {
      const newCategoryRef = push(ref(database, 'categories'));
      const categoryWithId = { ...category, id: newCategoryRef.key, createdAt: new Date().toISOString() };
      await set(newCategoryRef, categoryWithId);
      return categoryWithId;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },
  
  // Playlists
  getPlaylists: async () => {
    try {
      const snapshot = await get(child(ref(database), 'playlists'));
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  },
  
  addPlaylist: async (playlist) => {
    try {
      const newPlaylistRef = push(ref(database, 'playlists'));
      const playlistWithId = { ...playlist, id: newPlaylistRef.key, createdAt: new Date().toISOString() };
      await set(newPlaylistRef, playlistWithId);
      return playlistWithId;
    } catch (error) {
      console.error('Error adding playlist:', error);
      throw error;
    }
  },
  
  // Update data
  updateCategory: async (id, data) => {
    try {
      await update(ref(database, `categories/${id}`), data);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  updatePlaylist: async (id, data) => {
    try {
      await update(ref(database, `playlists/${id}`), data);
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },
  
  // Delete data
  deleteCategory: async (id) => {
    try {
      await remove(ref(database, `categories/${id}`));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  
  deletePlaylist: async (id) => {
    try {
      await remove(ref(database, `playlists/${id}`));
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  }
};
