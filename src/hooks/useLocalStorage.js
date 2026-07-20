// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

// Generic "state that persists to localStorage" hook. Used for small,
// standalone bits of state (like the dark-mode preference) that don't
// need the structured helpers in utils/storage.js.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}
