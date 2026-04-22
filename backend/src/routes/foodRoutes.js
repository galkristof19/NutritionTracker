import express from "express";
import {
	searchExternalFoods,
	saveFood,
	getFoodById,
	searchLocalFoods,
	getAllPublicFoods,
	getUserFoods,
	updateFood,
	deleteFood,
} from "../controllers/foodController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - External API search
router.get("/search", searchExternalFoods);

// Public routes - Local database search
router.get("/search-local", searchLocalFoods);
router.get("/public", getAllPublicFoods);

// Protected routes - User specific (must come before /:id)
router.post("/", authenticate, saveFood);
router.get("/user/my-foods", authenticate, getUserFoods);

// Public routes - Get single food by ID (must come after user routes)
router.get("/:id", getFoodById);

// Protected routes - Update and delete
router.put("/:id", authenticate, updateFood);
router.delete("/:id", authenticate, deleteFood);

export default router;
