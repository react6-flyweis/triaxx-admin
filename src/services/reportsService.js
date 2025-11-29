import api from "./apiClient";

const PATH = "/restaurant/reports";
const PATH_ADMIN = "/admin/reports";

const endpointMap = {
  today: "reports_today",
  month: "reports_month",
  "6months": "reports_six_month",
  year: "reports_six_month",
};

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const reportsService = {
  // Fetch reports by period id (today, month, 6months, year)
  getReports: async (periodId = "today") => {
    try {
      const endpoint = endpointMap[periodId] || endpointMap.today;
      const res = await api.get(`${PATH}/${endpoint}`);
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
};
