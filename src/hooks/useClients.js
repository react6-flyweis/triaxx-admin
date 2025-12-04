import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clientsService";

export function useClients(filter = "all", options = {}) {
  return useQuery({
    queryKey: ["clients", filter],
    queryFn: () => clientsService.getAllClients(filter),
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

// Hook to fetch a single client by id
export function useClient(clientId, options = {}) {
  const { onSuccess, onError, ...rest } = options;

  return useQuery({
    queryKey: ["client", clientId],
    queryFn: () => clientsService.getClientById(clientId),
    enabled: Boolean(clientId),
    staleTime: 1000 * 60 * 1,
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: (data, variables, context) => {
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
    ...rest,
  });
}
