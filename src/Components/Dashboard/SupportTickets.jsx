import image1 from "../../assets/Images/admin/Dashboard/mcd.png";
// import kfc from "../../assets/Images/admin/Dashboard/kfc.png";
// import taco from "../../assets/Images/admin/Dashboard/taco.png";
// import dalchini from "../../assets/Images/admin/Dashboard/dalchini.png";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../hooks/useSupports";

// Support Tickets Component
const SupportTickets = () => {
  const { data, isLoading, isError } = useTickets();

  // support tickets can come shaped as an array or an object with `data` field
  const tickets = data && Array.isArray(data) ? data : data?.data || [];
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black font-['Poppins']">
          Support Tickets
        </h2>
        <button
          className="text-sm font-semibold text-black font-['Poppins']"
          onClick={() => navigate("/supports")}
        >
          See all
        </button>
      </div>

      {/* Tickets Container */}
      <div className="bg-white border border-black/20 rounded-3xl shadow-lg p-4 h-96 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center h-48">
                Loading...
              </div>
            )}

            {isError && (
              <div className="text-center text-red-600">
                Failed to load tickets
              </div>
            )}

            {!isLoading && !isError && tickets.length === 0 && (
              <div className="text-center text-black/60">
                No support tickets
              </div>
            )}

            {!isLoading &&
              !isError &&
              tickets.map((ticket, index) => {
                // API fields: _id, support_ticket_id, question, Customer, CreateBy,
                // SupportTicketType, Ticket_status
                const id =
                  ticket.support_ticket_id || ticket._id || ticket.id || index;
                const requesterName =
                  ticket.Customer?.Name || ticket.CreateBy?.Name || "Unknown";
                const typeName = ticket.SupportTicketType?.Name || "Support";
                const issue =
                  ticket.question || ticket.title || "No description";
                // const status =
                //   ticket.Ticket_status || ticket.Status || "Unknown";

                // API doesn't provide avatar — use fallback
                const avatarSrc = image1;

                return (
                  <div key={id}>
                    <div className="flex items-center justify-between">
                      {/* Left side - Avatar and info */}
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12  shrink-0 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-black font-['Poppins']">
                            {requesterName}{" "}
                            <span className="text-black/60">— {typeName}</span>
                          </span>
                          <span className="text-base text-black/60 font-['Poppins']">
                            {issue}
                          </span>
                        </div>
                      </div>

                      {/* Right side - Status + Resolve button */}
                      <div className="flex items-center gap-3">
                        {/* <span className="text-sm px-3 py-1 rounded-full bg-black/10 text-black/80 font-['Poppins']">{status}</span> */}
                        <button
                          onClick={() => navigate(`/supports/${id}`)}
                          className="bg-gradient-to-b from-purple-700 to-red-600 text-white px-4 py-2 rounded-lg text-lg font-medium font-['Poppins'] hover:opacity-90 transition-opacity"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>

                    {/* Divider line */}
                    {index < tickets.length - 1 && (
                      <div className="border-t border-black/30 mt-4"></div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
