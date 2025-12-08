import { useTickets } from "@/hooks/useSupports";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-GB");
  } catch {
    return d || "-";
  }
};

const SupportTicketsTable = () => {
  const { data, isLoading, isError, error } = useTickets();

  const rawTickets = Array.isArray(data) ? data : data?.data ?? [];

  // sort by created/issue date desc and take latest 5
  const tickets = rawTickets
    .slice()
    .sort((a, b) => {
      const da = new Date(
        a?.createdAt || a?.IssueDate || a?.date || a?.created_at || 0
      ).getTime();
      const db = new Date(
        b?.createdAt || b?.IssueDate || b?.date || b?.created_at || 0
      ).getTime();
      return db - da;
    })
    .slice(0, 5);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] w-full">
        <div className="grid grid-cols-6 bg-linear-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
          <div>#</div>
          <div className="col-span-2">Business Name</div>
          <div>Ticket Raised</div>
          <div className="hidden md:block text-center">Issue Date</div>
          <div className="text-right">Status</div>
        </div>

        {isLoading ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-400">
            Loading...
          </div>
        ) : isError ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-red-500">
            {error?.message || "Failed to load tickets"}
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-500">
            No tickets found
          </div>
        ) : (
          tickets.map((t, idx) => {
            const business =
              t?.BusinessName ||
              t?.restaurant?.Name ||
              t?.client_name ||
              t?.client?.name ||
              t?.business ||
              "-";
            const title =
              t?.title || t?.issue || t?.message || t?.subject || "-";
            const date =
              t?.createdAt || t?.IssueDate || t?.date || t?.created_at;

            return (
              <div
                key={t.id ?? idx}
                className={`grid grid-cols-6 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                  idx === tickets.length - 1 ? "rounded-b-2xl" : ""
                } hover:bg-gray-50`}
              >
                <div className="text-gray-600">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="col-span-2 font-medium">{business}</div>
                <div className="text-red-600 font-semibold truncate max-w-[320px]">
                  {title}
                </div>
                <div className="hidden md:block text-center text-gray-600">
                  {formatDate(date)}
                </div>
                <div className="text-right">
                  <button className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-sm border border-purple-700/20 hover:from-purple-800">
                    Resolve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupportTicketsTable;
