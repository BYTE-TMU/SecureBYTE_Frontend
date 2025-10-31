import React, { useState } from 'react';
import ProfilePicture from './ProfilePicture';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Link } from 'react-router';
import { User, Bell, Github } from 'lucide-react';

export default function ProfileDropdown({ profilePic, hasGitHubIntegration = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer outline-none">
            <ProfilePicture profilePic={profilePic} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/notifications" className="flex items-center gap-2 cursor-pointer">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          {!hasGitHubIntegration && (
            <DropdownMenuItem asChild>
              <button className="flex items-center gap-2 w-full cursor-pointer">
                <Github className="h-4 w-4" />
                <span>Integrate GitHub</span>
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
