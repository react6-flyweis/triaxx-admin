import { useState } from "react";
import { Search, FileText, Loader2, Edit2, Trash2 } from "lucide-react";
import { useTicketTypes } from "../../hooks/useSupports";
import SupportTypeDialog from "./SupportTypeDialog";
import AddSupportTicketTypeDialog from "./AddSupportTicketTypeDialog";

const TicketTypesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    data: ticketTypes = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useTicketTypes();

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicketId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTicketTypes = (ticketTypes || []).filter((ticket) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      ticket.Name?.toLowerCase().includes(q) ||
      ticket.nodes?.toLowerCase().includes(q) ||
      ticket.CreateBy?.Name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="">
      {!loading && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search ticket types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
            <p className="text-gray-600 text-lg">Loading ticket types...</p>
          </div>
        </div>
      )}

      {isError && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">
            {error?.message || "Failed to load ticket types"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTicketTypes.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 text-lg mt-4">
                No ticket types found
              </p>
            </div>
          ) : (
            filteredTicketTypes.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTicketId(ticket.support_ticket_type_id);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {ticket.Name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.Status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ticket.Status ? "● Active" : "● Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {ticket.nodes || "No description available"}
                </p>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created by:</span>
                    <span className="font-medium text-gray-900">
                      {ticket.CreateBy?.Name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-700 text-xs">
                      {ticket.CreateBy?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium text-gray-700 text-xs">
                      {formatDate(ticket.CreateAt)}
                    </span>
                  </div>
                  {ticket.UpdatedAt !== ticket.CreateAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Updated:</span>
                      <span className="font-medium text-gray-700 text-xs">
                        {formatDate(ticket.UpdatedAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Ticket ID:</span>
                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      #{ticket.support_ticket_type_id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <SupportTypeDialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) closeModal();
          else setShowModal(true);
        }}
        ticketId={selectedTicketId}
      />

      <AddSupportTicketTypeDialog
        open={showAddModal}
        onOpenChange={(open) => setShowAddModal(open)}
      />
    </div>
  );
};

export default TicketTypesList;
