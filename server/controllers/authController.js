import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const user = await User.create({ username: username.trim(), password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET /api/auth/me — return the currently logged-in user (from token)
export const getMe = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    bio: req.user.bio,
    createdAt: req.user.createdAt,
  });
};

// GET /api/auth/users/:id — public profile info for any user (no auth needed)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile", error: error.message });
  }
};

// PUT /api/auth/me — update bio
export const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    req.user.bio = bio?.trim().slice(0, 160) || "";
    await req.user.save();
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      bio: req.user.bio,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile", error: error.message });
  }
};
