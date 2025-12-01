import { useQuery } from "@tanstack/react-query";
import { adminPlanService } from "@/services/adminPlanService";

export function useAdminPlans(options = {}) {
  return useQuery({
    queryKey: ["adminPlans"],
    queryFn: () => adminPlanService.getAll(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
