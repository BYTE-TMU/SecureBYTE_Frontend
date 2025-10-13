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

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (error) => {
  const errorCode = error?.code;

  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.';

    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login or use a different email.';

    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';

    case 'auth/invalid-email':
      return 'Invalid email address. Please check and try again.';

    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method. Please try another method.';

    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';

    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';

    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in operations.';

    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';

    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';

    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
};

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
      setError(getAuthErrorMessage(err));
    }
  };

  const signup = async (email, password) => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  const googleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
      // Re-direct to DashboardPage
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
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
      setError(getAuthErrorMessage(err));
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
}

export function useAuth() {
  return useContext(AuthContext);
}
