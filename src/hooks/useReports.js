import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/reportsService";

export function useReports(period = "today", options = {}) {
  return useQuery({
    queryKey: ["reports", period],
    queryFn: () => reportsService.getReports(period),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: Boolean(period),
    ...options,
  });
}
