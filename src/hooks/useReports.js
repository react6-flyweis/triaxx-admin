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
