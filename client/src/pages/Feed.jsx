import { useState, useMemo } from "react";
import PostList from "../components/PostList";

export default function Feed({ posts, loading, error, currentUserId, onDelete, onLike, onRetry }) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.trim().toLowerCase();
    return posts.filter((p) => p.caption.toLowerCase().includes(q));
  }, [posts, query]);

  return (
    <div className="page">
      <div className="page__header">
        <div className="page__header-row">
          <div>
            <h2 className="page__title">All Posts</h2>
            <p className="page__subtitle">
              {posts.length} {posts.length === 1 ? "moment" : "moments"} shared, newest first.
            </p>
          </div>
        </div>

        {posts.length > 0 && (
          <div className="search-bar">
            <span className="search-bar__icon">⌕</span>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search captions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-bar__clear" onClick={() => setQuery("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {!loading && !error && query && filteredPosts.length === 0 ? (
        <div className="empty">
          <div className="empty__mark">⌕</div>
          <p className="empty__title">No matches for "{query}"</p>
          <p className="empty__subtitle">Try a different search term.</p>
        </div>
      ) : (
        <PostList
          posts={filteredPosts}
          loading={loading}
          error={error}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onLike={onLike}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}
