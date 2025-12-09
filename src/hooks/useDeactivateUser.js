import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";

export function useDeactivateUser(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => usersService.deactivate(id),
    onSuccess: (data, variables, context) => {
      // Invalidate users lists so UI refreshes. Invalidate both general
      // users key and any role-specific keys (e.g. ["users","role",5]).
      qc.invalidateQueries({ queryKey: ["users"], exact: false });
      qc.invalidateQueries({ queryKey: ["users", "role"], exact: false });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export default useDeactivateUser;
