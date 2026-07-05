import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore session from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem("nook_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser({ _id: parsed._id, username: parsed.username });
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("nook_auth");
      }
    }
    setReady(true);
  }, []);

  const login = (authData) => {
    localStorage.setItem("nook_auth", JSON.stringify(authData));
    setUser({ _id: authData._id, username: authData.username, bio: authData.bio });
    setToken(authData.token);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      const saved = JSON.parse(localStorage.getItem("nook_auth") || "{}");
      localStorage.setItem("nook_auth", JSON.stringify({ ...saved, ...patch }));
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem("nook_auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
