import { DropdownMenuItem } from '../ui/dropdown-menu';
import { useAuth } from '@/hooks/auth/AuthContext';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <DropdownMenuItem
      onClick={async () => {
        await logout();
      }}
    >
      <LogOut />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
