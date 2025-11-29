// AllTicketsPage - fetches support tickets and renders status nav + lists
import React, { useMemo, useState } from "react";
import { useTickets } from "../../hooks/useSupports";
import TicketStatusNav from "./TicketStatusNav";
import TicketListItem from "./TicketListItem";
import NewTicketsPage from "./NewTicketsPage";
import OngoingTicketsPage from "./OngoingTicketsPage";
import ResolvedTicketsPage from "./ResolvedTicketsPage";

// Uses `useTickets` React Query hook (see `src/hooks/useSupports.js`)

const mapTicket = (item) => {
  // Normalize API ticket to component-friendly shape
  const statusRaw =
    item.Ticket_status || item.TicketStatus || item.status || "New";
  let status = statusRaw;
  // Normalize common statuses
  if (/process/i.test(statusRaw) || /in[- ]?progress/i.test(statusRaw))
    status = "On-Going";
  if (/resolved/i.test(statusRaw) || /closed/i.test(statusRaw))
    status = "Resolved";
  if (/new/i.test(statusRaw)) status = "New";

  return {
    id: item.support_ticket_id ?? item._id,
    status,
    title:
      item.question ??
      item.SupportTicketType?.Name ??
      `Ticket #${item.support_ticket_id ?? item._id}`,
    description: item.question ?? item.SupportTicketType?.nodes ?? "",
    userName: item.CreateBy?.Name ?? item.Customer?.Name ?? "Unknown",
    raw: item,
  };
};

const AllTicketsPage = () => {
  const [activeTab, setActiveTab] = useState("All Tickets");
  const { data, isLoading, isError, error, refetch } = useTickets();

  const allTickets = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map(mapTicket);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-gray-600 animate-pulse">Loading tickets…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-red-600">{error?.message || error}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 rounded bg-purple-600 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start py-4 w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <input
            placeholder="Search for ticket"
            className="px-4 py-2 rounded-lg border border-gray-200 w-64"
            // TODO: wire up search
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="border border-gray-200 rounded px-3 py-2">
            <option>Select Priority</option>
          </select>
          <select className="border border-gray-200 rounded px-3 py-2">
            <option>Today</option>
          </select>
        </div>
      </div>

      <TicketStatusNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 w-full">
        {activeTab === "All Tickets" && (
          <div className="space-y-6">
            {allTickets.length === 0 ? (
              <p className="text-gray-600">No tickets found.</p>
            ) : (
              allTickets.map((t, idx) => (
                <TicketListItem
                  key={t.id}
                  ticketId={t.id}
                  status={t.status}
                  title={t.title}
                  description={t.description}
                  userName={t.userName}
                  isFirst={idx === 0}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "New" && <NewTicketsPage allTickets={allTickets} />}
        {activeTab === "On-Going" && (
          <OngoingTicketsPage allTickets={allTickets} />
        )}
        {activeTab === "Resolved" && (
          <ResolvedTicketsPage allTickets={allTickets} />
        )}
      </div>
    </div>
  );
};

export default AllTicketsPage;
