import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export function useRequestPasswordReset(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => authService.requestPasswordReset(payload),
    onSuccess: (data, variables, context) => {
      // allow callers to handle UI changes
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export function useVerifyOtp(options = {}) {
  return useMutation({
    mutationFn: (payload) => authService.verifyOtp(payload),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export function useResetPassword(options = {}) {
  return useMutation({
    mutationFn: (payload) => authService.resetPassword(payload),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}
