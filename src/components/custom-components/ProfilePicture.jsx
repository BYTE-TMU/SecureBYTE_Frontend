import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ProfilePicture({ profilePic }) {
  return (
    <Avatar>
      <AvatarImage
        src={profilePic ? profilePic : 'https://github.com/shadcn.png'}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
