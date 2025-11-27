import { useQuery } from "@tanstack/react-query";
import { currencyService } from "@/services/currencyService";

export function useCurrencies(options = {}) {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => currencyService.getAll(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useCurrencies;
