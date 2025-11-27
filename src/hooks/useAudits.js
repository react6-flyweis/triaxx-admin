import { useQuery } from "@tanstack/react-query";
import { auditsService } from "@/services/auditsService";

export function useAudits(options = {}) {
  return useQuery({
    queryKey: ["audits"],
    queryFn: () => auditsService.getAudits(),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useAudits;
