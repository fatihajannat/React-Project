// pages/ProfilePage.jsx
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';
import { storage } from '../utils/storage';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts } = usePosts();

  const user = useMemo(() => storage.getUsers().find((u) => u.id === userId), [userId]);

  if (!user) return <Navigate to="/404" replace />;

  const isOwner = currentUser?.id === user.id;
  const publicPosts = posts
    .filter((p) => p.authorId === user.id && p.isPublic && !p.isDraft)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        onEditClick={() => navigate('/dashboard/settings')}
      />

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
        Posts
      </h2>

      {publicPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400 dark:border-slate-700">
          No public posts yet
        </p>
      ) : (
        <div className="space-y-4">
          {publicPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
