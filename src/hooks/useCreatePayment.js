import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsService } from "@/services/paymentsService";

export function useCreatePayment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => paymentsService.create(payload),
    onSuccess: (data, variables, context) => {
      // invalidate payments list so it refetches
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}
