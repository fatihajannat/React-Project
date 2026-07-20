// utils/helpers.js

// Turns an ISO timestamp into a short relative string like "3h ago".
// Falls back to a plain date once it's more than a week old.
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatJoinedDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });
}

// Reads a File (from an <input type="file">) and resolves it to a base64
// data URL, so it can be stored directly on a user/post object.
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function truncate(text, max = 220) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
