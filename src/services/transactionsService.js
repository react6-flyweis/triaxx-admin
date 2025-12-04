import api from "./apiClient";

const PATH = "/master/transaction";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const transactionsService = {
  // Fetch transaction chart summary
  getChart: async () => {
    try {
      const res = await api.get(`${PATH}/chart`);
      return res.data;
    } catch (err) {
      console.error("Error fetching transaction chart:", err);
      handleAxiosError(err);
    }
  },
};
