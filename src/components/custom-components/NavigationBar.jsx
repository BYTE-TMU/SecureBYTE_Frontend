import React from 'react';
import whiteLogo from '../../assets/white-logo.svg';
import ProfilePicture from './ProfilePicture';
export default function NavigationBar() {
  return (
    <nav className="w-screen h-16 bg-secure-blue z-11 flex flex-row justify-between p-5 items-center fixed">
      <img src={whiteLogo} className="h-6"></img>
      <ProfilePicture />
    </nav>
  );
}
