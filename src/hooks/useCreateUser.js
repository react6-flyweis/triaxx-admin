import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";

export function useCreateUser(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => usersService.create(payload),
    onSuccess: (data, variables, context) => {
      // invalidate users list so it refetches if present
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export default useCreateUser;
