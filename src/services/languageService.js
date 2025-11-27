import api from "./apiClient";

const PATH = "/admin/language";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const languageService = {
  // Get all languages
  getAll: async () => {
    try {
      const res = await api.get(`${PATH}/getall`);
      return res.data;
    } catch (err) {
      console.error("Error fetching languages:", err);
      handleAxiosError(err);
    }
  },
};

export default languageService;
