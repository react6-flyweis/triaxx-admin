import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { X, Edit2, Trash2 } from "lucide-react";
import { useTicketById } from "../../hooks/useSupports";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SupportTypeDialog({ open, onOpenChange, ticketId }) {
  const {
    data: selectedTicket,
    isFetching: detailsLoading,
    isError,
    error,
  } = useTicketById(ticketId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 rounded-xl border-0 sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-red-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex justify-between items-start">
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">
                  {selectedTicket?.Name || "Ticket Details"}
                </DialogTitle>
                <DialogDescription>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTicket?.Status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTicket?.Status ? "● Active" : "● Inactive"}
                  </span>
                </DialogDescription>
              </DialogHeader>
            </div>
            <div>
              <DialogClose className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                <X className="w-6 h-6" />
              </DialogClose>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {detailsLoading ? (
            <div className="flex items-center justify-center py-10">
              <svg
                className="animate-spin h-10 w-10 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <p className="text-gray-600 ml-4">Loading details...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 text-lg mb-4">
                {error?.message || "Failed to load ticket details"}
              </p>
            </div>
          ) : (
            selectedTicket && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedTicket.nodes || "No description available"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ticket Type ID</p>
                    <p className="text-xl font-bold text-blue-600">
                      #{selectedTicket.support_ticket_type_id}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Database ID</p>
                    <p className="text-sm font-mono text-purple-600 break-all">
                      {selectedTicket._id}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Created By
                  </h3>
                  <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTicket.CreateBy?.Name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-700">
                        {selectedTicket.CreateBy?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium text-gray-700">
                        {selectedTicket.CreateBy?.user_id || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTicket.UpdatedBy && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Last Updated By
                    </h3>
                    <div className="bg-linear-to-r from-green-50 to-blue-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTicket.UpdatedBy?.Name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-700">
                          {selectedTicket.UpdatedBy?.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-medium text-gray-700">
                          {selectedTicket.UpdatedBy?.user_id || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Created At</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(selectedTicket.CreateAt)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(selectedTicket.UpdatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Ticket Type
                  </button>
                  <button className="flex-1 bg-linear-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Ticket Type
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
