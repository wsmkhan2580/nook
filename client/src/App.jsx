import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetail from "./pages/PostDetail";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import * as api from "./api/postsApi";
import { getUserId } from "./utils/userId";

function AppShell() {
  const { user, token, ready } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Logged-in users are tracked by their real account ID, so switching
  // accounts on the same browser correctly resets what "you" have liked.
  // Logged-out visitors fall back to a per-browser anonymous ID.
  const currentUserId = user?._id || getUserId();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2800);
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreate = async (formData, onSuccess) => {
    setIsSubmitting(true);
    try {
      const newPost = await api.createPost(formData, token);
      setPosts((prev) => [newPost, ...prev]);
      showToast("Posted to your nook");
      onSuccess?.();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = posts;
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await api.deletePost(id, token);
      showToast("Post removed");
    } catch (err) {
      setPosts(previous);
      showToast(err.message, "error");
      throw err;
    }
  };

  const handleLike = async (id, returnUpdated = false) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== id) return p;
        const hasLiked = p.likedBy?.includes(currentUserId);
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          likedBy: hasLiked
            ? p.likedBy.filter((uid) => uid !== currentUserId)
            : [...(p.likedBy || []), currentUserId],
        };
      })
    );

    try {
      const updated = await api.likePost(id, currentUserId);
      setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      if (returnUpdated) return updated;
    } catch (err) {
      showToast(err.message, "error");
      loadPosts();
    }
  };

  if (!ready) return null; // wait for auth session to restore before rendering

  return (
    <div className="app">
      <Navbar postCount={posts.length} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Landing postCount={posts.length} />} />
          <Route
            path="/feed"
            element={
              <Feed
                posts={posts}
                loading={loading}
                error={error}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onLike={handleLike}
                onRetry={loadPosts}
              />
            }
          />
          <Route
            path="/create"
            element={<CreatePostPage onCreate={handleCreate} isSubmitting={isSubmitting} />}
          />
          <Route
            path="/post/:id"
            element={
              <PostDetail
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onLike={handleLike}
                showToast={showToast}
              />
            }
          />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
