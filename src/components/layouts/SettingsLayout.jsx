import { Outlet } from 'react-router';
import { Separator } from '../ui/separator';
import SettingsNavigation from '../custom-components/settings-sections/SettingsNavigation';

export default function SettingsLayout() {
  // reference
  //  https://dribbble.com/shots/20424953-Settings-Page-SaaS-Product
  return (
    <main className="w-full min-h-screen flex flex-col p-5 gap-3">
      <div className="flex flex-col w-full gap-3">
        <div>
          <h2 className="font-bold text-4xl text-secure-blue">Settings</h2>
          <p className="text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <Separator orientation="horizontal" />
        <SettingsNavigation />
      </div>
      <Outlet />
    </main>
  );
}
