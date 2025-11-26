import api from "./apiClient";

const BASE_URL = "/restaurant/support_ticket_type";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export async function fetchTicketTypes() {
  try {
    const res = await api.get(`${BASE_URL}/getbyauth`);
    const payload = res.data;

    // API may return either an array or an envelope { success, count, data: [...] }
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;

    // Fallbacks: prefer inner `data` when present, otherwise return an empty array
    return payload?.data ?? payload ?? [];
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function fetchTicketById(ticketTypeId) {
  try {
    const res = await api.get(`${BASE_URL}/getbyid/${ticketTypeId}`);
    const payload = res.data;

    // If API wraps the resource inside `data`, unwrap it
    return payload?.data ?? payload ?? null;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function createTicketType(payload) {
  try {
    const res = await api.post(`${BASE_URL}/create`, payload);
    // If API wraps the created resource inside `data`, return that
    return res.data?.data ?? res.data ?? res;
  } catch (err) {
    handleAxiosError(err);
  }
}

export default {
  fetchTicketTypes,
  fetchTicketById,
  createTicketType,
};
