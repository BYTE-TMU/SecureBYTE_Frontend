import React from 'react';
import whiteLogo from '../../assets/white-logo.svg';
import ProfilePicture from './ProfilePicture';
import { Button } from '../ui/button';
import { Plus, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router';

export default function NavigationBar() {
  // { isSignedIn }
  return false ? (
    <nav className="w-screen h-16 bg-secure-blue z-11 flex flex-row justify-between p-5 items-center fixed">
      <img src={whiteLogo} className="h-6"></img>
      <div className="flex gap-7">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
        >
          <Plus className="h-9 w-9" />
        </Button>
        <div className="rounded-full">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-l-full"
          >
            <Link to="/settings">
              <Settings className="h-9 w-9" />
            </Link>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-r-full"
          >
            <Bell className="h-9 w-9" />

          </Button>
        </div>
        <ProfilePicture />
      </div>
    </nav>

  ) : (
    <nav className="w-screen h-16 bg-secure-blue z-11 flex flex-row justify-between p-5 items-center fixed">
      <img src={whiteLogo} className="h-6"></img>
      <div className="flex gap-4">
        <Button
          type="button"
          size="default"
          variant="outline"
          className="bg-secure-blue text-white"
        >
          Sign In
        </Button>
        <Button
          type="button"
          size="default"
          variant="secondary"
          className="bg-secure-orange text-white hover:text-black"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
}
