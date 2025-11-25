import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posOrderService } from "../services/posOrderService";

export function usePosOrders(options = {}) {
  return useQuery({
    queryKey: ["posOrders"],
    queryFn: posOrderService.getAllOrders,
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useCreateOrder(options = {}) {
  const qc = useQueryClient();
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    mutationFn: posOrderService.createOrder,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries(["posOrders"]);
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
    ...rest,
  });
}

export function useUpdateOrder(options = {}) {
  const qc = useQueryClient();
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    mutationFn: posOrderService.updateOrder,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries(["posOrders"]);
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
    ...rest,
  });
}
