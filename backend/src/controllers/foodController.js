import { catchAsync, ValidationError } from "../middleware/errorMiddleware.js";
import * as foodRepository from "../repositories/foodRepository.js";
import { foodValidationRules } from "../models/Food.js";

/**
 * Helper: Get detailed nutrition info from USDA API
 */
const getUSDAFoodDetails = async (fdcId, apiKey) => {
	try {
		const detailUrl = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`;
		const response = await fetch(detailUrl);
		
		if (!response.ok) {
			console.log(`[USDA] Details failed for ${fdcId}: ${response.status}`);
			return null;
		}
		
		const food = await response.json();
		const nutrients = food.foodNutrients || [];
		
		let calories = 0;
		let protein = 0;
		let carbs = 0;
		let fat = 0;
		
		// Extract nutrients by nutrient number (standardized in USDA)
		// 1008 = Energy (kcal)
		// 1003 = Protein
		// 1005 = Carbohydrate
		// 1004 = Fat
		nutrients.forEach((nutrient) => {
			const nutrientId = nutrient.nutrient?.id;
			const amount = nutrient.amount || 0;
			
			if (nutrientId === 1008) calories = Math.round(amount);
			if (nutrientId === 1003) protein = Math.round(amount * 100) / 100;
			if (nutrientId === 1005) carbs = Math.round(amount * 100) / 100;
			if (nutrientId === 1004) fat = Math.round(amount * 100) / 100;
		});
		
		console.log(`[USDA Details] ${food.description}: ${calories}cal, ${protein}p, ${carbs}c, ${fat}f`);
		
		return {
			description: food.description,
			calories,
			protein,
			carbs,
			fat
		};
	} catch (error) {
		console.error(`[USDA Details] Error for ${fdcId}:`, error.message);
		return null;
	}
};

/**
 * Search for foods using USDA FoodData Central API with database caching
 */
export const searchExternalFoods = catchAsync(async (req, res, next) => {
	const { q, page = 1 } = req.query;

	if (!q || !q.trim()) {
		throw new ValidationError("Search query is required");
	}

	if (q.trim().length < 2) {
		throw new ValidationError("Search query must be at least 2 characters");
	}

	const apiKey = process.env.USDA_API_KEY || "DEMO_KEY";
	
	try {
		const searchTerm = q.trim();
		const pageNum = parseInt(page);
		const pageSize = 20;

		// Step 1: Search local database first (cache)
		console.log(`[FOOD SEARCH] Searching local database for: "${searchTerm}"`);
		const localResults = await foodRepository.searchFoods(searchTerm, pageSize, (pageNum - 1) * pageSize);
		const localBarcodes = new Set(localResults.map((food) => food.barcode));

		console.log(`[FOOD SEARCH] Found ${localResults.length} items in local cache`);

		// Step 2: Query USDA API
		const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchTerm)}&pageSize=${pageSize}&pageNumber=${pageNum}&api_key=${apiKey}`;

		console.log(`[FOOD SEARCH] Query URL: ${searchUrl}`);
		console.log(`[FOOD SEARCH] API Key: ${apiKey.substring(0, 5)}...`);

		const response = await fetch(searchUrl);
		
		console.log(`[FOOD SEARCH] USDA API returned status ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[FOOD SEARCH] Error response: ${errorText.substring(0, 200)}`);
			throw new Error(`USDA API returned status ${response.status}`);
		}

		const data = await response.json();
		const foods = data.foods || [];

		console.log(`[FOOD SEARCH] Found ${foods.length} items from USDA API`);

		// Step 3: Extract nutrition data (no auto-save to DB)
		const apiProducts = [];
		
		for (const food of foods) {
			const barcode = `usda-${food.fdcId}`;

			// Get detailed nutrition info
			const details = await getUSDAFoodDetails(food.fdcId, apiKey);
			
			const productData = {
				id: food.fdcId,
				name: food.description || "Unknown",
				brand: food.brandOwner || "USDA",
				calories: details?.calories || 0,
				protein: details?.protein || 0,
				carbs: details?.carbs || 0,
				fat: details?.fat || 0,
				quantity: "100g",
				barcode: barcode,
			};

			apiProducts.push(productData);
		}

		// Step 5: Combine local + API results
		const localConverted = localResults.map((f) => ({
			id: f.id,
			name: f.name,
			brand: f.brand,
			calories: f.caloriesPer100g,
			protein: f.protein,
			carbs: f.carbs,
			fat: f.fat,
			quantity: "100g",
			barcode: f.barcode,
		}));

		const allResults = [...localConverted, ...apiProducts];
		
		// Remove duplicates
		const uniqueResults = Array.from(
			new Map(allResults.map((item) => [item.barcode, item])).values()
		);

		console.log(`[FOOD SEARCH] Returning ${uniqueResults.length} total (${localResults.length} cached + ${apiProducts.length} new)`);

		res.status(200).json({
			success: true,
			count: uniqueResults.length,
			page: pageNum,
			cached: localResults.length,
			new: apiProducts.length,
			results: uniqueResults,
		});
	} catch (error) {
		console.error(`[FOOD SEARCH ERROR] ${error.message}`);
		throw error;
	}
});

