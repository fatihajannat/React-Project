// components/post/CommentSection.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Avatar from '../ui/Avatar';
import { storage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';

// Accepts a postId, reads comments filtered by that id, and handles
// adding/deleting. `version` is bumped by the parent whenever comments
// change elsewhere, so this stays in sync.
export default function CommentSection({ postId }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { getCommentsForPost, addComment, deleteComment } = usePosts();
  const [tick, setTick] = useState(0); // forces re-read from storage
  const [confirmingId, setConfirmingId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const comments = getCommentsForPost(postId);
  const users = storage.getUsers();
  const authorOf = (id) => users.find((u) => u.id === id);

  function onSubmit(data) {
    if (!data.text?.trim()) return;
    addComment(postId, currentUser.id, data.text.trim());
    reset();
    setTick((n) => n + 1);
  }

  function confirmDelete(id) {
    deleteComment(id);
    setConfirmingId(null);
    setTick((n) => n + 1);
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 flex gap-3">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <input
            {...register('text', { required: true })}
            placeholder="Write a comment…"
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-5 text-sm text-slate-400">
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>{' '}
          to comment
        </p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => {
          const author = authorOf(comment.authorId);
          const isOwner = currentUser?.id === comment.authorId;
          return (
            <li key={comment.id} className="flex gap-3">
              <Avatar src={author?.avatar} name={author?.name || '?'} size="sm" />
              <div className="flex-1 rounded-2xl bg-slate-100 px-4 py-2.5 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {author?.name || 'Unknown user'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{comment.text}</p>

                {isOwner && (
                  <div className="mt-1.5">
                    {confirmingId === comment.id ? (
                      <span className="text-xs text-slate-500">
                        Are you sure?{' '}
                        <button
                          onClick={() => confirmDelete(comment.id)}
                          className="font-semibold text-coral-600 hover:underline"
                        >
                          Yes
                        </button>{' '}
                        /{' '}
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="font-semibold text-slate-600 hover:underline dark:text-slate-300"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(comment.id)}
                        className="text-xs font-medium text-slate-400 hover:text-coral-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
