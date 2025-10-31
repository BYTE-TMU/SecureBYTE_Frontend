import React from 'react';
import { useAuth } from '@/hooks/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Bell, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';

export default function NotificationsPage() {
  const { user } = useAuth();

  // Placeholder notifications data
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Welcome to SecureBYTE',
      message: 'Start by creating your first project',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-4xl text-secure-blue">Notifications</h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="max-w-3xl space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? 'opacity-60' : ''}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {notification.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {notification.message}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
