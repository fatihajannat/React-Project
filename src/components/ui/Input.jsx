// components/ui/Input.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

// forwardRef is required so react-hook-form's register() ref works.
const Input = forwardRef(function Input(
  { label, error, className, type = 'text', as = 'input', ...rest },
  ref
) {
  const Tag = as; // 'input' or 'textarea'
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      )}
      <Tag
        ref={ref}
        type={as === 'input' ? type : undefined}
        className={clsx(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors',
          'placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/40',
          'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
          error
            ? 'border-coral-500 focus:border-coral-500'
            : 'border-slate-200 focus:border-brand-500 dark:border-slate-700',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs font-medium text-coral-600">{error}</p>}
    </label>
  );
});

export default Input;
