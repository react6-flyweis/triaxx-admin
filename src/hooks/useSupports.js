import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as supportsService from "../services/supportsService";
import * as supportTicketsService from "../services/supportTicketsService";
import * as supportTicketRepliesService from "../services/supportTicketRepliesService";
import useStore from "../store/useStore";

export function useTicketTypes(options = {}) {
  return useQuery({
    queryKey: ["supportTicketTypes"],
    queryFn: supportsService.fetchTicketTypes,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    ...options,
  });
}

export function useTicketById(ticketTypeId, options = {}) {
  return useQuery({
    queryKey: ["supportTicketType", ticketTypeId],
    queryFn: () => supportsService.fetchTicketById(ticketTypeId),
    enabled: !!ticketTypeId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
    ...options,
  });
}

export function useTickets(options = {}) {
  return useQuery({
    queryKey: ["supportTickets"],
    queryFn: supportTicketsService.fetchTickets,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    ...options,
  });
}

export function useTicket(ticketId, options = {}) {
  return useQuery({
    queryKey: ["supportTicket", ticketId],
    queryFn: () => supportTicketsService.fetchTicketById(ticketId),
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
    ...options,
  });
}

export function useTicketReplies(ticketId, options = {}) {
  return useQuery({
    queryKey: ["supportTicketReplies", ticketId],
    queryFn: () => supportTicketRepliesService.fetchReplies(ticketId),
    enabled: !!ticketId,
    staleTime: 1000 * 30,
    retry: 1,
    ...options,
  });
}

export function useCreateReply(options = {}) {
  const qc = useQueryClient();
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    mutationFn: supportTicketRepliesService.createReply,
    // optimistic update: add the reply locally first
    onMutate: async (variables) => {
      const ticketId = variables?.ticket_id;
      if (!ticketId) return null;

      await qc.cancelQueries(["supportTicketReplies", ticketId]);
      const previous = qc.getQueryData(["supportTicketReplies", ticketId]);

      // get current user for optimistic metadata
      const user = useStore.getState().user;
      const optimisticReply = {
        support_ticket_reply_id: `optimistic-${Date.now()}`,
        reply: variables?.reply,
        CreateAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        _optimistic: true,
        Employee: { Name: user?.Name || user?.name || "You" },
        CreateBy: { Name: user?.Name || user?.name || "You" },
        Ticket_status: variables?.Ticket_status ?? variables?.ticket_status,
      };

      // if previous is an object with data arr, handle both shapes
      if (Array.isArray(previous)) {
        qc.setQueryData(
          ["supportTicketReplies", ticketId],
          [...previous, optimisticReply]
        );
      } else if (previous && Array.isArray(previous.data)) {
        qc.setQueryData(["supportTicketReplies", ticketId], {
          ...previous,
          data: [...previous.data, optimisticReply],
        });
      } else {
        qc.setQueryData(["supportTicketReplies", ticketId], [optimisticReply]);
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      const ticketId = variables?.ticket_id;
      if (ticketId && context?.previous) {
        qc.setQueryData(["supportTicketReplies", ticketId], context.previous);
      }
      if (onError) onError(err, variables, context);
    },
    onSettled: (data, err, variables, context) => {
      const ticketId = variables?.ticket_id;
      if (ticketId) qc.invalidateQueries(["supportTicketReplies", ticketId]);
      if (onSuccess && !err) onSuccess(data, variables, context);
    },
    ...rest,
  });
}

export default {
  useTicketTypes,
  useTicketById,
  useTickets,
  useTicket,
};
