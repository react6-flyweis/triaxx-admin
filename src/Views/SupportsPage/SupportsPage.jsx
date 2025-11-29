import { useState } from "react";
import withAdminLayout from "../AdminPanel/withAdminLayout";
import AllTicketsPage from "../../Components/Supports/AllTicketsPage";
import TicketTypesList from "../../Components/Supports/TicketTypesList";

const SupportsPage = () => {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supports & Tickets
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "tickets"
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-200"
            }`}
            onClick={() => setActiveTab("tickets")}
          >
            All Tickets
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "types"
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-200"
            }`}
            onClick={() => setActiveTab("types")}
          >
            Ticket Types
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="">
        {activeTab === "tickets" ? <AllTicketsPage /> : <TicketTypesList />}
      </div>
    </div>
  );
};

const WrappedSupportsPage = withAdminLayout(SupportsPage);
export default WrappedSupportsPage;
