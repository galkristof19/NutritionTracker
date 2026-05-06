export const normalizeFood = (food) => ({
  ...food,
  itemType: 'food',
  entityId: food.id || food._id,
})

export const normalizeRecipe = (recipe) => ({
  ...recipe,
  itemType: 'recipe',
  entityId: recipe.id || recipe._id,
})

export const calculateNutritionTotals = (ingredients) => {
  return ingredients.reduce(
    (totals, ingredient) => ({
      totalCalories: totals.totalCalories + (ingredient.calories || ingredient.caloriesPer100g || 0),
      totalProtein: totals.totalProtein + (ingredient.protein || 0),
      totalCarbs: totals.totalCarbs + (ingredient.carbs || 0),
      totalFat: totals.totalFat + (ingredient.fat || 0),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  )
}
