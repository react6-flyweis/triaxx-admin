import api from "./apiClient";

const PATH = "/admin/admin_pos_mydevices_sold_in_restaurant";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const posDeviceService = {
  getHardwareDevicesDashboard: async () => {
    try {
      const res = await api.get(`${PATH}/POSHardwareDevices_Dashboard`);
      return res.data; // caller expects { success, message, data }
    } catch (err) {
      console.error("Error fetching hardware devices dashboard:", err);
      handleAxiosError(err);
    }
  },
};
