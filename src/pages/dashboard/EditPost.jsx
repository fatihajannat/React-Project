// pages/dashboard/EditPost.jsx
import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import PostForm from '../../components/post/PostForm';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';

export default function EditPost() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { getPostById, updatePost } = usePosts();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(null);

  const post = getPostById(postId);

  // Not found, or belongs to someone else — bounce back to the dashboard.
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function handleSave(data, { asDraft }) {
    setSubmitting(asDraft ? 'draft' : 'publish');
    updatePost(post.id, data);
    navigate('/dashboard/posts');
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Edit Post
      </h1>
      <PostForm initialValues={post} onSave={handleSave} submitting={submitting} />
    </div>
  );
}
