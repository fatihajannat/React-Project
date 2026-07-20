// pages/dashboard/PostsDashboard.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatDate, truncate } from '../../utils/helpers';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';

function statusOf(post) {
  if (post.isDraft) return 'draft';
  return post.isPublic ? 'public' : 'private';
}

export default function PostsDashboard() {
  const { currentUser } = useAuth();
  const { posts, deletePost, updatePost, getLikesForPost, getCommentsForPost } = usePosts();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const myPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts, currentUser.id]
  );

  function togglePublicPrivate(post) {
    updatePost(post.id, { isPublic: !post.isPublic });
  }

  function publish(post) {
    updatePost(post.id, { isDraft: false, isPublic: true });
  }

  function confirmDelete() {
    deletePost(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        My Posts
      </h1>

      {myPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400 dark:border-slate-700">
          You haven't created any posts yet.{' '}
          <Link to="/dashboard/create" className="font-medium text-brand-600 hover:underline">
            Create your first post!
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                    {truncate(post.description, 90)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <Badge variant={statusOf(post)} />
                    <span>❤️ {getLikesForPost(post.id).length}</span>
                    <span>💬 {getCommentsForPost(post.id).length}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/dashboard/edit/${post.id}`}>
                  <Button size="sm" variant="secondary">Edit</Button>
                </Link>
                {post.isDraft ? (
                  <Button size="sm" variant="primary" onClick={() => publish(post)}>
                    Publish
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => togglePublicPrivate(post)}>
                    Make {post.isPublic ? 'Private' : 'Public'}
                  </Button>
                )}
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(post)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete this post?">
        <p className="text-sm text-slate-500">
          This will permanently remove the post along with its likes and comments. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
