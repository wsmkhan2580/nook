import express from "express";
import {
  getPosts,
  getMyPosts,
  getPostsByUser,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} from "../controllers/postController.js";
import upload from "../middleware/upload.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// NOTE: specific /user/... routes must come before /:id, otherwise Express
// treats "user" as an :id value
router.get("/user/mine", protect, getMyPosts);
router.get("/user/:userId", getPostsByUser);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", optionalAuth, upload.single("image"), createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.patch("/:id/like", likePost);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
