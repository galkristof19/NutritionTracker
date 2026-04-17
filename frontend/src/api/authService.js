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
