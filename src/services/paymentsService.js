import api from "./apiClient";

const PATH = "/restaurant/payment_type";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const paymentsService = {
  // Fetch all payment types
  getAll: async () => {
    try {
      const res = await api.get(`${PATH}/getall`);
      return res.data;
    } catch (err) {
      console.error("Error fetching payment types:", err);
      handleAxiosError(err);
    }
  },
  // Create a new payment type
  create: async (payload) => {
    try {
      const res = await api.post(`${PATH}/create`, payload);
      return res.data;
    } catch (err) {
      console.error("Error creating payment type:", err);
      handleAxiosError(err);
    }
  },
  // Delete a payment type by id
  delete: async (id) => {
    try {
      const res = await api.delete(`${PATH}/delete/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting payment type:", err);
      handleAxiosError(err);
    }
  },
};
