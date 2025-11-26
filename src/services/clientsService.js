import api from "./apiClient";

const PATH = "/admin/clients";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const clientsService = {
  // Get all clients
  getAllClients: async () => {
    try {
      const res = await api.get(`${PATH}/getall`);
      return res.data;
    } catch (err) {
      console.error("Error fetching clients:", err);
      handleAxiosError(err);
    }
  },

  // Create a client
  createClient: async (payload) => {
    try {
      const res = await api.post(`${PATH}/create`, payload);
      return res.data;
    } catch (err) {
      console.error("Error creating client:", err);
      handleAxiosError(err);
    }
  },

  // Get client by id
  getClientById: async (id) => {
    try {
      const res = await api.get(`${PATH}/getbyid/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching client by id ${id}:`, err);
      handleAxiosError(err);
    }
  },
};
