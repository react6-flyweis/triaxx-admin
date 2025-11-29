import React from "react";
import TicketListItem from "./TicketListItem";

const OngoingTicketsPage = ({ allTickets }) => {
  const ongoingTickets = allTickets.filter(
    (ticket) => ticket.status === "On-Going"
  );

  return (
    <div className="flex flex-col items-start py-4 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ongoing Tickets</h2>
      {ongoingTickets.length > 0 ? (
        ongoingTickets.map((ticket, index) => (
          <TicketListItem
            key={ticket.id}
            ticketId={ticket.id}
            status={ticket.status}
            title={ticket.title}
            description={ticket.description}
            userName={ticket.userName}
            isFirst={index === 0}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-600 text-lg">
          No ongoing tickets found.
        </p>
      )}
    </div>
  );
};

export default OngoingTicketsPage;
