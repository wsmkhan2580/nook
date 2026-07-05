import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export default function Comments({ comments, onAdd, onDelete }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments">
      <h3 className="comments__title">
        Comments {comments.length > 0 && <span>({comments.length})</span>}
      </h3>

      {user ? (
        <form className="comments__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="comments__input"
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
          />
          <button className="btn btn--primary" disabled={!text.trim() || submitting}>
            Post
          </button>
        </form>
      ) : (
        <p className="comments__login-hint">
          <Link to="/login">Log in</Link> to leave a comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="comments__empty">No comments yet — be the first.</p>
      ) : (
        <ul className="comments__list">
          {comments.map((c) => (
            <li key={c._id} className="comment">
              <div className="comment__body">
                <span className="comment__author">{c.authorName}</span>
                <span className="comment__text">{c.text}</span>
              </div>
              <div className="comment__meta">
                <time>{timeAgo(c.createdAt)}</time>
                {user?._id === c.author && (
                  <button className="comment__delete" onClick={() => onDelete(c._id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
