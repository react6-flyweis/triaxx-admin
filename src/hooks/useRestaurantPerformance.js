import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/reportsService";

export function useRestaurantPerformance(restaurantId, options = {}) {
  return useQuery({
    queryKey: ["restaurant_performance", restaurantId],
    queryFn: async () => {
      const res = await reportsService.getRestaurantPerformanceByQuery({
        restaurantId,
      });
      // reportsService returns the API response (with `data` property)
      // be resilient: return `res.data` if available, otherwise return res
      return res?.data ?? res;
    },
    enabled: Boolean(restaurantId),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
