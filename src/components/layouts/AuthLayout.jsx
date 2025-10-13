import React from 'react';
import { Navigate, Outlet } from 'react-router';
import whiteLogo from '../../assets/white-logo.svg';
import { useAuth } from '@/hooks/auth/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function AuthLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-screen grid grid-cols-2 ">
      {user ? (
        <Navigate to="/dashboard" replace /> // If user is authenticated, navigate directly to dashboard
      ) : (
        <Outlet />
      )}
      <div className="bg-secure-blue p-11 flex items-start justify-end">
        <img src={whiteLogo} alt="Logo of SecureBYTE in black"></img>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
