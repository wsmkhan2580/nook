import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as api from "../api/postsApi";
import { useAuth } from "../context/AuthContext";
import Comments from "../components/Comments";
import ConfirmDialog from "../components/ConfirmDialog";

function fullDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PostDetail({ currentUserId, onDelete, onLike, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [copyLabel, setCopyLabel] = useState("Copy link");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchPostById(id);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isOwner = post?.author && user && post.author === user._id;

  const handleLike = async () => {
    const updated = await onLike(id, true);
    if (updated) setPost(updated);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await onDelete(id);
      navigate("/feed");
    } catch {
      // error toast already shown by onDelete
    }
  };

  const startEdit = () => {
    if (!isOwner) return;
    setEditValue(post.caption);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editValue.trim() || editValue === post.caption) {
      cancelEdit();
      return;
    }
    setSavingEdit(true);
    try {
      const updated = await api.updatePost(id, editValue.trim(), token);
      setPost(updated);
      setIsEditing(false);
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Press Ctrl+C");
    }
    setTimeout(() => setCopyLabel("Copy link"), 2000);
  };

  const handleAddComment = async (text) => {
    try {
      const updated = await api.addComment(id, text, token);
      setPost(updated);
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updated = await api.deleteComment(id, commentId, token);
      setPost(updated);
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="page page--wide">
        <div className="product__skeleton">
          <div className="skeleton skeleton--image" />
          <div className="product__skeleton-body">
            <div className="skeleton skeleton--line skeleton--line-wide" />
            <div className="skeleton skeleton--line skeleton--line-narrow" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page page--narrow">
        <p className="detail__status">{error || "Post not found"}</p>
        <Link to="/feed" className="btn btn--ghost">
          Back to feed
        </Link>
      </div>
    );
  }

  const hasLiked = post.likedBy?.includes(currentUserId);

  return (
    <div className="page page--wide">
      <Link to="/feed" className="detail__back">
        ← Back to all posts
      </Link>

      <div className="product">
        <div className="product__media">
          <img src={post.imageUrl} alt={post.caption} className="product__image" />
        </div>

        <div className="product__info">
          <div className="product__badge-row">
            <span className="product__badge">Post</span>
            <span className="product__author">by {post.authorName || "Anonymous"}</span>
          </div>

          {isEditing ? (
            <div className="product__edit">
              <textarea
                className="product__edit-textarea"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                maxLength={500}
                autoFocus
              />
              <div className="product__edit-actions">
                <button className="btn btn--primary" onClick={saveEdit} disabled={savingEdit}>
                  {savingEdit ? "Saving…" : "Save"}
                </button>
                <button className="btn btn--ghost" onClick={cancelEdit} disabled={savingEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h1
              className={`product__caption ${isOwner ? "product__caption--editable" : ""}`}
              onClick={startEdit}
              title={isOwner ? "Click to edit" : undefined}
            >
              {post.caption}
            </h1>
          )}

          <p className="product__date">Shared on {fullDate(post.createdAt)}</p>

          <div className="product__stat-row">
            <div className="product__stat">
              <span className="product__stat-value">{post.likes}</span>
              <span className="product__stat-label">
                {post.likes === 1 ? "Like" : "Likes"}
              </span>
            </div>
            <div className="product__stat">
              <span className="product__stat-value">{post.comments?.length || 0}</span>
              <span className="product__stat-label">
                {post.comments?.length === 1 ? "Comment" : "Comments"}
              </span>
            </div>
          </div>

          <div className="product__actions">
            <button
              className={`btn btn--primary btn--lg product__like-btn ${hasLiked ? "is-liked" : ""}`}
              onClick={handleLike}
            >
              <span className="card__like-icon">♥</span>
              {hasLiked ? "Liked" : "Like this post"}
            </button>

            <div className="product__actions-row">
              {isOwner && !isEditing && (
                <button className="btn btn--outline" onClick={startEdit}>
                  Edit caption
                </button>
              )}
              <button className="btn btn--outline" onClick={handleCopyLink}>
                {copyLabel}
              </button>
            </div>

            {isOwner && (
              <button className="card__delete product__remove" onClick={() => setConfirmOpen(true)}>
                Remove post
              </button>
            )}
          </div>

          <div className="product__divider" />

          <div className="product__meta-list">
            <div className="product__meta-row">
              <span>Post ID</span>
              <span className="product__meta-value">{post._id}</span>
            </div>
            <div className="product__meta-row">
              <span>Status</span>
              <span className="product__meta-value">Published</span>
            </div>
          </div>
        </div>
      </div>

      <Comments
        comments={post.comments || []}
        onAdd={handleAddComment}
        onDelete={handleDeleteComment}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this post?"
        message="This can't be undone — the post and its comments will be gone for good."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
