import { apiFetch } from './api';

export const fetchAdminDashboard = async () => {
  return await apiFetch('/admin/dashboard');
};

export const createProduct = async (productData) => {
  return await apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return await apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
};

export const createCategory = async (categoryData) => {
  return await apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return await apiFetch(`/categories/${id}`, {
    method: 'DELETE',
  });
};

export const fetchUsers = async () => {
  return await apiFetch('/users');
};

export const deleteUser = async (id) => {
  return await apiFetch(`/users/${id}`, {
    method: 'DELETE',
  });
};

export const updateOrderStatus = async (id, status) => {
  return await apiFetch(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};
