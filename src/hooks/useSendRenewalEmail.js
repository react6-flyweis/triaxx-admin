import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/apiClient";

export function useSendRenewalEmail(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      // payload: { restaurant_id, email }
      const res = await api.post(
        `/restaurant/admin_plan_buy_restaurant/sendRenewalEmail`,
        payload
      );
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
}

export default useSendRenewalEmail;
