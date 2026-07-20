// pages/dashboard/DashboardLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const LINKS = [
  { to: '/dashboard/posts', label: 'My Posts', icon: '📝' },
  { to: '/dashboard/create', label: 'Create Post', icon: '➕' },
  { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4 py-8">
      <aside className="hidden w-48 flex-shrink-0 sm:block">
        <nav className="sticky top-20 space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
              end
            >
              <span>{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-slate-200 bg-white py-2 dark:border-slate-800 dark:bg-slate-900 sm:hidden">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx('flex flex-col items-center text-xs', isActive ? 'text-brand-600' : 'text-slate-400')
            }
            end
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="min-w-0 flex-1 pb-16 sm:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
