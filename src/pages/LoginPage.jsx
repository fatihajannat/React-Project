// pages/LoginPage.jsx
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Already logged in? Don't show the login form.
  if (isAuthenticated) return <Navigate to="/dashboard/posts" replace />;

  const infoMessage = location.state?.message;

  function onSubmit(data) {
    setFormError('');
    setSubmitting(true);
    try {
      login(data.email, data.password);
      navigate(location.state?.from?.pathname || '/dashboard/posts', { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-slate-500">Log in to your SocialApp account.</p>

      {infoMessage && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          {infoMessage}
        </p>
      )}
      {formError && (
        <p className="mb-4 rounded-lg bg-coral-50 px-3 py-2 text-sm text-coral-600 dark:bg-coral-900/20">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          })}
        />
        <Button type="submit" className="w-full" isLoading={submitting}>
          Log in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
