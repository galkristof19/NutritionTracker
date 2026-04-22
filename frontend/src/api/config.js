// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_CURRENT_USER: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    DELETE_ACCOUNT: '/auth/account',
  },
  // Admin endpoints
  ADMIN: {
    SET_ADMIN: '/admin/users/:uid/set-admin',
    REMOVE_ADMIN: '/admin/users/:uid/remove-admin',
    GET_ALL_ADMINS: '/admin/users/admins',
    GET_USER_ROLE: '/admin/users/:uid/role',
    BATCH_SET_ADMIN: '/admin/users/batch/set-admin',
  },
  // Food endpoints
  FOOD: {
    SEARCH_EXTERNAL: '/food/search', // Open Food Facts API search
    SEARCH_LOCAL: '/food/search-local', // Local database search
    GET_PUBLIC: '/food/public', // Get all public foods
    GET_BY_ID: '/food/:id', // Get single food
    SAVE: '/food', // Save food to database (requires auth)
    GET_USER_FOODS: '/food/user/my-foods', // Get user's saved foods (requires auth)
    UPDATE: '/food/:id', // Update food (requires auth)
    DELETE: '/food/:id', // Delete food (requires auth)
  },
  // Recipe endpoints
  RECIPES: {
    SEARCH: '/recipes/search', // Search recipes
    GET_PUBLIC: '/recipes/public', // Get all public recipes
    GET_BY_ID: '/recipes/:id', // Get single recipe
    CREATE: '/recipes', // Create recipe (requires auth)
    GET_USER_RECIPES: '/recipes/user/my-recipes', // Get user's recipes (requires auth)
    UPDATE: '/recipes/:id', // Update recipe (requires auth)
    DELETE: '/recipes/:id', // Delete recipe (requires auth)
  },
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
