import { useQuery } from "@tanstack/react-query";
import { employeesService } from "@/services/employeesService";

export function useEmployeeDetails(employeeId, options = {}) {
  return useQuery({
    queryKey: ["employee-details", employeeId],
    queryFn: () => employeesService.getEmployeeById(employeeId),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
