import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const intervals = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || "?";
}

export default function PostItem({ post, currentUserId, onDelete, onLike }) {
  const [showBurst, setShowBurst] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState(null);
  const lastTap = useRef(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasLiked = post.likedBy?.includes(currentUserId);
  const isOwner = post.author && user && post.author === user._id;
  const canDelete = !post.author || isOwner;
  const authorName = post.authorName || "Anonymous";

  const handleDoubleTap = () => {
    if (!hasLiked) onLike(post._id);
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 700);
  };

  const handleImageClick = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    }
    lastTap.current = now;
  };

  const goToDetail = () => navigate(`/post/${post._id}`);
  const goToProfile = (e) => {
    e.stopPropagation();
    if (post.author) navigate(`/profile/${post.author}`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Check out this post on Nook", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopyLabel("Link copied!");
    } catch {
      // user cancelled share sheet or clipboard failed — no toast needed
    }
    setTimeout(() => setCopyLabel(null), 2000);
  };

  return (
    <article className="ig-card">
      {/* Header: avatar + username + menu */}
      <div className="ig-card__header">
        <div className="ig-card__author" onClick={goToProfile} style={{ cursor: post.author ? "pointer" : "default" }}>
          <span className="ig-card__avatar">{initials(authorName)}</span>
          <span className="ig-card__username">{authorName}</span>
        </div>
        {canDelete && (
          <button
            className="ig-card__menu"
            onClick={() => setConfirmOpen(true)}
            aria-label="Post options"
          >
            •••
          </button>
        )}
      </div>

      {/* Image */}
      <div className="ig-card__image-wrap" onClick={handleImageClick}>
        <img src={post.imageUrl} alt={post.caption} className="ig-card__image" loading="lazy" />
        {showBurst && <span className="ig-card__heart-burst">♥</span>}
      </div>

      {/* Action row: like, comment, share */}
      <div className="ig-card__actions">
        <div className="ig-card__actions-left">
          <button
            className={`ig-card__icon-btn ${hasLiked ? "is-liked" : ""}`}
            onClick={() => onLike(post._id)}
            aria-label={hasLiked ? "Unlike" : "Like"}
          >
            ♥
          </button>
          <button className="ig-card__icon-btn" onClick={goToDetail} aria-label="Comment">
            ◔
          </button>
          <button className="ig-card__icon-btn" onClick={handleShare} aria-label="Share">
            ➤
          </button>
        </div>
        <time className="ig-card__time">{timeAgo(post.createdAt)}</time>
      </div>

      {copyLabel && <p className="ig-card__copy-toast">{copyLabel}</p>}

      {/* Likes count */}
      <p className="ig-card__likes">
        {post.likes} {post.likes === 1 ? "like" : "likes"}
      </p>

      {/* Caption */}
      <p className="ig-card__caption">
        <span className="ig-card__username">{authorName}</span> {post.caption}
      </p>

      {/* Comment count link */}
      <button className="ig-card__comments-link" onClick={goToDetail}>
        {post.comments?.length > 0
          ? `View all ${post.comments.length} comment${post.comments.length === 1 ? "" : "s"}`
          : "Add a comment"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this post?"
        message="This can't be undone."
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(post._id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}
