import { useQuery } from "@tanstack/react-query";
import { languageService } from "@/services/languageService";

export function useLanguages(options = {}) {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => languageService.getAll(),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useLanguages;
