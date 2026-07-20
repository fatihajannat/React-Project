// components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Navbar({ isDark, onToggleDark }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold text-brand-700 dark:text-brand-400">
          Social<span className="text-coral-500">App</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/posts"
                className="hidden text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 sm:block"
              >
                Dashboard
              </Link>
              <Link to={`/profile/${currentUser.id}`}>
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
