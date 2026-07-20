// pages/dashboard/CreatePost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/post/PostForm';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';

export default function CreatePost() {
  const { currentUser } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [formKey, setFormKey] = useState(0); // remount PostForm to clear it

  function handleSave(data, { asDraft }) {
    setSubmitting(asDraft ? 'draft' : 'publish');
    createPost(data, currentUser.id);

    if (asDraft) {
      setDraftMessage('Post saved as draft');
      setFormKey((k) => k + 1); // clears the form
      setSubmitting(null);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Create Post
      </h1>

      {draftMessage && (
        <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {draftMessage}
        </p>
      )}

      <PostForm key={formKey} onSave={handleSave} submitting={submitting} />
    </div>
  );
}
