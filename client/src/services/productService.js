import { apiFetch } from './api';

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiFetch(`/products?${query}`);
};

export const fetchProductById = async (id) => {
  return await apiFetch(`/products/${id}`);
};

export const fetchCategories = async () => {
  return await apiFetch('/categories');
};

export const createProductReview = async (id, reviewData) => {
  return await apiFetch(`/products/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

export const subscribeToNewsletter = async (email) => {
  return await apiFetch('/admin/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
