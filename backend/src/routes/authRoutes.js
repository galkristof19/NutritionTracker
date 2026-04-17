import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import {
	register,
	getCurrentUser,
	updateProfile,
	deleteAccount,
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);

// Protected routes (require authentication)
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.put("/profile", verifyFirebaseToken, updateProfile);
router.delete("/account", verifyFirebaseToken, deleteAccount);

export default router;
