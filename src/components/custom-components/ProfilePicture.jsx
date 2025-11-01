import { useAuth } from '@/hooks/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

export default function ProfilePicture({ className }) {
  const { user } = useAuth();
  return (
    <Avatar className={cn('', className)}>
      <AvatarImage
        // src={profilePic ? profilePic : 'https://github.com/shadcn.png'}
        src={user.photoURL ? user.photoURL : 'https://github.com/shadcn.png'}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
