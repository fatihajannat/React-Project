// context/AuthContext.jsx
import { createContext, useState } from 'react';
import { storage, generateId } from '../utils/storage';

export const AuthContext = createContext(null);

// Strips the password field before anything touches state/localStorage
// under the `currentUser` key — we never want a password sitting around
// in the "logged in" session object.
function toSafeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export function AuthProvider({ children }) {
  // Lazy initializer so we only read localStorage once, on first mount.
  // This is what makes a logged-in session survive a page refresh.
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());

  function signup({ name, email, password }) {
    const users = storage.getUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password,
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
    };

    storage.setUsers([...users, newUser]);
    return toSafeUser(newUser);
  }

  function login(email, password) {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password');
    }
    const safe = toSafeUser(found);
    setCurrentUser(safe);
    storage.setCurrentUser(safe);
    return safe;
  }

  function logout() {
    setCurrentUser(null);
    storage.clearCurrentUser();
  }

  // Merges partial updates into the current user, and keeps state,
  // the `currentUser` session key, AND the master `users` array all
  // in sync — this is what makes profile edits show up immediately
  // in the navbar without a refresh.
  function updateCurrentUser(updatedData) {
    if (!currentUser) return;

    const merged = { ...currentUser, ...updatedData };
    setCurrentUser(merged);
    storage.setCurrentUser(merged);

    const users = storage.getUsers();
    const nextUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, ...updatedData } : u
    );
    storage.setUsers(nextUsers);
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
