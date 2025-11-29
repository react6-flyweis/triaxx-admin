import api from "./apiClient";

const BASE_URL = "/restaurant/support_ticket";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export async function fetchTickets() {
  try {
    const res = await api.get(`${BASE_URL}/getall`);
    const payload = res.data;
    // API returns envelope { success, count, data }
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return payload?.data ?? payload ?? [];
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function fetchTicketById(id) {
  try {
    const res = await api.get(`${BASE_URL}/getbyid/${id}`);
    const payload = res.data;
    return payload?.data ?? payload ?? null;
  } catch (err) {
    handleAxiosError(err);
  }
}

export default { fetchTickets };
