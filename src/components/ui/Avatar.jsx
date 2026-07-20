// components/ui/Avatar.jsx
import clsx from 'clsx';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-20 w-20 text-2xl',
};

// A stable palette keyed off the first letter, so the same name always
// gets the same colour instead of a random one on every render.
const PALETTE = [
  'bg-brand-500', 'bg-coral-500', 'bg-indigo-500',
  'bg-amber-500', 'bg-pink-500', 'bg-teal-500',
];

function colorFor(name) {
  const code = (name || '?').charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

export default function Avatar({ src, name = '', size = 'md', className }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover flex-shrink-0', SIZES[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white',
        colorFor(name),
        SIZES[size],
        className
      )}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
