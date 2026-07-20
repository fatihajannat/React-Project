// pages/SignupPage.jsx
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  if (isAuthenticated) return <Navigate to="/dashboard/posts" replace />;

  function onSubmit(data) {
    setFormError('');
    setSubmitting(true);
    try {
      signup({ name: data.name, email: data.email, password: data.password });
      navigate('/login');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-slate-500">Join SocialApp in a few seconds.</p>

      {formError && (
        <p className="mb-4 rounded-lg bg-coral-50 px-3 py-2 text-sm text-coral-600 dark:bg-coral-900/20">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Asad Khan"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
          })}
        />
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
            minLength: { value: 8, message: 'Minimum 8 characters' },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*\d).+$/,
              message: 'Must include one uppercase letter and one number',
            },
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" className="w-full" isLoading={submitting}>
          Sign up
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
