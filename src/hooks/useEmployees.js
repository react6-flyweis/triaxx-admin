import { useQuery } from "@tanstack/react-query";
import { employeesService } from "@/services/employeesService";

export function useEmployees(clientId, options = {}) {
  return useQuery({
    queryKey: ["client-employees", clientId],
    queryFn: () => employeesService.getEmployeesByClient(clientId),
    enabled: Boolean(clientId),
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
