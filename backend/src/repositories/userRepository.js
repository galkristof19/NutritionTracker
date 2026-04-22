import { query } from "../config/db.js";
import { NotFoundError, ConflictError } from "../middleware/errorMiddleware.js";

// Create a new user
export const createUser = async (userData) => {
	const {
		uid,
		email,
		name,
		birthDate = null,
		gender = null,
		currentWeight = null,
		height = null,
		activityLevel = 1.5,
		dailyCalorieGoal = null,
		weightGoal = null,
		role = "user",
	} = userData;

	try {
		const result = await query(
			`INSERT INTO users 
			(uid, email, name, birthDate, gender, currentWeight, height, activityLevel, dailyCalorieGoal, weightGoal, role)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			RETURNING uid, email, name, birthDate, gender, currentWeight, height, role, createdAt, updatedAt`,
			[
				uid,
				email,
				name,
				birthDate,
				gender,
				currentWeight,
				height,
				activityLevel,
				dailyCalorieGoal,
				weightGoal,
				role,
			]
		);

		return result.rows[0];
	} catch (error) {
		if (error.code === "23505") {
			// Unique constraint violation
			throw new ConflictError("User with this email already exists");
		}
		throw error;
	}
};

// Get user by UID
export const getUserByUid = async (uid) => {
	const result = await query(
		"SELECT uid, email, name, birthDate, gender, currentWeight, height, activityLevel, dailyCalorieGoal, weightGoal, role, createdAt, updatedAt FROM users WHERE uid = $1",
		[uid]
	);

	if (result.rows.length === 0) {
		throw new NotFoundError(`User with UID ${uid} not found`);
	}

	return result.rows[0];
};

// Get user by email
export const getUserByEmail = async (email) => {
	const result = await query(
		"SELECT uid, email, name, birthDate, gender, currentWeight, height, activityLevel, dailyCalorieGoal, weightGoal, role, createdAt, updatedAt FROM users WHERE email = $1",
		[email]
	);

	if (result.rows.length === 0) {
		return null;
	}

	return result.rows[0];
};

// Update user
export const updateUser = async (uid, userData) => {
	const {
		name = null,
		birthDate = null,
		gender = null,
		currentWeight = null,
		height = null,
		activityLevel = null,
		dailyCalorieGoal = null,
		weightGoal = null,
	} = userData;

	const updates = [];
	const values = [uid];
	let paramIndex = 2;

	if (name !== null) {
		updates.push(`name = $${paramIndex}`);
		values.push(name);
		paramIndex++;
	}
	if (birthDate !== null) {
		updates.push(`birthDate = $${paramIndex}`);
		values.push(birthDate);
		paramIndex++;
	}
	if (gender !== null) {
		updates.push(`gender = $${paramIndex}`);
		values.push(gender);
		paramIndex++;
	}
	if (currentWeight !== null) {
		updates.push(`currentWeight = $${paramIndex}`);
		values.push(currentWeight);
		paramIndex++;
	}
	if (height !== null) {
		updates.push(`height = $${paramIndex}`);
		values.push(height);
		paramIndex++;
	}
	if (activityLevel !== null) {
		updates.push(`activityLevel = $${paramIndex}`);
		values.push(activityLevel);
		paramIndex++;
	}
	if (dailyCalorieGoal !== null) {
		updates.push(`dailyCalorieGoal = $${paramIndex}`);
		values.push(dailyCalorieGoal);
		paramIndex++;
	}
	if (weightGoal !== null) {
		updates.push(`weightGoal = $${paramIndex}`);
		values.push(weightGoal);
		paramIndex++;
	}

	if (updates.length === 0) {
		throw new Error("No fields to update");
	}

	const result = await query(
		`UPDATE users SET ${updates.join(", ")} WHERE uid = $1 RETURNING uid, email, name, birthDate, gender, currentWeight, height, activityLevel, dailyCalorieGoal, weightGoal, role, updatedAt`,
		values
	);

	if (result.rows.length === 0) {
		throw new NotFoundError(`User ${uid} not found`);
	}

	return result.rows[0];
};

// Delete user
export const deleteUser = async (uid) => {
	const result = await query("DELETE FROM users WHERE uid = $1 RETURNING uid", [
		uid,
	]);

	if (result.rows.length === 0) {
		throw new NotFoundError(`User ${uid} not found`);
	}

	return result.rows[0];
};

// Get all users (for admin)
export const getAllUsers = async (limit = 50, offset = 0) => {
	const result = await query(
		"SELECT uid, email, name, role, createdAt FROM users ORDER BY createdAt DESC LIMIT $1 OFFSET $2",
		[limit, offset]
	);

	const countResult = await query("SELECT COUNT(*) FROM users");

	return {
		users: result.rows,
		total: parseInt(countResult.rows[0].count),
		limit,
		offset,
	};
};

// Update user role
export const updateUserRole = async (uid, role) => {
	const result = await query(
		"UPDATE users SET role = $1 WHERE uid = $2 RETURNING uid, email, role",
		[role, uid]
	);

	if (result.rows.length === 0) {
		throw new NotFoundError(`User ${uid} not found`);
	}

	return result.rows[0];
};

// Check if user exists
export const userExists = async (uid) => {
	const result = await query(
		"SELECT uid FROM users WHERE uid = $1",
		[uid]
	);

	return result.rows.length > 0;
};
