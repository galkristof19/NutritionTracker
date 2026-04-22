import { apiRequest, getAuthToken } from './httpClient';
import { getApiUrl, API_ENDPOINTS } from './config';

// Register a new user
export const registerUser = async (userData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Get current user profile
export const getCurrentUser = async () => {
  return apiRequest(getApiUrl(API_ENDPOINTS.AUTH.GET_CURRENT_USER), {
    method: 'GET',
  });
};

// Update user profile
export const updateUserProfile = async (userData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.AUTH.UPDATE_PROFILE), {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Delete user account
export const deleteUserAccount = async () => {
  return apiRequest(getApiUrl(API_ENDPOINTS.AUTH.DELETE_ACCOUNT), {
    method: 'DELETE',
  });
};

// Search foods from external API (Open Food Facts)
export const searchExternalFoods = async (query, page = 1) => {
  const params = new URLSearchParams({ q: query, page: page });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.FOOD.SEARCH_EXTERNAL)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Search foods from local database
export const searchLocalFoods = async (query, limit = 20, offset = 0) => {
  const params = new URLSearchParams({ q: query, limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.FOOD.SEARCH_LOCAL)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Get all public foods
export const getPublicFoods = async (limit = 100, offset = 0) => {
  const params = new URLSearchParams({ limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.FOOD.GET_PUBLIC)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Get single food by ID
export const getFoodById = async (id) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.FOOD.GET_BY_ID.replace(':id', id)), {
    method: 'GET',
  });
};

// Save a food item to database
export const saveFood = async (foodData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.FOOD.SAVE), {
    method: 'POST',
    body: JSON.stringify(foodData),
  });
};

// Get current user's saved foods
export const getUserFoods = async (limit = 100, offset = 0) => {
  const params = new URLSearchParams({ limit: limit, offset: offset });
  return apiRequest(`${getApiUrl(API_ENDPOINTS.FOOD.GET_USER_FOODS)}?${params.toString()}`, {
    method: 'GET',
  });
};

// Update a food item
export const updateFood = async (id, foodData) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.FOOD.UPDATE.replace(':id', id)), {
    method: 'PUT',
    body: JSON.stringify(foodData),
  });
};

// Delete a food item
export const deleteFood = async (id) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.FOOD.DELETE.replace(':id', id)), {
    method: 'DELETE',
  });
};
