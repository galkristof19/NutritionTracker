import express from "express";
import {
	createRecipe,
	getRecipeById,
	getUserRecipes,
	getAllPublicRecipes,
	searchRecipes,
	updateRecipe,
	deleteRecipe,
} from "../controllers/recipeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/public", getAllPublicRecipes);
router.get("/search", searchRecipes);

// Protected routes - User specific (must come before /:id)
router.post("/", authenticate, createRecipe);
router.get("/user/my-recipes", authenticate, getUserRecipes);

// Public routes - Get single recipe by ID (must come after user routes)
router.get("/:id", getRecipeById);

// Protected routes - Update and delete
router.put("/:id", authenticate, updateRecipe);
router.delete("/:id", authenticate, deleteRecipe);

export default router;
