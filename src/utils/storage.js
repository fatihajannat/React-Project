// utils/storage.js
// Every read/write to localStorage goes through this file. Never call
// localStorage directly from a component — always go through `storage`.

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // ---- users ----
  getUsers: () => read(KEYS.USERS, []),
  setUsers: (users) => write(KEYS.USERS, users),

  // ---- posts ----
  getPosts: () => read(KEYS.POSTS, []),
  setPosts: (posts) => write(KEYS.POSTS, posts),

  // ---- comments ----
  getComments: () => read(KEYS.COMMENTS, []),
  setComments: (comments) => write(KEYS.COMMENTS, comments),

  // ---- likes ----
  getLikes: () => read(KEYS.LIKES, []),
  setLikes: (likes) => write(KEYS.LIKES, likes),

  // ---- current session ----
  getCurrentUser: () => read(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => write(KEYS.CURRENT_USER, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER),
};

// Generates a reasonably-unique id like "post_1737012345678_ab12cd"
export function generateId(prefix = 'id') {
  const time = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${time}_${random}`;
}
