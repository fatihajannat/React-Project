// components/post/PostActions.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Accepts postId + live counts/status from the parent (usePosts is the
// source of truth) and a toggleLike callback. Kept dumb/presentational
// so it can be reused anywhere a like/comment row is needed.
export default function PostActions({ likeCount, commentCount, liked, onToggleLike }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLike() {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    onToggleLike();
  }

  return (
    <div className="flex items-center gap-6 border-y border-slate-100 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
      <button
        onClick={handleLike}
        className={liked ? 'flex items-center gap-1.5 font-semibold text-coral-500' : 'flex items-center gap-1.5 hover:text-coral-500'}
      >
        <span className="text-lg">{liked ? '❤️' : '🤍'}</span>
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </button>
      <span className="flex items-center gap-1.5">
        <span className="text-lg">💬</span>
        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
      </span>
    </div>
  );
}
