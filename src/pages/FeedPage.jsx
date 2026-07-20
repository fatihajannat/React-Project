// pages/FeedPage.jsx
import { useState, useMemo } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/post/PostCard';

export default function FeedPage() {
  const { posts } = usePosts();
  const [query, setQuery] = useState('');

  const publicPosts = useMemo(
    () =>
      posts
        .filter((p) => p.isPublic && !p.isDraft)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return publicPosts;
    const q = query.toLowerCase();
    return publicPosts.filter((p) => p.description.toLowerCase().includes(q));
  }, [publicPosts, query]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Feed
      </h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts…"
        className="mb-6 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800"
      />

      {publicPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400 dark:border-slate-700">
          No posts yet — be the first to share!
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400 dark:border-slate-700">
          No results found for "{query}"
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
