import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken as persistToken, removeAuthToken } from "../utils/auth";

// Simple app-wide store for auth & UI state. Uses local/session storage
// persistence for convenience (via existing auth helpers).
export const useStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      theme: "light",

      setToken: (token, remember = false) => {
        set({ token });
        // mirror into storage helpers so other code can read it
        persistToken(token, remember);
      },

      removeToken: () => {
        set({ token: null, user: null });
        removeAuthToken();
      },

      setUser: (user) => set({ user }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "clement-admin-storage",
      // only persist token and user
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useStore;
