import admin from "firebase-admin";
import { catchAsync, ValidationError, AuthError } from "../middleware/errorMiddleware.js";
import * as userRepository from "../repositories/userRepository.js";

// Register a new user
export const register = catchAsync(async (req, res, next) => {
	const { email, password, name, gender, birthDate, height } = req.body;

	// Validate required fields
	if (!email || !password || !name) {
		throw new ValidationError("Email, password, and name are required");
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throw new ValidationError("Invalid email format");
	}

	// Validate password strength
	if (password.length < 6) {
		throw new ValidationError("Password must be at least 6 characters");
	}

	// Create user in Firebase first
	let firebaseUser;
	try {
		firebaseUser = await admin.auth().createUser({
			email,
			password,
		});
	} catch (error) {
		if (error.code === "auth/email-already-exists") {
			throw new ValidationError("User with this email already exists");
		}
		throw error;
	}

	// Create user in database
	try {
		const newUser = await userRepository.createUser({
			uid: firebaseUser.uid,
			email,
			name,
			gender: gender || null,
			birthDate: birthDate || null,
			height: height || null,
			role: "user",
		});

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			user: newUser,
		});
	} catch (dbError) {
		// If database fails, delete Firebase user to keep consistency
		try {
			await admin.auth().deleteUser(firebaseUser.uid);
		} catch (deleteError) {
			console.error("Error deleting Firebase user:", deleteError);
		}
		throw dbError;
	}
});

// Get current user profile
export const getCurrentUser = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	const user = await userRepository.getUserByUid(req.user.uid);

	res.status(200).json({
		success: true,
		user,
	});
});

// Update user profile
export const updateProfile = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	const { name, gender, birthDate, currentWeight, height, activityLevel, dailyCalorieGoal, dietPreferences } = req.body;

	const updatedUser = await userRepository.updateUser(req.user.uid, {
		name,
		gender,
		birthDate,
		currentWeight,
		height,
		activityLevel,
		dailyCalorieGoal,
		dietPreferences,
	});

	res.status(200).json({
		success: true,
		message: "Profile updated successfully",
		user: updatedUser,
	});
});

// Delete user account
export const deleteAccount = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	// Delete from database
	await userRepository.deleteUser(req.user.uid);

	// Delete from Firebase
	await admin.auth().deleteUser(req.user.uid);

	res.status(200).json({
		success: true,
		message: "Account deleted successfully",
	});
});
