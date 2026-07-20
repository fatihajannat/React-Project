// components/ui/Badge.jsx
import clsx from 'clsx';

const VARIANTS = {
  draft: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  public: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  private: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const LABELS = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
};

export default function Badge({ variant = 'draft', className }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANTS[variant],
        className
      )}
    >
      {LABELS[variant]}
    </span>
  );
}
