import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/AuthContext"; 

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div> // Temporary loading page
  }

  if (!user) {
    return <Navigate to="/auth/signup" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;