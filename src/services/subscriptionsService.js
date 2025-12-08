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
  // Get subscription details purchased for a restaurant
  getRestaurantSubscriptionPurchased: async (restaurant_id) => {
    try {
      const res = await api.get(
        `/restaurant/admin_plan_buy_restaurant/getRestaurantSubscriptionPurchased`,
        {
          params: { restaurant_id },
        }
      );
      return res.data; // expected shape: { success, message, data }
    } catch (err) {
      console.error("Error fetching restaurant subscription:", err);
      handleAxiosError(err);
    }
  },
  // Get restaurant subscription list (city chart + totalSubscriptions)
  getRestaurantSubscriptionList: async (params = {}) => {
    try {
      const res = await api.get(
        `/restaurant/admin_plan_buy_restaurant/RestaurantSubscriptionList`,
        { params }
      );
      return res.data; // expected shape: { success, message, data: { chart: [], totalSubscriptions: 0 } }
    } catch (err) {
      console.error("Error fetching restaurant subscription list:", err);
      handleAxiosError(err);
    }
  },
  // Get subscription renewal alerts for restaurants
  getRestaurantSubscriptionRenewalAlert: async (params = {}) => {
    try {
      const res = await api.get(
        `/restaurant/admin_plan_buy_restaurant/RestaurantSubscriptionRenewalAlert`,
        { params }
      );
      return res.data; // expected shape: { success, message, count, data: { list: [] } }
    } catch (err) {
      console.error("Error fetching subscription renewal alerts:", err);
      handleAxiosError(err);
    }
  },
};
