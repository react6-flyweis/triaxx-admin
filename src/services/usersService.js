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
};

export default usersService;