/**
 * Save a food item to database
 */
export const saveFood = catchAsync(async (req, res, next) => {
	const { name, brand, caloriesper100g, protein, carbs, fat, barcode, ispublic = true } = req.body;

	// Validate required fields
	if (!foodValidationRules.name(name)) {
		throw new ValidationError("Name is required and must be at least 2 characters");
	}

	if (!foodValidationRules.caloriesPer100g(caloriesper100g)) {
		throw new ValidationError("Valid calories per 100g is required");
	}

	// Validate optional fields
	if (brand && !foodValidationRules.brand(brand)) {
		throw new ValidationError("Brand must be 255 characters or less");
	}

	if (protein && !foodValidationRules.protein(protein)) {
		throw new ValidationError("Protein value is invalid");
	}

	if (carbs && !foodValidationRules.carbs(carbs)) {
		throw new ValidationError("Carbs value is invalid");
	}

	if (fat && !foodValidationRules.fat(fat)) {
		throw new ValidationError("Fat value is invalid");
	}

	if (barcode && !foodValidationRules.barcode(barcode)) {
		throw new ValidationError("Barcode must be between 8 and 50 characters");
	}

	// Check if barcode already exists
	if (barcode) {
		const existingFood = await foodRepository.getFoodByBarcode(barcode);
		if (existingFood) {
			throw new ValidationError(`Food with barcode ${barcode} already exists`);
		}
	}

	const createdby = req.user ? req.user.uid : null;

	const food = await foodRepository.createFood({
		name,
		brand: brand || null,
		caloriesper100g,
		protein: protein || null,
		carbs: carbs || null,
		fat: fat || null,
		barcode: barcode || null,
		createdby,
		ispublic,
	});

	res.status(201).json({
		success: true,
		message: "Food item saved successfully",
		food: food.toJSON(),
	});
});

/**
 * Get food by ID
 */
export const getFoodById = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const food = await foodRepository.getFoodById(id);

	res.status(200).json({
		success: true,
		food: food.toJSON(),
	});
});

/**
 * Search foods in database
 */
export const searchLocalFoods = catchAsync(async (req, res, next) => {
	const { q, limit = 20, offset = 0 } = req.query;

	if (!q || !q.trim()) {
		throw new ValidationError("Search query is required");
	}

	if (q.trim().length < 2) {
		throw new ValidationError("Search query must be at least 2 characters");
	}

	const foods = await foodRepository.searchFoods(q.trim(), parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		count: foods.length,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: foods.map((food) => food.toJSON()),
	});
});

/**
 * Get all public foods with pagination
 */
export const getAllPublicFoods = catchAsync(async (req, res, next) => {
	const { limit = 100, offset = 0 } = req.query;

	const foods = await foodRepository.getAllPublicFoods(parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: foods.map((food) => food.toJSON()),
	});
});

/**
 * Get foods created by current user
 */
export const getUserFoods = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new ValidationError("User not authenticated");
	}

	const { limit = 100, offset = 0 } = req.query;

	const foods = await foodRepository.getFoodsByUser(req.user.uid, parseInt(limit), parseInt(offset));

	res.status(200).json({
		success: true,
		limit: parseInt(limit),
		offset: parseInt(offset),
		results: foods.map((food) => food.toJSON()),
	});
});

/**
 * Update a food item
 */
export const updateFood = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new ValidationError("User not authenticated");
	}

	const { id } = req.params;
	const { name, brand, caloriesper100g, protein, carbs, fat, ispublic } = req.body;

	// Get the food to check ownership
	const food = await foodRepository.getFoodById(id);

	if (food.createdBy && food.createdBy !== req.user.uid) {
		throw new ValidationError("You can only update foods you created");
	}

	const updatedFood = await foodRepository.updateFood(id, {
		name,
		brand,
		caloriesper100g,
		protein,
		carbs,
		fat,
		ispublic,
	});

	res.status(200).json({
		success: true,
		message: "Food item updated successfully",
		food: updatedFood.toJSON(),
	});
});

/**
 * Delete a food item
 */
export const deleteFood = catchAsync(async (req, res, next) => {
	if (!req.user) {
		throw new ValidationError("User not authenticated");
	}

	const { id } = req.params;

	// Get the food to check ownership
	const food = await foodRepository.getFoodById(id);

	if (food.createdBy && food.createdBy !== req.user.uid) {
		throw new ValidationError("You can only delete foods you created");
	}

	await foodRepository.deleteFood(id);

	res.status(200).json({
		success: true,
		message: "Food item deleted successfully",
	});
});
