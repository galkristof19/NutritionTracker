import { describe, it, expect } from 'vitest'
import { normalizeFood, normalizeRecipe, calculateNutritionTotals } from '../../frontend/src/utils/foodUtils.js'

describe('frontend foodUtils', () => {
  it('normalizeFood sets itemType and entityId from id', () => {
    const food = { id: '123', name: 'Apple' }
    const n = normalizeFood(food)
    expect(n.itemType).toBe('food')
    expect(n.entityId).toBe('123')
    expect(n.name).toBe('Apple')
  })

  it('normalizeFood uses _id when id is missing', () => {
    const food = { _id: 'abc', name: 'Banana' }
    const n = normalizeFood(food)
    expect(n.entityId).toBe('abc')
  })

  it('normalizeRecipe sets itemType and entityId', () => {
    const recipe = { id: 'r1', name: 'Salad' }
    const r = normalizeRecipe(recipe)
    expect(r.itemType).toBe('recipe')
    expect(r.entityId).toBe('r1')
  })

  it('calculateNutritionTotals returns zeros for empty list', () => {
    const totals = calculateNutritionTotals([])
    expect(totals).toEqual({ totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 })
  })

  it('calculateNutritionTotals sums calories and macronutrients', () => {
    const ingredients = [
      { calories: 100, protein: 5, carbs: 10, fat: 2 },
      { calories: 50, protein: 2, carbs: 5, fat: 1 },
    ]
    const totals = calculateNutritionTotals(ingredients)
    expect(totals.totalCalories).toBe(150)
    expect(totals.totalProtein).toBe(7)
    expect(totals.totalCarbs).toBe(15)
    expect(totals.totalFat).toBe(3)
  })

  it('calculateNutritionTotals falls back to caloriesPer100g', () => {
    const ingredients = [{ caloriesPer100g: 42, protein: 1 }]
    const totals = calculateNutritionTotals(ingredients)
    expect(totals.totalCalories).toBe(42)
    expect(totals.totalProtein).toBe(1)
  })

  it('calculateNutritionTotals handles missing macronutrient fields', () => {
    const ingredients = [{ calories: 10 }, { caloriesPer100g: 20 }]
    const totals = calculateNutritionTotals(ingredients)
    expect(totals.totalProtein).toBe(0)
    expect(totals.totalCarbs).toBe(0)
    expect(totals.totalFat).toBe(0)
  })

  it('calculateNutritionTotals works with fractional values', () => {
    const ingredients = [{ calories: 12.5, protein: 0.3, carbs: 1.2, fat: 0.1 }]
    const totals = calculateNutritionTotals(ingredients)
    expect(totals.totalCalories).toBeCloseTo(12.5)
    expect(totals.totalProtein).toBeCloseTo(0.3)
  })
})
