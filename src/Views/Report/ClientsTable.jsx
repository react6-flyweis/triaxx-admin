import { useClients } from "@/hooks/useClients";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d || "-";
  }
};

// filter: 'all' | 'active' | 'inactive' | 'repeat'
const ClientsTable = ({ filter = "all" }) => {
  const { data: raw, isLoading, isError, error } = useClients(filter);

  const normalizeClients = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.success && response.data)
      return Array.isArray(response.data) ? response.data : [];
    if (response.clients && Array.isArray(response.clients))
      return response.clients;
    if (response.data && Array.isArray(response.data.clients))
      return response.data.clients;
    return [];
  };

  const clients = normalizeClients(raw);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] w-full">
        <div className="grid grid-cols-4 md:grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
          <div>#</div>
          <div className="col-span-2">Business Name</div>
          <div className="text-center">Plan Purchased</div>
          <div className="hidden md:block text-center">Purchased Date</div>
        </div>

        {isLoading ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-400">
            Loading...
          </div>
        ) : isError ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-red-500">
            {error?.message || "Failed to load clients"}
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-500">
            No data found
          </div>
        ) : (
          clients.map((c, idx) => (
            <div
              key={c.id ?? idx}
              className={`grid grid-cols-4 md:grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                idx === clients.length - 1 ? "rounded-b-2xl" : ""
              }`}
            >
              <div className="text-gray-600">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="col-span-2 font-medium">{c.name}</div>
              <div className="text-center text-gray-700">
                <div>{c.plan}</div>
                <div className="md:hidden text-xs text-gray-500">
                  {formatDate(c.purchased)}
                </div>
              </div>
              <div className="hidden md:block text-center text-gray-600">
                {formatDate(c.purchased)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
