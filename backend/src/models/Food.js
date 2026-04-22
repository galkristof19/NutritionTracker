/**
 * Food Model
 * Represents the structure of a food item in the application
 */

export class Food {
  constructor({
    id,
    name,
    brand,
    caloriesper100g,
    protein,
    carbs,
    fat,
    barcode,
    createdby,
    ispublic = true,
    createdat,
    updatedat,
  }) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.caloriesper100g = caloriesper100g;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.barcode = barcode;
    this.createdBy = createdby;
    this.isPublic = ispublic;
    this.createdAt = createdat;
    this.updatedAt = updatedat;
  }

  /**
   * Convert food to JSON object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      caloriesper100g: this.caloriesper100g,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      barcode: this.barcode,
      createdBy: this.createdBy,
      isPublic: this.isPublic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Calculate macros for a specific quantity
   * @param {number} grams - Quantity in grams
   * @returns {object} Calculated macros
   */
  calculateMacros(grams) {
    const multiplier = grams / 100;
    return {
      calories: (this.caloriesper100g * multiplier).toFixed(2),
      protein: (this.protein * multiplier).toFixed(2),
      carbs: (this.carbs * multiplier).toFixed(2),
      fat: (this.fat * multiplier).toFixed(2),
    };
  }

  /**
   * Check if all macro values are available
   */
  hasCompleteMacros() {
    return !!(
      this.caloriesper100g &&
      this.protein !== null &&
      this.carbs !== null &&
      this.fat !== null
    );
  }

  /**
   * Get macros in percentages of total calories
   */
  getMacroPercentages() {
    if (!this.hasCompleteMacros()) return null;

    const proteinCals = this.protein * 4; // 1g protein = 4 calories
    const carbsCals = this.carbs * 4; // 1g carbs = 4 calories
    const fatCals = this.fat * 9; // 1g fat = 9 calories
    const totalCals = proteinCals + carbsCals + fatCals;

    return {
      proteinPercent: ((proteinCals / totalCals) * 100).toFixed(1),
      carbsPercent: ((carbsCals / totalCals) * 100).toFixed(1),
      fatPercent: ((fatCals / totalCals) * 100).toFixed(1),
    };
  }
}

/**
 * Food Validation Schema
 * Used to validate food input
 */
export const foodValidationRules = {
  name: (value) => {
    if (!value) return false; // Required
    return typeof value === 'string' && value.trim().length >= 2 && value.length <= 255;
  },

  brand: (value) => {
    if (!value) return true; // Optional
    return typeof value === 'string' && value.length <= 255;
  },

  caloriesPer100g: (value) => {
    if (!value && value !== 0) return false; // Required
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 9999.99;
  },

  protein: (value) => {
    if (!value && value !== 0) return true; // Optional
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 999.99;
  },

  carbs: (value) => {
    if (!value && value !== 0) return true; // Optional
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 999.99;
  },

  fat: (value) => {
    if (!value && value !== 0) return true; // Optional
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 999.99;
  },

  barcode: (value) => {
    if (!value) return true; // Optional
    return typeof value === 'string' && value.length >= 8 && value.length <= 50;
  },

  isPublic: (value) => {
    if (value === undefined || value === null) return true; // Optional, defaults to true
    return typeof value === 'boolean';
  },
};

/**
 * Calculate total macros for multiple foods
 * @param {Array} foods - Array of {food, quantity} objects
 * @returns {object} Total macros
 */
export const calculateTotalMacros = (foodEntries) => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  foodEntries.forEach(({ food, quantity }) => {
    if (food instanceof Food && quantity > 0) {
      const macros = food.calculateMacros(quantity);
      totals.calories += parseFloat(macros.calories);
      totals.protein += parseFloat(macros.protein);
      totals.carbs += parseFloat(macros.carbs);
      totals.fat += parseFloat(macros.fat);
    }
  });

  return {
    calories: totals.calories.toFixed(2),
    protein: totals.protein.toFixed(2),
    carbs: totals.carbs.toFixed(2),
    fat: totals.fat.toFixed(2),
  };
};
