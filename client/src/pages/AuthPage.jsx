import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/authApi";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = isSignup
        ? await authApi.signup(username.trim(), password)
        : await authApi.login(username.trim(), password);
      loginUser(data);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{isSignup ? "Create an account" : "Welcome back"}</h1>
        <p className="auth-card__subtitle">
          {isSignup
            ? "Join to post under your own name and comment on posts."
            : "Log in to post, comment, and manage your posts."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-form__label">
            Username
            <input
              type="text"
              className="auth-form__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </label>

          <label className="auth-form__label">
            Password
            <div className="auth-form__password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-form__input auth-form__input--password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="auth-form__toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="btn btn--primary btn--lg auth-form__submit" disabled={loading}>
            {loading ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <p className="auth-card__switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Log in</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
