import React from 'react';
import { Outlet } from 'react-router';
import whiteLogo from '../../assets/white-logo.svg';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-screen grid grid-cols-2 ">
      <Outlet />
      <div className="bg-secure-blue p-11 flex items-start justify-end">
        <img src={whiteLogo} alt="Logo of SecureBYTE in black"></img>
      </div>
    </div>
  );
}
