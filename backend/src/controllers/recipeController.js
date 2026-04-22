import { catchAsync, ValidationError } from "../middleware/errorMiddleware.js";
import * as recipeRepository from "../repositories/recipeRepository.js";
import { recipeValidationRules } from "../models/Recipe.js";

/**
 * Create a new recipe
 */
export const createRecipe = catchAsync(async (req, res, next) => {
	const { name, description, servings, caloriesperserving, protein, carbs, fat } = req.body;

	// Validate required fields
	if (!recipeValidationRules.name(name)) {
		throw new ValidationError("Name is required and must be at least 2 characters");
	}

	if (!recipeValidationRules.servings(servings)) {
		throw new ValidationError("Servings must be a positive number");
	}

	// Validate optional fields
	if (description && !recipeValidationRules.description(description)) {
		throw new ValidationError("Description must be 5000 characters or less");
	}

	if (caloriesperserving && !recipeValidationRules.caloriesperserving(caloriesperserving)) {
		throw new ValidationError("Calories per serving must be a non-negative number");
	}

	if (protein && !recipeValidationRules.protein(protein)) {
		throw new ValidationError("Protein must be a non-negative number");
	}

	if (carbs && !recipeValidationRules.carbs(carbs)) {
		throw new ValidationError("Carbs must be a non-negative number");
	}

	if (fat && !recipeValidationRules.fat(fat)) {
		throw new ValidationError("Fat must be a non-negative number");
	}

	const userid = req.user ? req.user.uid : null;

	if (!userid) {
		throw new ValidationError("User must be authenticated to create recipes");
	}

	const recipe = await recipeRepository.createRecipe({
		userid,
		name,
		description: description || null,
		servings,
		caloriesperserving: caloriesperserving || null,
		protein: protein || null,
		carbs: carbs || null,
		fat: fat || null,
	});

	res.status(201).json({
		success: true,
		message: "Recipe created successfully",
		recipe: recipe.toJSON(),
	});
});

/**
 * Get recipe by ID
 */
export const getRecipeById = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const recipe = await recipeRepository.getRecipeById(id);

	res.status(200).json({
		success: true,
		recipe: recipe.toJSON(),
	});
});

/**
 * Get recipes by current user
 */
export const getUserRecipes = catchAsync(async (req, res, next) => {
	const { limit = 100, offset = 0 } = req.query;
	const userid = req.user ? req.user.uid : null;

	if (!userid) {
		throw new ValidationError("User must be authenticated");
	}

	const recipes = await recipeRepository.getRecipesByUser(userid, parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		count: recipes.length,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: recipes.map((recipe) => recipe.toJSON()),
	});
});

/**
 * Get all public recipes
 */
export const getAllPublicRecipes = catchAsync(async (req, res, next) => {
	const { limit = 100, offset = 0 } = req.query;

	const recipes = await recipeRepository.getAllPublicRecipes(parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		count: recipes.length,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: recipes.map((recipe) => recipe.toJSON()),
	});
});

/**
 * Search recipes
 */
export const searchRecipes = catchAsync(async (req, res, next) => {
	const { q, limit = 20, offset = 0 } = req.query;

	if (!q || !q.trim()) {
		throw new ValidationError("Search query is required");
	}

	if (q.trim().length < 2) {
		throw new ValidationError("Search query must be at least 2 characters");
	}

	const recipes = await recipeRepository.searchRecipes(q.trim(), parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		count: recipes.length,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: recipes.map((recipe) => recipe.toJSON()),
	});
});

/**
 * Update recipe
 */
export const updateRecipe = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const userid = req.user ? req.user.uid : null;

	if (!userid) {
		throw new ValidationError("User must be authenticated");
	}

	// Check ownership
	const recipe = await recipeRepository.getRecipeById(id);
	if (recipe.userId !== userid) {
		throw new ValidationError("You can only update your own recipes");
	}

	const updated = await recipeRepository.updateRecipe(id, req.body);

	res.status(200).json({
		success: true,
		message: "Recipe updated successfully",
		recipe: updated.toJSON(),
	});
});

/**
 * Delete recipe
 */
export const deleteRecipe = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const userid = req.user ? req.user.uid : null;

	if (!userid) {
		throw new ValidationError("User must be authenticated");
	}

	// Check ownership
	const recipe = await recipeRepository.getRecipeById(id);
	if (recipe.userId !== userid) {
		throw new ValidationError("You can only delete your own recipes");
	}

	await recipeRepository.deleteRecipe(id);

	res.status(200).json({
		success: true,
		message: "Recipe deleted successfully",
	});
});
