import React from 'react';
import { Outlet } from 'react-router';
import NavigationBar from '../custom-components/NavigationBar';
import AppSidebar from '../custom-components/AppSidebar';
import AppHeader from '../custom-components/AppHeader';

export default function CoreLayout() {
  return (
    <>
      {/* <NavigationBar isSignedIn={isSignUp} /> */}
      <NavigationBar />
      <AppSidebar />
      {/* <AppSidebar handleSignOut={handleSignOut} /> */}
      <main className="w-screen">
        <AppHeader />
        <Outlet />
      </main>
    </>
  );
}
