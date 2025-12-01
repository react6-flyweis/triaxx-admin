import ActiveClientsChart from "./ActiveClientsChart";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d || "-";
  }
};

const ActiveClientsSection = ({ reportData = {} }) => {
  const sampleClients = reportData.active_clients_list || [
    {
      id: 1,
      name: "AOH Bars",
      plan: "3 months Plan",
      purchased: "2025-09-23",
      status: "Active",
    },
    {
      id: 2,
      name: "AOH Bars",
      plan: "6 months Plan",
      purchased: "2025-09-23",
      status: "Active",
    },
    {
      id: 3,
      name: "AOH Bars",
      plan: "1 Year Plan",
      purchased: "2025-09-23",
      status: "Active",
    },
    {
      id: 4,
      name: "AOH Bars",
      plan: "3 months Plan",
      purchased: "2025-09-23",
      status: "Active",
    },
    {
      id: 5,
      name: "AOH Bars",
      plan: "6 months Plan",
      purchased: "2025-09-23",
      status: "Active",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Clients</h3>
          <button className="text-sm text-blue-600">See all</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Business Name</th>
                <th className="py-2 pr-4">Plan Purchased</th>
                <th className="py-2 pr-4">Purchased Date</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleClients.map((c, idx) => (
                <tr key={c.id} className="border-t">
                  <td className="py-3 pr-4 text-gray-600">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4 text-gray-700">{c.plan}</td>
                  <td className="py-3 pr-4 text-gray-600">
                    {formatDate(c.purchased)}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-green-600 font-medium">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActiveClientsChart reportData={reportData} />
    </div>
  );
};

export default ActiveClientsSection;
