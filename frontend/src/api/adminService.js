import { apiRequest } from './httpClient';
import { getApiUrl, API_ENDPOINTS } from './config';

// Set admin role for a user
export const setAdminRole = async (uid) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.ADMIN.SET_ADMIN.replace(':uid', uid)), {
    method: 'POST',
  });
};

// Remove admin role from a user
export const removeAdminRole = async (uid) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.ADMIN.REMOVE_ADMIN.replace(':uid', uid)), {
    method: 'POST',
  });
};

// Get all admin users
export const getAllAdmins = async () => {
  return apiRequest(getApiUrl(API_ENDPOINTS.ADMIN.GET_ALL_ADMINS), {
    method: 'GET',
  });
};

// Get user role
export const getUserRole = async (uid) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.ADMIN.GET_USER_ROLE.replace(':uid', uid)), {
    method: 'GET',
  });
};

// Batch set admin role
export const batchSetAdminRole = async (uids) => {
  return apiRequest(getApiUrl(API_ENDPOINTS.ADMIN.BATCH_SET_ADMIN), {
    method: 'POST',
    body: JSON.stringify({ uids }),
  });
};
