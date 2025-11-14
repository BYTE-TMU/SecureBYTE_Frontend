import { getNotificationTableColumns } from '../notification-table/columns';
import NotificationTable from '../notification-table/NotificationTable';

export default function NotificationsSection() {
  // Empty array for notifications - ready to be populated with real data
  const notifications = [];

  const columns = getNotificationTableColumns();

  return <NotificationTable columns={columns} data={notifications} />;
}
