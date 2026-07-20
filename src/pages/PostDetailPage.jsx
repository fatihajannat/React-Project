// pages/PostDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import PostActions from '../components/post/PostActions';
import CommentSection from '../components/post/CommentSection';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

export default function PostDetailPage() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { getPostById, getLikesForPost, hasUserLiked, toggleLike, getCommentsForPost } =
    usePosts();
  const [, setTick] = useState(0);

  const post = getPostById(postId);
  if (!post) return <Navigate to="/404" replace />;

  const author = storage.getUsers().find((u) => u.id === post.authorId);
  const likeCount = getLikesForPost(post.id).length;
  const commentCount = getCommentsForPost(post.id).length;
  const liked = hasUserLiked(post.id, currentUser?.id);

  function handleToggleLike() {
    toggleLike(post.id, currentUser.id);
    setTick((n) => n + 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author?.id}`}>
            <Avatar src={author?.avatar} name={author?.name || '?'} size="md" />
          </Link>
          <div>
            <Link
              to={`/profile/${author?.id}`}
              className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100"
            >
              {author?.name || 'Unknown user'}
            </Link>
            <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">
          {post.description}
        </p>

        {post.image && (
          <img src={post.image} alt="Post attachment" className="mt-4 w-full rounded-xl object-cover" />
        )}

        <div className="mt-4">
          <PostActions
            likeCount={likeCount}
            commentCount={commentCount}
            liked={liked}
            onToggleLike={handleToggleLike}
          />
        </div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
