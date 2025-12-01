import api from "./apiClient";

const BASE_URL = "/restaurant/support_ticket_reply";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export async function fetchReplies(ticketId) {
  try {
    const res = await api.get(
      `${BASE_URL}/getall?ticket_id=${encodeURIComponent(ticketId)}`
    );
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return payload?.data ?? payload ?? [];
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function createReply(payload) {
  try {
    // Accept either { ticket_id, reply, ... } or { support_ticket_id, reply, ... }
    const body = { ...payload };
    if (body.ticket_id && !body.support_ticket_id) {
      body.support_ticket_id = body.ticket_id;
      // keep ticket_id for callers that rely on it
    }

    const res = await api.post(`${BASE_URL}/create`, body);

    // Some endpoints wrap response in { data: ... } while others return array/object directly.
    // Normalize to return the server payload directly.
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export default { fetchReplies, createReply };
