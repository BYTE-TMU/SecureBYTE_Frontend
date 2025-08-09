import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '@/firebase';

const AuthContext = createContext();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    // e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };
  const signup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const googleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, googleSignIn, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
