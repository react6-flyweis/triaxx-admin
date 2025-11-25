import { useMutation } from "@tanstack/react-query";
import api from "../services/apiClient";
import useStore from "../store/useStore";

// login using axios instance. New API shape returns { success, message, data: { token, user, ... } }
async function loginFn({ payload }) {
  const res = await api.post("/user/login", payload);
  // return the inner `data` object (new API pattern)
  return res.data?.data;
}

export function useLogin(options = {}) {
  const setToken = useStore((s) => s.setToken);
  const setUser = useStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ payload }) => loginFn({ payload }),
    ...(options || {}),
    onSuccess: (data, variables, context) => {
      try {
        // New API pattern: data contains { token, user }
        const token = data?.token;
        const user = data?.user;
        if (token) {
          setToken(token, !!variables?.remember);
        }

        // persist user into app state when available
        if (user) {
          setUser(user);
        }
      } catch (e) {
        // swallow local state errors but still allow caller onSuccess
        console.warn("useLogin: failed to persist token to store", e);
      }

      if (typeof options.onSuccess === "function") {
        return options.onSuccess(data, variables, context);
      }
    },
  });
}

export default useLogin;
