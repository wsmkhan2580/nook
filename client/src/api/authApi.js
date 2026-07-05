const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const signup = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not load profile");
  return data;
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${API_URL}/auth/users/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not load profile");
  return data;
};

export const updateProfile = async (bio, token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bio }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not update profile");
  return data;
};
