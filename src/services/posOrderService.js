// src/services/posOrderService.js
import api from './apiClient';

// base path for pos order endpoints (appends to axios baseURL)
const PATH = '/restaurant/pos_order';

const handleAxiosError = (err) => {
  // normalize axios errors into thrown Error with friendly message
  const message = err?.response?.data?.message || err.message || 'Request failed';
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const posOrderService = {
  // Create a new POS order
  createOrder: async (orderData) => {
    try {
      const res = await api.post(`${PATH}/create`, orderData);
      return res.data;
    } catch (err) {
      console.error('Error creating order:', err);
      handleAxiosError(err);
    }
  },

  // Update an existing POS order
  updateOrder: async (orderData) => {
    try {
      const res = await api.put(`${PATH}/update`, orderData);
      return res.data;
    } catch (err) {
      console.error('Error updating order:', err);
      handleAxiosError(err);
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const res = await api.get(`${PATH}/getbyid/${orderId}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching order:', err);
      handleAxiosError(err);
    }
  },

  // Get all orders
  getAllOrders: async () => {
    try {
      const res = await api.get(`${PATH}/getall`);
      return res.data;
    } catch (err) {
      console.error('Error fetching all orders:', err);
      handleAxiosError(err);
    }
  },

  // Get my orders (authenticated user's orders)
  getMyOrders: async () => {
    try {
      const res = await api.get(`${PATH}/auth/my-orders`);
      return res.data;
    } catch (err) {
      console.error('Error fetching my orders:', err);
      handleAxiosError(err);
    }
  },
};
