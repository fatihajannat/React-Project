// hooks/usePosts.js
import { useState, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';

// Every component that needs to read or mutate posts/likes/comments calls
// this hook. It wraps storage.js so components never talk to localStorage
// directly, and calling refresh() after a mutation keeps the UI in sync.
export function usePosts() {
  const [posts, setPosts] = useState(() => storage.getPosts());

  const refresh = useCallback(() => {
    setPosts(storage.getPosts());
  }, []);

  // ---- posts ----
  const createPost = useCallback((postData, authorId) => {
    const now = new Date().toISOString();
    const newPost = {
      id: generateId('post'),
      authorId,
      description: postData.description,
      image: postData.image || null,
      isPublic: !!postData.isPublic,
      isDraft: !!postData.isDraft,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...storage.getPosts(), newPost];
    storage.setPosts(next);
    setPosts(next);
    return newPost;
  }, []);

  const updatePost = useCallback((postId, updates) => {
    const next = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    storage.setPosts(next);
    setPosts(next);
  }, []);

  const deletePost = useCallback((postId) => {
    const next = storage.getPosts().filter((p) => p.id !== postId);
    storage.setPosts(next);
    setPosts(next);
    // also clean up dependent comments/likes so we don't leak orphans
    storage.setComments(storage.getComments().filter((c) => c.postId !== postId));
    storage.setLikes(storage.getLikes().filter((l) => l.postId !== postId));
  }, []);

  const getPostById = useCallback((postId) => {
    return storage.getPosts().find((p) => p.id === postId) || null;
  }, []);

  // ---- likes ----
  const getLikesForPost = useCallback((postId) => {
    return storage.getLikes().filter((l) => l.postId === postId);
  }, []);

  const hasUserLiked = useCallback((postId, userId) => {
    if (!userId) return false;
    return storage.getLikes().some((l) => l.postId === postId && l.userId === userId);
  }, []);

  // Toggles a like on/off for the given user, returns the new liked state
  const toggleLike = useCallback((postId, userId) => {
    const likes = storage.getLikes();
    const existing = likes.find((l) => l.postId === postId && l.userId === userId);
    if (existing) {
      storage.setLikes(likes.filter((l) => l.id !== existing.id));
      return false;
    }
    const newLike = {
      id: generateId('like'),
      postId,
      userId,
      createdAt: new Date().toISOString(),
    };
    storage.setLikes([...likes, newLike]);
    return true;
  }, []);

  // ---- comments ----
  const getCommentsForPost = useCallback((postId) => {
    return storage
      .getComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, []);

  const addComment = useCallback((postId, authorId, text) => {
    const newComment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    };
    storage.setComments([...storage.getComments(), newComment]);
    return newComment;
  }, []);

  const deleteComment = useCallback((commentId) => {
    storage.setComments(storage.getComments().filter((c) => c.id !== commentId));
  }, []);

  return {
    posts,
    refresh,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getLikesForPost,
    hasUserLiked,
    toggleLike,
    getCommentsForPost,
    addComment,
    deleteComment,
  };
}
