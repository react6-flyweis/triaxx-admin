import api from "./apiClient";

const PATH = "/admin/admin_plan";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const adminPlanService = {
  getAll: async () => {
    try {
      // GET /admin/admin_plan/getall
      const res = await api.get(`${PATH}/getall`);
      return res.data; // return the API object with success, count, data
    } catch (err) {
      console.error("Error fetching admin plans:", err);
      handleAxiosError(err);
    }
  },
  create: async (payload) => {
    try {
      const res = await api.post(`${PATH}/create`, payload);
      return res.data;
    } catch (err) {
      console.error("Error creating admin plan:", err);
      handleAxiosError(err);
    }
  },
};
