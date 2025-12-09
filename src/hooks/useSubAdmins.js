import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";

// Hook to fetch users by role id (default roleId = 5 -> SubAdmin)
export function useSubAdmins(roleId = 5, options = {}) {
  return useQuery({
    queryKey: ["users", "role", roleId],
    queryFn: () => usersService.getByRoleId(roleId),
    // select only the array of users from the API response
    select: (res) => res?.data || [],
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: Boolean(roleId),
    ...options,
  });
}

export default useSubAdmins;
