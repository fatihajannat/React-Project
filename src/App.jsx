// App.jsx — all routes are defined here. Every page is lazy-loaded with
// React.lazy() so each one becomes its own JS chunk that only downloads
// when the user actually navigates there, wrapped in a single Suspense.
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RequireAuth from './components/RequireAuth';
import { useLocalStorage } from './hooks/useLocalStorage';

const FeedPage = lazy(() => import('./pages/FeedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'));
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'));
const EditPost = lazy(() => import('./pages/dashboard/EditPost'));
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'));

function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);

  // Bonus: dark mode — the preference persists via useLocalStorage, and
  // this effect toggles Tailwind's `dark` class on <html> so every
  // `dark:` utility class in the app responds to it.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />

      <div className="flex-1">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<PostsDashboard />} />
              <Route path="posts" element={<PostsDashboard />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:postId" element={<EditPost />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
