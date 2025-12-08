import { useQuery } from "@tanstack/react-query";
import supportsService from "@/services/supportsService";

export function useTicketsChart(filter = "1Month", options = {}) {
  return useQuery({
    queryKey: ["ticketsChart", filter],
    queryFn: () => supportsService.fetchTicketsChart(filter),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
