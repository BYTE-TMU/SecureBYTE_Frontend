import { useState } from 'react';
import { useAuth } from '@/hooks/auth/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Mail, User, Calendar, Lock, Eye, EyeOff, Edit } from 'lucide-react';
import { Separator } from '../../ui/separator';

export default function AccountSection() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');

  // Since Firebase doesn't expose passwords, we show a placeholder
  const passwordPlaceholder = '••••••••••••';

  const handleSaveName = () => {
    // TODO: Implement name update logic
    setIsEditingName(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback className="text-2xl">
                {user?.displayName?.[0] || user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.displayName || 'User'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Account Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Section */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            {isEditingName ? (
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your name"
                />
                <Button onClick={handleSaveName} size="sm">
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditingName(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {user?.displayName || 'Not set'}
                  </span>
                </div>
                <Button
                  onClick={() => setIsEditingName(true)}
                  size="sm"
                  variant="ghost"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Email Section */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">{user?.email}</span>
              <Button size="sm" variant="ghost" disabled>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed at this time
            </p>
          </div>

          <Separator />

          {/* Password Section */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                <span className="text-sm">
                  {showPassword
                    ? 'Your password is hidden for security'
                    : passwordPlaceholder}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button size="sm" variant="outline">
                Change
              </Button>
            </div>
          </div>

          <Separator />

          {/* Account Created Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Account Created
            </Label>
            <span className="text-sm">
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )
                : 'N/A'}
            </span>
          </div>

          {/* Last Sign In Section */}
          {user?.metadata?.lastSignInTime && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Sign In
                </Label>
                <span className="text-sm">
                  {new Date(user.metadata.lastSignInTime).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
