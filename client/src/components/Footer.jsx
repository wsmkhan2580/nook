import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__mark">✦</span>
          <span className="footer__title">Nook</span>
        </div>

        <nav className="footer__links">
          <Link to="/" className="footer__link">Home</Link>
          <Link to="/feed" className="footer__link">All Posts</Link>
          <Link to="/create" className="footer__link">New Post</Link>
        </nav>

        <p className="footer__copy">© {year} Nook. A quiet corner for your moments.</p>
      </div>
    </footer>
  );
}
