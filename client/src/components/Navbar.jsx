import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || "?";
}

export default function Navbar({ postCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__mark">✦</span>
          <span className="navbar__title">Nook</span>
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links navbar__links--desktop">
          <NavLink to="/" end className="navbar__link">
            Home
          </NavLink>
          <NavLink to="/feed" className="navbar__link">
            All Posts
            {typeof postCount === "number" && postCount > 0 && (
              <span className="navbar__badge">{postCount}</span>
            )}
          </NavLink>
          <Link to="/create" className="navbar__link navbar__link--cta">
            New Post
          </Link>
          <span className="navbar__divider" />
          {user ? (
            <>
              <NavLink to="/profile" className="navbar__link navbar__user-link">
                <span className="navbar__avatar">{initials(user.username)}</span>
                {user.username}
              </NavLink>
              <button className="navbar__link navbar__link--plain" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar__link">
                Log in
              </NavLink>
              <Link to="/signup" className="navbar__link navbar__link--cta">
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile-only right cluster: profile circle + hamburger */}
        <div className="navbar__mobile-cluster">
          {user && (
            <Link to="/profile" className="navbar__avatar navbar__avatar--mobile" onClick={closeMenu}>
              {initials(user.username)}
            </Link>
          )}
          <button
            className={`navbar__hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="navbar__links navbar__links--mobile">
          <NavLink to="/" end className="navbar__link" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/feed" className="navbar__link" onClick={closeMenu}>
            All Posts
            {typeof postCount === "number" && postCount > 0 && (
              <span className="navbar__badge">{postCount}</span>
            )}
          </NavLink>
          <Link to="/create" className="navbar__link navbar__link--cta" onClick={closeMenu}>
            New Post
          </Link>
          {user ? (
            <>
              <NavLink to="/profile" className="navbar__link" onClick={closeMenu}>
                {user.username}
              </NavLink>
              <button className="navbar__link navbar__link--plain" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar__link" onClick={closeMenu}>
                Log in
              </NavLink>
              <Link to="/signup" className="navbar__link navbar__link--cta" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
