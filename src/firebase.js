// Firebase Configuration
// Replace these with your actual Firebase config values
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWecEwBbhPv7izsmFkF4m41IINDzMsLWg",
  authDomain: "skillforge-ai-ad354.firebaseapp.com",
  projectId: "skillforge-ai-ad354",
  storageBucket: "skillforge-ai-ad354.firebasestorage.app",
  messagingSenderId: "818325986353",
  appId: "1:818325986353:web:96909be8ba4395b0f0c910"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
