import admin from "firebase-admin";
import { query } from "../config/db.js";
import {
	catchAsync,
	AppError,
	ValidationError,
	NotFoundError,
} from "../middleware/errorMiddleware.js";

// Set admin role for a user
export const setAdminRole = catchAsync(async (req, res, next) => {
	const { uid } = req.params;

	if (!uid) {
		throw new ValidationError("User UID is required");
	}

	// Verify user exists in Firebase
	let userRecord;
	try {
		userRecord = await admin.auth().getUser(uid);
	} catch (error) {
		throw new NotFoundError(`User with UID ${uid} not found in Firebase`);
	}

	// Set custom claims in Firebase
	await admin.auth().setCustomUserClaims(uid, { role: "admin" });

	// Update or create user in database
	const result = await query(
		"INSERT INTO users (uid, email, role) VALUES ($1, $2, $3) ON CONFLICT (uid) DO UPDATE SET role = $3 RETURNING uid, email, role",
		[uid, userRecord.email, "admin"]
	);

	res.status(200).json({
		success: true,
		message: `Admin role assigned to user ${uid}`,
		user: result.rows[0],
	});
});

// Remove admin role from a user
export const removeAdminRole = catchAsync(async (req, res, next) => {
	const { uid } = req.params;

	if (!uid) {
		throw new ValidationError("User UID is required");
	}

	// Verify user exists in Firebase
	try {
		await admin.auth().getUser(uid);
	} catch (error) {
		throw new NotFoundError(`User with UID ${uid} not found in Firebase`);
	}

	// Remove custom claims from Firebase
	await admin.auth().setCustomUserClaims(uid, { role: "user" });

	// Update user role in database
	const result = await query(
		"UPDATE users SET role = $1 WHERE uid = $2 RETURNING uid, email, role",
		["user", uid]
	);

	if (result.rowCount === 0) {
		throw new NotFoundError(`User ${uid} not found in database`);
	}

	res.status(200).json({
		success: true,
		message: `Admin role removed from user ${uid}`,
		user: result.rows[0],
	});
});

// Get all admin users
export const getAllAdmins = catchAsync(async (req, res, next) => {
	const result = await query(
		"SELECT uid, email, name, role, createdAt FROM users WHERE role = $1 ORDER BY createdAt DESC",
		["admin"]
	);

	res.status(200).json({
		success: true,
		count: result.rows.length,
		admins: result.rows,
	});
});

// Get user role
export const getUserRole = catchAsync(async (req, res, next) => {
	const { uid } = req.params;

	if (!uid) {
		throw new ValidationError("User UID is required");
	}

	const result = await query(
		"SELECT uid, email, name, role FROM users WHERE uid = $1",
		[uid]
	);

	if (result.rows.length === 0) {
		throw new NotFoundError(`User ${uid} not found`);
	}

	res.status(200).json({
		success: true,
		user: result.rows[0],
	});
});

// Batch set admin role for multiple users
export const batchSetAdminRole = catchAsync(async (req, res, next) => {
	const { uids } = req.body;

	if (!Array.isArray(uids) || uids.length === 0) {
		throw new ValidationError("Array of UIDs is required");
	}

	const results = [];
	const errors = [];

	for (const uid of uids) {
		try {
			const userRecord = await admin.auth().getUser(uid);
			await admin.auth().setCustomUserClaims(uid, { role: "admin" });

			await query(
				"INSERT INTO users (uid, email, role) VALUES ($1, $2, $3) ON CONFLICT (uid) DO UPDATE SET role = $3",
				[uid, userRecord.email, "admin"]
			);

			results.push({ uid, success: true, message: "Admin role set" });
		} catch (error) {
			errors.push({ uid, success: false, error: error.message });
		}
	}

	res.status(200).json({
		success: errors.length === 0,
		results,
		errors: errors.length > 0 ? errors : undefined,
	});
});
