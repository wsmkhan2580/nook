export default function SkeletonCard() {
  return (
    <div className="ig-card" aria-hidden="true">
      <div className="ig-card__header">
        <div className="ig-card__author">
          <div className="skeleton skeleton--avatar-sm" />
          <div className="skeleton skeleton--line" style={{ width: 100, height: 10, marginBottom: 0 }} />
        </div>
      </div>
      <div className="skeleton skeleton--image" style={{ height: 380 }} />
      <div style={{ padding: "12px 14px" }}>
        <div className="skeleton skeleton--line skeleton--line-wide" />
        <div className="skeleton skeleton--line skeleton--line-narrow" />
      </div>
    </div>
  );
}
