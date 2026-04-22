import { query } from "../config/db.js";
import { NotFoundError, ConflictError } from "../middleware/errorMiddleware.js";
import { Food } from "../models/Food.js";

/**
 * Create a new food entry
 */
export const createFood = async (foodData) => {
	const { name, brand, caloriesper100g, protein, carbs, fat, barcode, createdby, ispublic = true } =
		foodData;

	try {
		const result = await query(
			`INSERT INTO food 
		(name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy, isPublic)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat`,
			[name, brand, caloriesper100g, protein, carbs, fat, barcode, createdby, ispublic]
		);

		return new Food(result.rows[0]);
	} catch (error) {
		if (error.code === "23505") {
			// Unique constraint violation on barcode
			throw new ConflictError("A food item with this barcode already exists");
		}
		throw error;
	}
};

/**
 * Get food by ID
 */
export const getFoodById = async (id) => {
	const result = await query(
		`SELECT id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat
		 FROM food WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		throw new NotFoundError("Food item not found");
	}

	return new Food(result.rows[0]);
};

/**
 * Get food by barcode
 */
export const getFoodByBarcode = async (barcode) => {
	const result = await query(
		`SELECT id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat
		 FROM food WHERE barcode = $1`,
		[barcode]
	);

	if (result.rows.length === 0) {
		return null; // Don't throw, allow checking if exists
	}

	return new Food(result.rows[0]);
};

/**
 * Search foods in database by name or brand
 */
export const searchFoods = async (searchTerm, limit = 20, offset = 0) => {
	const searchPattern = `%${searchTerm.toLowerCase()}%`;

	const result = await query(
		`SELECT 
			id,
			name,
			brand,
			caloriesPer100g,
			protein,
			carbs,
			fat,
			barcode,
			createdBy as createdby,
			isPublic as ispublic,
			createdAt as createdat,
			updatedAt as updatedat
		FROM food 
		WHERE (LOWER(name) LIKE $1 OR LOWER(brand) LIKE $1) 
		AND isPublic = true
		ORDER BY name ASC
		LIMIT $2 OFFSET $3`,
		[searchPattern, limit, offset]
	);

	return result.rows.map((row) => new Food(row));
};

/**
 * Get all public foods
 */
export const getAllPublicFoods = async (limit = 100, offset = 0) => {
	const result = await query(
		`SELECT id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat
		 FROM food 
		 WHERE isPublic = true
		 ORDER BY name ASC
		 LIMIT $1 OFFSET $2`,
		[limit, offset]
	);

	return result.rows.map((row) => new Food(row));
};

/**
 * Get foods created by a specific user
 */
export const getFoodsByUser = async (userId, limit = 100, offset = 0) => {
	const result = await query(
		`SELECT id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat
		 FROM food 
		 WHERE createdBy = $1
		 ORDER BY createdAt DESC
		 LIMIT $2 OFFSET $3`,
		[userId, limit, offset]
	);

	return result.rows.map((row) => new Food(row));
};

/**
 * Update food item
 */
export const updateFood = async (id, foodData) => {
	const { name, brand, caloriesper100g, protein, carbs, fat, ispublic } = foodData;

	// Build dynamic UPDATE query
	const updates = [];
	const values = [];
	let paramCount = 1;

	if (name !== undefined) {
		updates.push(`name = $${paramCount++}`);
		values.push(name);
	}
	if (brand !== undefined) {
		updates.push(`brand = $${paramCount++}`);
		values.push(brand);
	}
	if (caloriesper100g !== undefined) {
		updates.push(`caloriesPer100g = $${paramCount++}`);
		values.push(caloriesper100g);
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
	if (ispublic !== undefined) {
		updates.push(`isPublic = $${paramCount++}`);
		values.push(ispublic);
	}

	if (updates.length === 0) {
		throw new Error("No fields to update");
	}

	updates.push(`updatedAt = NOW()`);
	values.push(id);

	const updateQuery = `UPDATE food SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING id, name, brand, caloriesPer100g, protein, carbs, fat, barcode, createdBy as createdby, isPublic as ispublic, createdAt as createdat, updatedAt as updatedat`;

	const result = await query(updateQuery, values);

	if (result.rows.length === 0) {
		throw new NotFoundError("Food item not found");
	}

	return new Food(result.rows[0]);
};

/**
 * Delete food item
 */
export const deleteFood = async (id) => {
	const result = await query(`DELETE FROM food WHERE id = $1 RETURNING id`, [id]);

	if (result.rows.length === 0) {
		throw new NotFoundError("Food item not found");
	}

	return { success: true, id: result.rows[0].id };
};

/**
 * Get total count of foods
 */
export const getFoodCount = async (filters = {}) => {
	let whereClause = "1=1";
	const values = [];

	if (filters.createdBy) {
		whereClause += ` AND createdBy = $1`;
		values.push(filters.createdBy);
	}

	if (filters.isPublic !== undefined) {
		whereClause += ` AND isPublic = $${values.length + 1}`;
		values.push(filters.isPublic);
	}

	const result = await query(
		`SELECT COUNT(*) as count FROM food WHERE ${whereClause}`,
		values
	);

	return parseInt(result.rows[0].count, 10);
};
