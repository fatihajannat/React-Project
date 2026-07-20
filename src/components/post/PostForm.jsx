// components/post/PostForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { fileToBase64 } from '../../utils/helpers';

const MAX_CHARS = 500;

// Shared by CreatePost and EditPost. `initialValues` pre-fills the form
// for editing; `onSave(data, { asDraft })` is called on submit.
export default function PostForm({ initialValues, onSave, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: initialValues?.description || '',
      isPublic: initialValues?.isPublic ?? true,
    },
  });

  const [imagePreview, setImagePreview] = useState(initialValues?.image || null);
  const description = watch('description') || '';
  const charCount = description.length;

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
  }

  function clearImage(e) {
    e.preventDefault();
    setImagePreview(null);
  }

  function submit(data, asDraft) {
    onSave(
      {
        description: data.description,
        image: imagePreview,
        isPublic: asDraft ? initialValues?.isPublic ?? true : !!data.isPublic,
        isDraft: asDraft,
      },
      { asDraft }
    );
  }

  const counterColor =
    charCount >= 480 ? 'text-coral-600' : charCount >= 400 ? 'text-amber-500' : 'text-slate-400';

  return (
    <form className="space-y-5">
      <div>
        <Input
          as="textarea"
          rows={5}
          label="Description"
          placeholder="What's on your mind?"
          error={errors.description?.message}
          maxLength={MAX_CHARS}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Minimum 10 characters' },
          })}
        />
        <p className={clsx('mt-1 text-right text-xs font-medium', counterColor)}>
          {charCount} / {MAX_CHARS} characters
        </p>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Image
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-slate-800 dark:file:text-brand-300"
        />
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Selected preview"
              className="max-h-64 rounded-xl object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white shadow hover:bg-coral-500"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Visibility
        </span>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" value="true" {...register('isPublic')} defaultChecked />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="" {...register('isPublic')} />
            Private
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          isLoading={submitting === 'draft'}
          onClick={handleSubmit((data) => submit(data, true))}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          isLoading={submitting === 'publish'}
          disabled={charCount >= MAX_CHARS + 1}
          onClick={handleSubmit((data) => submit(data, false))}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
