import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/authApi";
import * as postsApi from "../api/postsApi";

function joinedDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || "?";
}

export default function ProfilePage() {
  const { userId } = useParams(); // present only on /profile/:userId (viewing someone else)
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = !userId || (user && userId === user._id);

  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    if (isOwnProfile && !user) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (isOwnProfile) {
          const [profileData, posts] = await Promise.all([
            authApi.getMe(token),
            postsApi.fetchMyPosts(token),
          ]);
          if (!cancelled) {
            setProfile(profileData);
            setMyPosts(posts);
          }
        } else {
          const [profileData, posts] = await Promise.all([
            authApi.getUserProfile(userId),
            postsApi.fetchPostsByUser(userId),
          ]);
          if (!cancelled) {
            setProfile(profileData);
            setMyPosts(posts);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, userId, user, token, navigate]);

  const stats = useMemo(() => {
    const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalComments = myPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
    return { posts: myPosts.length, likes: totalLikes, comments: totalComments };
  }, [myPosts]);

  const startEditBio = () => {
    if (!isOwnProfile) return;
    setBioValue(profile.bio || "");
    setIsEditingBio(true);
  };

  const saveBio = async () => {
    setSavingBio(true);
    try {
      const updated = await authApi.updateProfile(bioValue.trim(), token);
      setProfile(updated);
      updateUser({ bio: updated.bio });
      setIsEditingBio(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingBio(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isOwnProfile && !user) return null;

  if (loading) {
    return (
      <div className="page page--wide">
        <div className="profile-card profile-card--skeleton">
          <div className="skeleton skeleton--avatar" />
          <div className="skeleton skeleton--line skeleton--line-wide" />
          <div className="skeleton skeleton--line skeleton--line-narrow" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page page--narrow">
        <p className="detail__status">{error || "Profile not found"}</p>
        <Link to="/feed" className="btn btn--ghost">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="page page--wide">
      <div className="profile-card">
        <div className="profile-card__banner" />

        <div className="profile-card__body">
          <div className="profile-card__avatar">{initials(profile?.username)}</div>

          <div className="profile-card__headline">
            <h1 className="profile-card__name">{profile?.username}</h1>
            <p className="profile-card__joined">
              Member since {joinedDate(profile?.createdAt)}
            </p>
          </div>

          {isEditingBio ? (
            <div className="profile-card__bio-edit">
              <textarea
                className="profile-card__bio-textarea"
                value={bioValue}
                onChange={(e) => setBioValue(e.target.value)}
                maxLength={160}
                rows={2}
                placeholder="Tell people a little about yourself…"
                autoFocus
              />
              <div className="profile-card__bio-actions">
                <span className="profile-card__bio-counter">{bioValue.length}/160</span>
                <div className="profile-card__bio-buttons">
                  <button className="btn btn--ghost" onClick={() => setIsEditingBio(false)} disabled={savingBio}>
                    Cancel
                  </button>
                  <button className="btn btn--primary" onClick={saveBio} disabled={savingBio}>
                    {savingBio ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p
              className="profile-card__bio"
              onClick={startEditBio}
              title={isOwnProfile ? "Click to edit" : undefined}
              style={{ cursor: isOwnProfile ? "pointer" : "default" }}
            >
              {profile?.bio || (
                isOwnProfile ? (
                  <span className="profile-card__bio-placeholder">+ Add a short bio</span>
                ) : (
                  <span className="profile-card__bio-placeholder">No bio yet</span>
                )
              )}
            </p>
          )}

          <div className="profile-card__stats">
            <div className="profile-card__stat">
              <span className="profile-card__stat-value">{stats.posts}</span>
              <span className="profile-card__stat-label">Posts</span>
            </div>
            <div className="profile-card__stat">
              <span className="profile-card__stat-value">{stats.likes}</span>
              <span className="profile-card__stat-label">Likes received</span>
            </div>
            <div className="profile-card__stat">
              <span className="profile-card__stat-value">{stats.comments}</span>
              <span className="profile-card__stat-label">Comments</span>
            </div>
          </div>

          {isOwnProfile && (
            <div className="profile-card__actions">
              <Link to="/create" className="btn btn--primary">
                + New post
              </Link>
              <button className="btn btn--outline" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2 className="profile-posts__title">
          {isOwnProfile ? "Your posts" : `${profile.username}'s posts`}
        </h2>

        {myPosts.length === 0 ? (
          <div className="empty">
            <div className="empty__mark">◌</div>
            <p className="empty__title">
              {isOwnProfile ? "You haven't posted yet" : "No posts yet"}
            </p>
            <p className="empty__subtitle">Shared moments will show up here.</p>
          </div>
        ) : (
          <div className="profile-grid">
            {myPosts.map((post) => (
              <Link to={`/post/${post._id}`} key={post._id} className="profile-grid__item">
                <img src={post.imageUrl} alt={post.caption} className="profile-grid__image" />
                <div className="profile-grid__overlay">
                  <span>♥ {post.likes}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
