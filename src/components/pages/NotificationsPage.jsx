import React from 'react';
import NotificationTable from '../custom-components/notification-table/NotificationTable';
import { getNotificationTableColumns } from '../custom-components/notification-table/columns';

export default function NotificationsPage() {
  // Empty array for notifications - ready to be populated with real data
  const notifications = [];

  const columns = getNotificationTableColumns();

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue mb-6">Notifications</h1>
      <NotificationTable columns={columns} data={notifications} />
    </main>
  );
}
