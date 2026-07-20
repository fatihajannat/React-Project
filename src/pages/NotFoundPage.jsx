// pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-5xl font-bold text-brand-600">404</h1>
      <p className="mt-3 text-slate-500">This page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block font-medium text-brand-600 hover:underline">
        Back to Feed
      </Link>
    </div>
  );
}
