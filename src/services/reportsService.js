import api from "./apiClient";

const PATH = "/restaurant/reports/reports";
// const PATH_ADMIN = "/admin/reports";

// const endpointMap = {
//   today: "reports_today",
//   month: "reports_month",
//   "6months": "reports_six_month",
//   year: "reports_six_month",
// };

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const reportsService = {
  // Fetch reports by period id (today, month, 6months, year)
  getReports: async () => {
    try {
      const res = await api.get(`${PATH}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching reports:", err);
      handleAxiosError(err);
    }
  },

  // Fetch restaurant performance using query params on the public restaurant API
  // Example: GET /restaurant/reports/getRestaurantPerformance?restaurant_id=123&filter=24H
  getRestaurantPerformanceByQuery: async ({ restaurantId, filter } = {}) => {
    try {
      if (!restaurantId) throw new Error("restaurantId is required");
      const params = new URLSearchParams();
      params.append("restaurant_id", restaurantId);
      if (filter) params.append("filter", filter);

      const res = await api.get(
        `/restaurant/reports/getRestaurantPerformance?${params.toString()}`
      );
      return res.data;
    } catch (err) {
      console.error(
        `Error fetching restaurant performance (query) for id ${restaurantId}:`,
        err
      );
      handleAxiosError(err);
    }
  },
  // Fetch reports stats (Total revenue, monthly recurring, top performers, etc.)
  getReportsStats: async () => {
    try {
      // Use a slightly larger timeout for this endpoint specifically
      const res = await api.get(`/restaurant/reports/ReportsStats`, {
        timeout: 30000,
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching reports stats:", err);
      handleAxiosError(err);
    }
  },
  // Fetch restaurant chart grouped by city
  getRestaurantByChartByCity: async () => {
    try {
      const res = await api.get(`/restaurant/reports/RestaurantByChartByCity`);
      return res.data;
    } catch (err) {
      console.error("Error fetching restaurant chart by city:", err);
      handleAxiosError(err);
    }
  },
};
