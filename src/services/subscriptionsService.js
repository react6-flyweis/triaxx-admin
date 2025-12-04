import api from "./apiClient";

const PATH = "/master/plan_map_client";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const subscriptionsService = {
  // Get all subscriptions with optional filter: today, yesterday, this week, this month, this year
  getAllSubscriptions: async (filter = "all") => {
    try {
      const res = await api.get(`${PATH}/getall-Subscriptions`, {
        params: { filter },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      handleAxiosError(err);
    }
  },
};
