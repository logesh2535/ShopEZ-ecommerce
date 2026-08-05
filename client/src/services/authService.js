import { apiFetch } from './api';

export const loginUser = async (credentials) => {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getUserProfile = async () => {
  return await apiFetch('/auth/profile');
};

export const updateUserProfile = async (data) => {
  return await apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
