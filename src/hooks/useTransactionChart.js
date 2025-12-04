import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services/transactionsService";

export function useTransactionChart(options = {}) {
  return useQuery({
    queryKey: ["transactionChart"],
    queryFn: () => transactionsService.getChart(),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
