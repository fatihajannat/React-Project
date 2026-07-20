// pages/dashboard/ProfileSettings.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { fileToBase64 } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const BIO_MAX = 150;

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  });

  const bio = watch('bio') || '';

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setAvatarPreview(base64);
  }

  function onSubmit(data) {
    setSaving(true);
    updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
    });
    setSuccessMessage('Profile updated successfully');
    setSaving(false);
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Profile Settings
      </h1>

      {successMessage && (
        <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
          <div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
            <p className="mt-1 text-xs text-slate-400">PNG or JPG, shown as a circle.</p>
          </div>
        </div>

        <Input
          label="Full Name"
          error={errors.name?.message}
          {...register('name', { required: 'Full name is required' })}
        />

        <div>
          <Input
            as="textarea"
            rows={3}
            label="Bio"
            placeholder="Tell people a bit about yourself"
            maxLength={BIO_MAX}
            {...register('bio', { maxLength: BIO_MAX })}
          />
          <p
            className={clsx(
              'mt-1 text-right text-xs',
              bio.length >= BIO_MAX ? 'text-coral-600' : 'text-slate-400'
            )}
          >
            {bio.length} / {BIO_MAX} characters
          </p>
        </div>

        <Input label="Location" placeholder="City, Country" {...register('location')} />

        <Button type="submit" isLoading={saving}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
