import { useQuery } from "@tanstack/react-query";
import * as supportsService from "../services/supportsService";

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

export default {
  useTicketTypes,
  useTicketById,
};
