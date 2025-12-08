import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/reportsService";

export function useReports(options = {}) {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsService.getReports(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useReportsStats(options = {}) {
  return useQuery({
    queryKey: ["reports", "stats"],
    queryFn: async () => {
      const res = await reportsService.getReportsStats();
      // Normalize: if service returned wrapper { success, message, data }, prefer inner `data`
      return res?.data ?? res;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useRestaurantByChartByCity(options = {}) {
  return useQuery({
    queryKey: ["reports", "restaurantByChartByCity"],
    queryFn: async () => {
      const res = await reportsService.getRestaurantByChartByCity();
      return res?.data ?? res;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
