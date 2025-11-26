import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsService } from "@/services/paymentsService";

export function useDeletePayment(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => paymentsService.delete(id),
    onSuccess: (data, variables, context) => {
      // invalidate payments so list refreshes
      qc.invalidateQueries({ queryKey: ["payments"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export default useDeletePayment;
