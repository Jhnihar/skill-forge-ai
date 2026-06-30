import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCurrentUser = async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setCurrentUser(null);
      setIsEmailVerified(false);
      setUserProfile(null);
      return null;
    }

    await firebaseUser.reload();
    setCurrentUser(firebaseUser);
    setIsEmailVerified(Boolean(firebaseUser.emailVerified));
    return firebaseUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsEmailVerified(Boolean(user?.emailVerified));
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isEmailVerified,
    userProfile,
    loading,
    refreshCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
