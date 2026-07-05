import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found__mark">◌</span>
      <h1 className="not-found__code">404</h1>
      <p className="not-found__title">This page doesn't exist</p>
      <p className="not-found__subtitle">
        The link might be broken, or the page may have moved.
      </p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          Go home
        </Link>
        <Link to="/feed" className="btn btn--outline">
          Browse feed
        </Link>
      </div>
    </div>
  );
}
