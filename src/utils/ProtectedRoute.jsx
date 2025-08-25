import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/auth/AuthContext';
import LoadingPage from '@/components/pages/LoadingPage';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />; // Temporary loading page
  }

  if (!user) {
    return <Navigate to="/auth/signup" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
