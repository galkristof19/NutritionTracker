import { query } from "../config/db.js";
import { NotFoundError, ConflictError } from "../middleware/errorMiddleware.js";
import { Recipe } from "../models/Recipe.js";

/**
 * Create a new recipe
 */
export const createRecipe = async (recipeData) => {
	const { userid, name, description, servings, caloriesperserving, protein, carbs, fat } = recipeData;

	try {
		const result = await query(
			`INSERT INTO recipes 
			(userId, name, description, servings, caloriesPerServing, protein, carbs, fat)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat`,
			[userid, name, description, servings, caloriesperserving || null, protein || null, carbs || null, fat || null]
		);

		return new Recipe(result.rows[0]);
	} catch (error) {
		throw error;
	}
};

/**
 * Get recipe by ID
 */
export const getRecipeById = async (id) => {
	const result = await query(
		`SELECT id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat
		 FROM recipes WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		throw new NotFoundError("Recipe not found");
	}

	return new Recipe(result.rows[0]);
};

/**
 * Get recipes by user ID
 */
export const getRecipesByUser = async (userId, limit = 100, offset = 0) => {
	const result = await query(
		`SELECT id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat
		 FROM recipes
		 WHERE userId = $1
		 ORDER BY createdAt DESC
		 LIMIT $2 OFFSET $3`,
		[userId, limit, offset]
	);

	return result.rows.map((row) => new Recipe(row));
};

/**
 * Get all public recipes (all recipes are accessible)
 */
export const getAllPublicRecipes = async (limit = 100, offset = 0) => {
	const result = await query(
		`SELECT id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat
		 FROM recipes
		 ORDER BY createdAt DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset]
	);

	return result.rows.map((row) => new Recipe(row));
};

/**
 * Search recipes by name
 */
export const searchRecipes = async (searchTerm, limit = 20, offset = 0) => {
	const result = await query(
		`SELECT id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat
		 FROM recipes
		 WHERE name ILIKE $1 OR description ILIKE $1
		 ORDER BY name ASC
		 LIMIT $2 OFFSET $3`,
		[`%${searchTerm}%`, limit, offset]
	);

	return result.rows.map((row) => new Recipe(row));
};

/**
 * Update recipe
 */
export const updateRecipe = async (id, recipeData) => {
	const { name, description, servings, caloriesperserving, protein, carbs, fat } = recipeData;

	// Build dynamic UPDATE query
	const updates = [];
	const values = [];
	let paramCount = 1;

	if (name !== undefined) {
		updates.push(`name = $${paramCount++}`);
		values.push(name);
	}
	if (description !== undefined) {
		updates.push(`description = $${paramCount++}`);
		values.push(description);
	}
	if (servings !== undefined) {
		updates.push(`servings = $${paramCount++}`);
		values.push(servings);
	}
	if (caloriesperserving !== undefined) {
		updates.push(`caloriesPerServing = $${paramCount++}`);
		values.push(caloriesperserving);
	}
	if (protein !== undefined) {
		updates.push(`protein = $${paramCount++}`);
		values.push(protein);
	}
	if (carbs !== undefined) {
		updates.push(`carbs = $${paramCount++}`);
		values.push(carbs);
	}
	if (fat !== undefined) {
		updates.push(`fat = $${paramCount++}`);
		values.push(fat);
	}

	if (updates.length === 0) {
		throw new Error("No fields to update");
	}

	updates.push(`updatedAt = NOW()`);
	values.push(id);

	const result = await query(
		`UPDATE recipes SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING id, userId as userid, name, description, servings, caloriesPerServing as caloriesperserving, protein, carbs, fat, createdAt as createdat, updatedAt as updatedat`,
		values
	);

	if (result.rows.length === 0) {
		throw new NotFoundError("Recipe not found");
	}

	return new Recipe(result.rows[0]);
};

/**
 * Delete recipe
 */
export const deleteRecipe = async (id) => {
	const result = await query(`DELETE FROM recipes WHERE id = $1 RETURNING id`, [id]);

	if (result.rows.length === 0) {
		throw new NotFoundError("Recipe not found");
	}

	return result.rows[0];
};
