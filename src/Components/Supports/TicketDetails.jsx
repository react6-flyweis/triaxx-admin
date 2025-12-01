import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import {
  useTicket,
  useTicketReplies,
  useCreateReply,
} from "../../hooks/useSupports";
import useStore from "../../store/useStore";
import SuccessDialog from "@/Components/ui/SuccessDialog";

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

const TicketDetails = () => {
  const { id } = useParams();
  const user = useStore((s) => s.user);

  const { data, isLoading, isError, error, refetch } = useTicket(id);
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isError: repliesError,
    refetch: refetchReplies,
  } = useTicketReplies(id);

  const replies = Array.isArray(repliesData)
    ? repliesData
    : repliesData?.data ?? [];

  // Local editable fields
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [subject, setSubject] = useState("");
  const [reply, setReply] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [status, setStatus] = useState("New");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!data) return;
    const ticket = data?.data ?? data;
    setEmail(ticket?.CreateBy?.email ?? "");
    setBusinessName(ticket?.Customer?.Name ?? ticket?.CreateBy?.Name ?? "");
    setSubject(ticket?.SupportTicketType?.Name ?? ticket?.question ?? "");
    setReply("");

    const sRaw = ticket?.Ticket_status || ticket?.TicketStatus || "New";
    let s = sRaw;
    if (/process/i.test(sRaw) || /in[- ]?progress/i.test(sRaw)) s = "On-Going";
    if (/resolved/i.test(sRaw) || /closed/i.test(sRaw)) s = "Resolved";
    if (/new/i.test(sRaw)) s = "New";
    setStatus(s);
  }, [data]);

  const createReplyMutation = useCreateReply({
    onSuccess: () => {
      setShowModal(true);
      setReply("");
      refetchReplies();
    },
  });

  const handleSubmitReply = () => {
    if (!reply || reply.trim() === "") return;
    const employee_id =
      user?.Employee_id ||
      user?.employee_id ||
      user?.id ||
      user?.user_id ||
      null;

    createReplyMutation.mutate({
      ticket_id: id,
      reply,
      Ticket_status: "Process",
      Status: true,
      employee_id,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-gray-600 animate-pulse">Loading ticket…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-red-600">
          {error?.message || String(error)}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 rounded bg-purple-600 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const ticket = data?.data ?? data ?? {};

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="flex flex-col items-end p-4 sm:p-6 gap-4 w-full bg-gradient-to-b from-purple-700/10 to-red-600/10 rounded-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full"></div>
            <p className="font-poppins font-medium text-sm sm:text-base text-black">
              Ticket# {ticket.support_ticket_id ?? ticket._id ?? id}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            <p className="font-poppins font-medium text-xs sm:text-sm text-black">
              Posted at {formatDate(ticket?.CreateAt ?? ticket?.createdAt)}
            </p>
            <div className="text-sm text-black font-medium">
              Status: {status}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-end w-full gap-6 sm:gap-10">
          <div className="flex flex-col items-start w-full gap-6 sm:gap-8">
            <div className="flex flex-col lg:flex-row lg:flex-wrap items-start w-full gap-4 sm:gap-6 lg:gap-7">
              <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">
                  Email
                </p>
                <input
                  type="email"
                  className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">
                  Business Name
                </p>
                <input
                  type="text"
                  className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">
                  Ticket Subject
                </p>
                <input
                  type="text"
                  className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <p className="font-poppins font-medium text-base sm:text-lg text-black w-full">
              {ticket?.question ?? ticket?.description ?? "-"}
            </p>
            <p className="font-poppins font-normal text-sm sm:text-base leading-[170%] text-black w-full">
              {ticket?.details ?? ticket?.question_description ?? ""}
            </p>

            {/* Image Upload Section */}
            <div className="flex flex-col items-start gap-2 w-full max-w-full sm:max-w-[366px]">
              <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">
                Images Uploaded
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 border border-black/50 rounded p-3 sm:p-4 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex justify-center items-center px-3 py-2 sm:px-2 sm:py-1 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg">
                      <p className="font-poppins font-semibold text-xs sm:text-sm text-white">
                        Image 01
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setImage1(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                  {image1 && (
                    <img
                      src={image1}
                      alt="Preview 1"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex justify-center items-center px-3 py-2 sm:px-2 sm:py-1 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg">
                      <p className="font-poppins font-semibold text-xs sm:text-sm text-white">
                        Image 02
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setImage2(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                  {image2 && (
                    <img
                      src={image2}
                      alt="Preview 2"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              {/* Replies */}
              <div className="w-full mt-6">
                <h4 className="text-lg font-semibold mb-4">Replies</h4>
                {repliesLoading ? (
                  <p className="text-gray-600">Loading replies…</p>
                ) : repliesError ? (
                  <div className="text-center">
                    <p className="text-red-600">Failed to load replies</p>
                    <button
                      onClick={() => refetchReplies()}
                      className="mt-2 px-3 py-1 bg-purple-600 text-white rounded"
                    >
                      Retry
                    </button>
                  </div>
                ) : replies.length === 0 ? (
                  <p className="text-gray-600">No replies yet.</p>
                ) : (
                  <div className="space-y-4">
                    {replies.map((r) => (
                      <div
                        key={r._id || r.support_ticket_reply_id}
                        className="p-4 rounded-lg border border-gray-200 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                              {r.Employee?.Name?.[0] ??
                                r.CreateBy?.Name?.[0] ??
                                "U"}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {r.Employee?.Name ??
                                  r.CreateBy?.Name ??
                                  "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(r.CreateAt ?? r.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Status: {r.Ticket_status ?? r.TicketStatus ?? "-"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">{r.reply}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Section */}
            <div className="flex flex-col items-end w-full gap-6 sm:gap-10">
              <div className="flex flex-col items-start w-full gap-2">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40] w-full">
                  Reply Ticket
                </p>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Explain here..."
                  className="box-border p-3 sm:p-4 w-full h-[140px] sm:h-[182px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black resize-none"
                />
              </div>
              <button
                onClick={handleSubmitReply}
                disabled={createReplyMutation.isLoading}
                className="flex justify-center items-center px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg w-full sm:w-auto disabled:opacity-60"
              >
                <p className="font-poppins font-medium text-base sm:text-lg text-white">
                  {createReplyMutation.isLoading
                    ? "Submitting..."
                    : "Submit Reply"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SuccessDialog
        open={showModal}
        onOpenChange={(v) => setShowModal(v)}
        title="Reply Submitted"
        subtitle="Your reply has been submitted successfully."
        ctaText="Close"
      />
    </div>
  );
};

export default withAdminLayout(TicketDetails);
