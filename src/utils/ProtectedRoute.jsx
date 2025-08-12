import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/auth/AuthContext"; 

const ProtectedRoute = () => {
  const user = useAuth();
  if (!user) return <Navigate to="/auth/signup" />;
  return <Outlet />;
};

export default ProtectedRoute;