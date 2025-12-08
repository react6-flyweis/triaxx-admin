import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptionsService";

export function useRestaurantSubscriptionCities(options = {}) {
  return useQuery({
    queryKey: ["restaurant_subscription_cities"],
    queryFn: async () => {
      const res = await subscriptionsService.getRestaurantSubscriptionList();
      return res?.data ?? res;
    },
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
