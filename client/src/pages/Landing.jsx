import { Link } from "react-router-dom";

export default function Landing({ postCount }) {
  return (
    <div className="hero">
      <div className="hero__content">
        <span className="hero__eyebrow">A quiet corner for your moments</span>
        <h1 className="hero__title">
          Share it.
          <br />
          Keep it in your <em>Nook</em>.
        </h1>
        <p className="hero__subtitle">
          A minimal space to post photos, see what's shared, and revisit
          moments — without the noise.
        </p>

        <div className="hero__actions">
          <Link to="/feed" className="btn btn--primary btn--lg">
            Browse Feed
          </Link>
          <Link to="/create" className="btn btn--outline btn--lg">
            Create a Post
          </Link>
        </div>

        {typeof postCount === "number" && (
          <p className="hero__stat">
            <strong>{postCount}</strong> {postCount === 1 ? "moment" : "moments"} shared so far
          </p>
        )}
      </div>

      <div className="hero__glow" aria-hidden="true" />
    </div>
  );
}
