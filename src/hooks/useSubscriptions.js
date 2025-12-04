import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptionsService";

export function useSubscriptions(filter = "all", options = {}) {
  return useQuery({
    queryKey: ["subscriptions", filter],
    queryFn: () => subscriptionsService.getAllSubscriptions(filter),
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
