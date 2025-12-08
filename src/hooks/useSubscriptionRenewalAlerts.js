import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptionsService";

export function useSubscriptionRenewalAlerts(options = {}) {
  return useQuery({
    queryKey: ["subscriptionRenewalAlerts"],
    queryFn: async () => {
      const res =
        await subscriptionsService.getRestaurantSubscriptionRenewalAlert();
      // API expected shape: { success, message, count, data: { list: [] } }
      return res?.data?.list || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useSubscriptionRenewalAlerts;
