import api from "./apiClient";

// Fetch all notifications from the backend
export async function getAllNotifications() {
  const res = await api.get("/master/notifications/all");
  // API returns { success, message, data: [...] }
  return res.data?.data || [];
}

export default { getAllNotifications };
