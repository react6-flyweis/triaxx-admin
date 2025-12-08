import api from "./apiClient";

const PATH = "/restaurant/reports/reports";
const PATH_ADMIN = "/admin/reports";

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

  // Fetch restaurant performance by restaurant id
  getRestaurantPerformance: async (restaurantId) => {
    try {
      if (!restaurantId) throw new Error("restaurantId is required");
      // The backend uses /admin/reports/Restaurant_Performance/:id according to API
      const res = await api.get(
        `${PATH_ADMIN}/Restaurant_Performance/${restaurantId}`
      );
      return res.data;
    } catch (err) {
      console.error(
        `Error fetching restaurant performance for id ${restaurantId}:`,
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
