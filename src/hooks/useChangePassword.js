import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export function useChangePassword(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => authService.changePassword(payload),
    onSuccess: (data, variables, context) => {
      // If the backend returns something that affects user data, invalidate user query
      try {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } catch (e) {
        // ignore
      }
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}
