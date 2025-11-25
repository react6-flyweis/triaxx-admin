import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  setAuthToken as persistToken,
  removeAuthToken,
  getAuthToken,
} from "../utils/auth";

export const useStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      theme: "light",

      setToken: (token, remember = false) => {
        set({ token });
        // persist via helpers so we can choose session vs local storage
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
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useStore;

export function hydrateAuth() {
  const token = getAuthToken();
  if (token) {
    useStore.getState().setToken(token, false);
  }
  return token;
}
