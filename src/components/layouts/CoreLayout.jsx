import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../custom-components/NavigationBar';
import AppSidebar from '../custom-components/AppSidebar';
import AppHeader from '../custom-components/AppHeader';

export default function CoreLayout() {
  return (
    <>
      <NavigationBar />
      <AppSidebar />
      <main className="w-screen">
        <AppHeader />
        <Outlet />
      </main>
    </>
  );
}
