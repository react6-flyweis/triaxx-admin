import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as supportsService from "../services/supportsService";
import * as supportTicketsService from "../services/supportTicketsService";
import * as supportTicketRepliesService from "../services/supportTicketRepliesService";

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
    onSuccess: (data, variables, context) => {
      // variables should contain ticket_id so we can invalidate that ticket's replies
      const ticketId = variables?.ticket_id;
      if (ticketId) qc.invalidateQueries(["supportTicketReplies", ticketId]);
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
    ...rest,
  });
}

export default {
  useTicketTypes,
  useTicketById,
  useTickets,
  useTicket,
};
