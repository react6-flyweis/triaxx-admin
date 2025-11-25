import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clientsService";

export function useClients(options = {}) {
  return useQuery({
    queryKey: ["clients"],
    queryFn: clientsService.getAllClients,
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useCreateClient(options = {}) {
  const qc = useQueryClient();
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    mutationFn: clientsService.createClient,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries(["clients"]);
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
    ...rest,
  });
}
