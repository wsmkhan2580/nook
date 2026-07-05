import PostItem from "./PostItem";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";

export default function PostList({ posts, loading, error, currentUserId, onDelete, onLike, onRetry }) {
  if (loading) {
    return (
      <div className="feed">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <p className="feed-error__title">The feed didn't load</p>
        <p className="feed-error__message">{error}</p>
        <button className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
