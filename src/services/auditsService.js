import api from "./apiClient";

const PATH = "/admin/audits";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const auditsService = {
  // Fetch audits for authenticated user
  getAudits: async () => {
    try {
      const res = await api.get(`${PATH}/getbyauth`);
      return res.data;
    } catch (err) {
      console.error("Error fetching audits:", err);
      handleAxiosError(err);
    }
  },
};
