// components/post/PostCard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Avatar from '../ui/Avatar';
import { storage } from '../../utils/storage';
import { formatDate, truncate } from '../../utils/helpers';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';

// Accepts a `post` object, looks up its author from localStorage, and
// renders the card used on the Feed page and the Profile page.
export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { getLikesForPost, getCommentsForPost, hasUserLiked, toggleLike } = usePosts();
  // toggleLike writes straight to localStorage and doesn't touch React
  // state, so we bump this counter to force a re-render and pick up
  // the fresh like count/status immediately.
  const [, forceUpdate] = useState(0);

  const author = useMemo(
    () => storage.getUsers().find((u) => u.id === post.authorId),
    [post.authorId]
  );

  const likeCount = getLikesForPost(post.id).length;
  const commentCount = getCommentsForPost(post.id).length;
  const liked = hasUserLiked(post.id, currentUser?.id);

  function goToPost() {
    navigate(`/posts/${post.id}`);
  }

  function handleInteract(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    toggleLike(post.id, currentUser.id);
    forceUpdate((n) => n + 1);
  }

  return (
    <article
      onClick={goToPost}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60"
    >
      <div className="flex items-center gap-3">
        <Link to={`/profile/${post.authorId}`} onClick={(e) => e.stopPropagation()}>
          <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="md" />
        </Link>
        <div>
          <Link
            to={`/profile/${post.authorId}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">
        {truncate(post.description)}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="Post attachment"
          className="mt-3 max-h-96 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-700">
        <button
          onClick={handleInteract}
          className={liked ? 'font-semibold text-coral-500' : 'hover:text-coral-500'}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <span>💬 {commentCount}</span>
      </div>
    </article>
  );
}
