import { apiRequest } from './httpClient';
import { getApiUrl, API_ENDPOINTS } from './config';

// Get user's recipes
export const getUserRecipes = async (limit = 100, offset = 0) => {
  const params = new URLSearchParams({ limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.RECIPES.GET_USER_RECIPES)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Get all public recipes
export const getPublicRecipes = async (limit = 100, offset = 0) => {
  const params = new URLSearchParams({ limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.RECIPES.GET_PUBLIC)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Get single recipe by ID
export const getRecipeById = async (id) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.RECIPES.GET_BY_ID.replace(':id', id)), {
    method: 'GET',
  });
};

// Create recipe
export const createRecipe = async (recipeData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.RECIPES.CREATE), {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
};

// Search recipes
export const searchRecipes = async (query, limit = 20, offset = 0) => {
  const params = new URLSearchParams({ q: query, limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.RECIPES.SEARCH)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Update recipe
export const updateRecipe = async (id, recipeData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.RECIPES.UPDATE.replace(':id', id)), {
    method: 'PUT',
    body: JSON.stringify(recipeData),
  });
};

// Delete recipe
export const deleteRecipe = async (id) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.RECIPES.DELETE.replace(':id', id)), {
    method: 'DELETE',
  });
};
