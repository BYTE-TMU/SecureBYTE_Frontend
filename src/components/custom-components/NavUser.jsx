import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { BellDot, CircleUser, EllipsisVertical, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/auth/AuthContext';
import ProfilePicture from './ProfilePicture';
import LogoutButton from './LogoutButton';
import { Link, useNavigate } from 'react-router';

export default function NavUser({ profilePic }) {
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-0">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              size="lg"
            >
              <ProfilePicture />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <ProfilePicture />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.displayName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={async () => {
                  navigate('/account');
                }}
              >
                <CircleUser />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  navigate('/notifications');
                }}
              >
                <BellDot /> Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  navigate('/settings');
                }}
              >
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
