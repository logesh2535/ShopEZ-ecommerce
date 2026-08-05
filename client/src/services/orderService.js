import { apiFetch } from './api';

export const placeOrder = async (orderData) => {
  return await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const fetchOrders = async () => {
  return await apiFetch('/orders');
};

export const fetchOrderById = async (id) => {
  return await apiFetch(`/orders/${id}`);
};
