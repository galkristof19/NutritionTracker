import { catchAsync, ValidationError, AuthError } from "../middleware/errorMiddleware.js";
import * as userRepository from "../repositories/userRepository.js";

/**
 * Get user profile
 * Fetches the current authenticated user's profile data
 */
export const getUserProfile = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	const user = await userRepository.getUserByUid(req.user.uid);

	if (!user) {
		throw new AuthError("User profile not found");
	}

	// Ensure all fields are returned with correct types
	const profileData = {
		uid: user.uid,
		email: user.email,
		name: user.name || null,
		gender: user.gender || null,
		birthDate: user.birthDate || null,
		currentWeight: user.currentWeight ? parseFloat(user.currentWeight) : null,
		height: user.height ? parseFloat(user.height) : null,
		activityLevel: user.activityLevel ? parseFloat(user.activityLevel) : 1.5,
		dailyCalorieGoal: user.dailyCalorieGoal ? parseFloat(user.dailyCalorieGoal) : null,
		weightGoal: user.weightGoal ? parseFloat(user.weightGoal) : null,
		role: user.role || "user",
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};

	res.status(200).json({
		success: true,
		user: profileData,
	});
});

/**
 * Update user profile
 * Updates the current authenticated user's profile data
 */
export const updateUserProfile = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	const {
		name,
		gender,
		birthDate,
		currentWeight,
		height,
		activityLevel,
		dailyCalorieGoal,
		weightGoal,
	} = req.body;

	// Validate optional fields if provided
	if (name !== undefined && name !== null && typeof name !== "string") {
		throw new ValidationError("Name must be a string");
	}

	if (
		currentWeight !== undefined &&
		currentWeight !== null &&
		isNaN(parseFloat(currentWeight))
	) {
		throw new ValidationError("Current weight must be a number");
	}

	if (height !== undefined && height !== null && isNaN(parseFloat(height))) {
		throw new ValidationError("Height must be a number");
	}

	if (
		activityLevel !== undefined &&
		activityLevel !== null &&
		isNaN(parseFloat(activityLevel))
	) {
		throw new ValidationError("Activity level must be a number");
	}

	if (
		dailyCalorieGoal !== undefined &&
		dailyCalorieGoal !== null &&
		isNaN(parseFloat(dailyCalorieGoal))
	) {
		throw new ValidationError("Daily calorie goal must be a number");
	}

	if (
		weightGoal !== undefined &&
		weightGoal !== null &&
		isNaN(parseFloat(weightGoal))
	) {
		throw new ValidationError("Weight goal must be a number");
	}

	// Prepare update data - only include provided fields
	const updateData = {};
	if (name !== undefined) updateData.name = name;
	if (gender !== undefined) updateData.gender = gender;
	if (birthDate !== undefined) updateData.birthDate = birthDate;
	if (currentWeight !== undefined)
		updateData.currentWeight = currentWeight ? parseFloat(currentWeight) : null;
	if (height !== undefined) updateData.height = height ? parseFloat(height) : null;
	if (activityLevel !== undefined)
		updateData.activityLevel = activityLevel ? parseFloat(activityLevel) : 1.5;
	if (dailyCalorieGoal !== undefined)
		updateData.dailyCalorieGoal = dailyCalorieGoal
			? parseFloat(dailyCalorieGoal)
			: null;
	if (weightGoal !== undefined)
		updateData.weightGoal = weightGoal ? parseFloat(weightGoal) : null;

	const updatedUser = await userRepository.updateUser(
		req.user.uid,
		updateData
	);

	// Ensure all fields are returned with correct types
	const profileData = {
		uid: updatedUser.uid,
		email: updatedUser.email,
		name: updatedUser.name || null,
		gender: updatedUser.gender || null,
		birthDate: updatedUser.birthDate || null,
		currentWeight: updatedUser.currentWeight
			? parseFloat(updatedUser.currentWeight)
			: null,
		height: updatedUser.height ? parseFloat(updatedUser.height) : null,
		activityLevel: updatedUser.activityLevel
			? parseFloat(updatedUser.activityLevel)
			: 1.5,
		dailyCalorieGoal: updatedUser.dailyCalorieGoal
			? parseFloat(updatedUser.dailyCalorieGoal)
			: null,
		weightGoal: updatedUser.weightGoal
			? parseFloat(updatedUser.weightGoal)
			: null,
		role: updatedUser.role || "user",
		createdAt: updatedUser.createdAt,
		updatedAt: updatedUser.updatedAt,
	};

	res.status(200).json({
		success: true,
		message: "Profile updated successfully",
		user: profileData,
	});
});

/**
 * Get user statistics
 * Returns user health/nutrition related statistics
 */
export const getUserStats = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new AuthError("User not authenticated");
	}

	const user = await userRepository.getUserByUid(req.user.uid);

	if (!user) {
		throw new AuthError("User profile not found");
	}

	// Calculate BMI if weight and height are available
	let bmi = null;
	if (user.currentWeight && user.height) {
		const heightInMeters = user.height / 100;
		bmi = parseFloat((user.currentWeight / (heightInMeters * heightInMeters)).toFixed(2));
	}

	// Calculate age if birthDate is available
	let age = null;
	if (user.birthDate) {
		const today = new Date();
		const birthDate = new Date(user.birthDate);
		let calculatedAge = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			calculatedAge--;
		}
		age = calculatedAge;
	}

	// Calculate weight remaining to goal
	let weightToGoal = null;
	if (user.currentWeight && user.weightGoal) {
		weightToGoal = parseFloat(
			(user.weightGoal - user.currentWeight).toFixed(2)
		);
	}

	res.status(200).json({
		success: true,
		stats: {
			age,
			bmi,
			currentWeight: user.currentWeight ? parseFloat(user.currentWeight) : null,
			weightGoal: user.weightGoal ? parseFloat(user.weightGoal) : null,
			weightToGoal,
			height: user.height ? parseFloat(user.height) : null,
			activityLevel: user.activityLevel ? parseFloat(user.activityLevel) : 1.5,
			dailyCalorieGoal: user.dailyCalorieGoal
				? parseFloat(user.dailyCalorieGoal)
				: null,
		},
	});
});
