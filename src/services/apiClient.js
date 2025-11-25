import axios from "axios";
import useStore from "../store/useStore";

// Axios instance used across the app. Base URL uses Vite environment variable
// VITE_API_BASE_URL (set in .env) and falls back to a common default.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  timeout: 10000,
});

// Attach token automatically if present
api.interceptors.request.use(
  (config) => {
    // Prefer the store token (fast, reactive) — fall back to storage helper
    const token = useStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response error handling — if we get an authentication error,
// make sure our store is cleared so the UI can react (e.g., show login).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        // clear token from store + persistent storage
        const rm = useStore.getState().removeToken;
        if (typeof rm === "function") rm();
      } catch {
        // swallow — we still want the original error propagated
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// helper for tests or callers that want the bare axios instance
export { axios as rawAxios };
