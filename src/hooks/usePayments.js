import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/services/paymentsService";

export function usePayments(options = {}) {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentsService.getAll(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
