import express from "express";
import { signup, login, getMe, updateProfile, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.get("/users/:id", getUserProfile);

export default router;
