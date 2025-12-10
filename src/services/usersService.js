import api from "./apiClient";

const PATH = "/user";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const usersService = {
  create: async (payload) => {
    try {
      const res = await api.post(`${PATH}/create`, payload);
      return res.data;
    } catch (err) {
      console.error("Error creating user:", err);
      handleAxiosError(err);
    }
  },
  getByRoleId: async (roleId) => {
    try {
      const res = await api.get(`${PATH}/getbyroleid/${roleId}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching users by role ${roleId}:`, err);
      handleAxiosError(err);
    }
  },
  // Deactivate (soft-delete) a user by id. Endpoint: /user/:id/deactivate
  deactivate: async (id) => {
    try {
      const res = await api.patch(`${PATH}/${id}/deactivate`);
      return res.data;
    } catch (err) {
      console.error(`Error deactivating user ${id}:`, err);
      handleAxiosError(err);
    }
  },
  // Update user settings by id. Endpoint: /user/update
  update: async (payload) => {
    try {
      const res = await api.put(`${PATH}/update`, payload);
      return res.data;
    } catch (err) {
      console.error(`Error updating user:`, err);
      handleAxiosError(err);
    }
  },
};

export default usersService;
