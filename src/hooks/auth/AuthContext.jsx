import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { app } from '@/firebase';
import { useNavigate } from 'react-router';

const AuthContext = createContext();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');
githubProvider.addScope('repo');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize GitHub token from storage on load
    const token = localStorage.getItem('github_access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        'Auth state changed:',
        user ? `User logged in: ${user.uid}` : 'User logged out',
      );
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Re-direct to DashboardPage
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const signup = async (email, password) => {
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
      // Re-direct to DashboardPage
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };
  const githubSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (accessToken) {
        localStorage.setItem('github_access_token', accessToken);
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Common error to surface clearly when account exists with different provider
      setError(err.message || 'GitHub sign-in failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Clear any persisted GitHub token
    try {
      localStorage.removeItem('github_access_token');
      delete axios.defaults.headers.common['Authorization'];
    } catch (_) {}
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleSignIn,
        githubSignIn,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  // PUSH
}

export function useAuth() {
  return useContext(AuthContext);
}
