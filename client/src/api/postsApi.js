const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

// GET all posts
export const fetchPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Could not load the feed");
  return res.json();
};

// GET the logged-in user's own posts
export const fetchMyPosts = async (token) => {
  const res = await fetch(`${API_URL}/posts/user/mine`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Could not load your posts");
  return res.json();
};

// GET any user's public posts by their user ID
export const fetchPostsByUser = async (userId) => {
  const res = await fetch(`${API_URL}/posts/user/${userId}`);
  if (!res.ok) throw new Error("Could not load posts");
  return res.json();
};

// GET a single post by id
export const fetchPostById = async (id) => {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error("Could not load this post");
  return res.json();
};

// POST a new post — sends FormData (caption + image file). Token optional —
// logged-in users get named authorship, anonymous still works.
export const createPost = async (formData, token) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Could not create the post");
  }
  return res.json();
};

// PUT update a post's caption — requires the author's token
export const updatePost = async (id, caption, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ caption }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Could not update the post");
  }
  return res.json();
};

// DELETE a post by id — requires the author's token
export const deletePost = async (id, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Could not delete the post");
  }
  return res.json();
};

// PATCH like/unlike a post — toggles based on userId, once per user
export const likePost = async (id, userId) => {
  const res = await fetch(`${API_URL}/posts/${id}/like`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Could not like the post");
  return res.json();
};

// POST a comment — requires login
export const addComment = async (id, text, token) => {
  const res = await fetch(`${API_URL}/posts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Could not add comment");
  }
  return res.json();
};

// DELETE a comment — requires login (only the comment's author)
export const deleteComment = async (postId, commentId, token) => {
  const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Could not delete comment");
  }
  return res.json();
};
