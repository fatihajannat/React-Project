// components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Wraps any route that needs a logged-in user. If there's no currentUser,
// we bounce to /login and remember where the user was headed (`from`),
// so LoginPage could send them back there after a successful login.
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
