import { Router } from "express";
import * as profileController from "../controllers/profileController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * GET /api/profile
 * Get current user's profile
 * Requires authentication
 */
router.get("/", verifyFirebaseToken, profileController.getUserProfile);

/**
 * PUT /api/profile
 * Update current user's profile
 * Requires authentication
 */
router.put("/", verifyFirebaseToken, profileController.updateUserProfile);

/**
 * GET /api/profile/stats
 * Get current user's statistics (BMI, age, weight to goal, etc.)
 * Requires authentication
 */
router.get("/stats", verifyFirebaseToken, profileController.getUserStats);

export default router;
