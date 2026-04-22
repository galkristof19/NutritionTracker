/**
 * Recipe Model
 * Represents the structure of a recipe in the application
 */

export class Recipe {
  constructor({
    id,
    userid,
    name,
    description,
    servings,
    caloriesperserving,
    protein,
    carbs,
    fat,
    createdat,
    updatedat,
  }) {
    this.id = id;
    this.userId = userid;
    this.name = name;
    this.description = description;
    this.servings = servings;
    this.caloriesPerServing = caloriesperserving;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.createdAt = createdat;
    this.updatedAt = updatedat;
  }

  /**
   * Convert recipe to JSON object
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      servings: this.servings,
      caloriesPerServing: this.caloriesPerServing,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

/**
 * Recipe validation rules
 */
export const recipeValidationRules = {
  name: (value) => typeof value === 'string' && value.trim().length >= 2 && value.length <= 255,
  description: (value) => !value || (typeof value === 'string' && value.length <= 5000),
  servings: (value) => typeof value === 'number' && value > 0,
  caloriesperserving: (value) => !value || (typeof value === 'number' && value >= 0),
  protein: (value) => !value || (typeof value === 'number' && value >= 0),
  carbs: (value) => !value || (typeof value === 'number' && value >= 0),
  fat: (value) => !value || (typeof value === 'number' && value >= 0),
};
