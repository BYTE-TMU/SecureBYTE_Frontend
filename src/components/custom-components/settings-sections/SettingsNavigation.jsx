import { Link, NavLink } from 'react-router';

export default function SettingsNavigation() {
  return (
    <div className="rounded-md border-border grid grid-cols-3 justify-center mb-5 text-sm ">
      <NavLink
        to={'/settings/account'}
        className={({ isActive }) =>
          isActive ? 'active-settings-nav-button' : 'settings-nav-button'
        }
      >
        Account
      </NavLink>
      <NavLink
        to={'/settings/preferences'}
        className={({ isActive }) =>
          isActive ? 'active-settings-nav-button' : 'settings-nav-button'
        }
      >
        Preferences
      </NavLink>
      <NavLink
        to={'/settings/notifications'}
        className={({ isActive }) =>
          isActive ? 'active-settings-nav-button' : 'settings-nav-button'
        }
      >
        Notifications
      </NavLink>
    </div>
  );
}
