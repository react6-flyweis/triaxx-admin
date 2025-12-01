import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminPlanService } from "@/services/adminPlanService";

export function useCreateAdminPlan(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => adminPlanService.create(payload),
    onSuccess: (data, variables, context) => {
      // invalidate admin plans list so it refetches
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}
