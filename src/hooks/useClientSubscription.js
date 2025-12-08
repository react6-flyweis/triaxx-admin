import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptionsService";

export function useClientSubscription(restaurantId, options = {}) {
  return useQuery({
    queryKey: ["clientSubscription", restaurantId],
    queryFn: () =>
      subscriptionsService.getRestaurantSubscriptionPurchased(restaurantId),
    enabled: Boolean(restaurantId),
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useClientSubscription;
