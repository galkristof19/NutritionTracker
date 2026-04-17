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
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
