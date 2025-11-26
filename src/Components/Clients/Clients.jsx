import React, { useRef, useState } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import dot from "../../assets/Images/admin/client/dot.png";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Images/Home/logo.png";
import { useClients } from "../../hooks/useClients";

const Clients = () => {
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("All Clients");
  const [showRightPanel, setShowRightPanel] = useState(false);
  const buttonRefs = useRef([]);
  const rightPanelRef = useRef(null);
  const mainContentRef = useRef(null);
  const tableScrollRef = useRef(null);
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [dotPosition, setDotPosition] = useState({ top: 12, left: 0 });

  const getPlanButtonStyle = () => {
    return "bg-gradient-to-b from-purple-700 to-red-600 text-white";
  };

  const normalizeClients = (response) => {
    if (!response) return [];
    // If the API returns a plain array
    if (Array.isArray(response)) return response;
    // Common shape: { success: true, count, data: [...] }
    if (response.success && response.data)
      return Array.isArray(response.data) ? response.data : [];
    // Some endpoints wrap in `data` or `clients` keys
    if (response.clients && Array.isArray(response.clients))
      return response.clients;
    if (response.data && Array.isArray(response.data.clients))
      return response.data.clients;
    return [];
  };

  const computeDotPosition = React.useCallback(() => {
    if (
      selectedClientIndex === null ||
      !buttonRefs.current[selectedClientIndex] ||
      !rightPanelRef.current ||
      !mainContentRef.current
    )
      return { top: 12, left: 0 };

    const btn = buttonRefs.current[selectedClientIndex];
    const btnRect = btn.getBoundingClientRect();
    const panelRect = rightPanelRef.current.getBoundingClientRect();
    const containerRect = mainContentRef.current.getBoundingClientRect();

    const rawTop = btnRect.top - containerRect.top + btnRect.height / 2 - 16;
    const clampedTop = Math.max(
      12,
      Math.min(containerRect.height - 32, rawTop)
    );
    const rawLeft = panelRect.left - containerRect.left - 38;
    const clampedLeft = Math.max(0, rawLeft);

    return { top: clampedTop, left: clampedLeft };
  }, [selectedClientIndex]);

  React.useEffect(() => {
    const update = () => {
      setDotPosition(computeDotPosition());
    };

    update();
    const scrollElement = tableScrollRef.current;
    scrollElement?.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      scrollElement?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [computeDotPosition, clients.length]);

  const handleClientSelect = (index) => {
    setSelectedClientIndex(index);
    setShowRightPanel(true);
  };

  const closeRightPanel = () => {
    setShowRightPanel(false);
    setSelectedClientIndex(null);
  };

  const dropdownOptions = ["All Clients", "Active Clients", "Inactive Clients"];

  // fetch clients via react-query
  const {
    data: rawClients,
    isLoading,
    isError,
    error,
  } = useClients({
    onError: (err) => {
      // keep this simple — components can show errors
      console.error("Failed to fetch clients", err);
    },
  });

  // derived normalized clients
  React.useEffect(() => {
    setClients(normalizeClients(rawClients));
  }, [rawClients]);

  const selectedClient =
    selectedClientIndex !== null && clients[selectedClientIndex]
      ? clients[selectedClientIndex]
      : null;

  const formatDate = (d) => {
    if (!d) return "--";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4 sm:gap-0 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Clients
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-48 items-start sm:items-center w-full sm:w-auto relative">
            <button
              className="bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-4 sm:px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => navigate("/create-clients")}
            >
              Create Client
              <span className="text-lg">+</span>
            </button>

            {/* Dropdown Trigger */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-black rounded-md px-4 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 w-full sm:w-auto"
              >
                {selectedPeriod}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-[246px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-lg px-3 py-4 z-50">
                  {dropdownOptions.map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded text-[16px] font-medium font-[Manrope] leading-6 ${
                        selectedPeriod === period
                          ? "bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white"
                          : "text-black hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col lg:flex-row h-full relative gap-4 lg:gap-8 overflow-visible min-h-0"
          ref={mainContentRef}
        >
          {selectedClientIndex !== null && (
            <img
              src={dot}
              alt="dot"
              className="absolute z-50 pointer-events-none"
              style={{
                top: dotPosition.top,
                left: dotPosition.left,
              }}
            />
          )}
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-full lg:w-[70%] flex-1 min-h-0">
            {/* Desktop Table Header */}
            <div className="hidden sm:block bg-linear-to-r from-purple-100 to-red-100 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-gray-600 font-semibold text-sm">#</div>
                <div className="text-gray-600 font-semibold text-sm">
                  Company Name
                </div>
                <div className="text-gray-600 font-semibold text-sm">
                  Renewal Date
                </div>
                <div className="text-gray-600 font-semibold text-sm text-center">
                  Plan
                </div>
              </div>
            </div>

            <div
              ref={tableScrollRef}
              className="overflow-y-auto h-full"
              style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
            >
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="border-b border-gray-200 px-4 sm:px-6 py-4"
                    >
                      <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                        <div className="flex justify-center items-center">
                          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="sm:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                          </div>
                          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-6 text-center text-red-500">
                  {error?.message || "Failed to load clients"}
                </div>
              ) : clients.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No clients found.
                </div>
              ) : (
                clients.map((client, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Desktop Row */}
                    <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                      <div className="text-gray-800 font-semibold text-sm">
                        {client.Clients_id ?? client._id ?? index + 1}
                      </div>
                      <div className="text-gray-800 font-semibold text-sm">
                        {client.Business_Name ?? client.company}
                      </div>
                      <div className="text-red-500 font-normal text-sm">
                        {client.UpdatedAt
                          ? new Date(client.UpdatedAt).toLocaleDateString()
                          : client.CreateAt
                          ? new Date(client.CreateAt).toLocaleDateString()
                          : "--"}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          ref={(el) => (buttonRefs.current[index] = el)}
                          onClick={() => setSelectedClientIndex(index)}
                          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md cursor-pointer ${getPlanButtonStyle(
                            client.plan
                          )}`}
                        >
                          {client.type ?? client.plan ?? "—"}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Card */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-gray-500 text-xs font-medium">
                            #{client.Clients_id ?? client._id ?? index + 1}
                          </div>
                          <div className="text-gray-800 font-semibold text-base">
                            {client.Business_Name ?? client.company}
                          </div>
                        </div>
                        <button
                          onClick={() => handleClientSelect(index)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:shadow-md cursor-pointer ${getPlanButtonStyle(
                            client.plan
                          )}`}
                        >
                          {client.plan}
                        </button>
                      </div>
                      <div className="text-red-500 font-normal text-sm">
                        Renewal:{" "}
                        {client.UpdatedAt
                          ? new Date(client.UpdatedAt).toLocaleDateString()
                          : client.CreateAt
                          ? new Date(client.CreateAt).toLocaleDateString()
                          : "--"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Desktop */}
          <div className="w-full lg:w-[27%] hidden lg:flex relative">
            <div
              ref={rightPanelRef}
              className="sticky top-24 min-h-[600px] rounded-tl-[10px] text-white flex flex-col items-center py-12 px-6 overflow-x-visible overflow-y-auto"
              style={{
                background: "linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)",
                maxHeight: "calc(100vh - 160px)",
              }}
            >
              {selectedClient ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 tracking-wide">
                    {selectedClient.Business_Name ||
                      selectedClient.company ||
                      selectedClient.BusinessName ||
                      "Company Name"}
                  </h2>

                  <div className="bg-white rounded-xl flex items-center justify-center w-[180px] h-[180px] mb-4">
                    <img
                      src={
                        selectedClient.logo ||
                        selectedClient.Business_Logo ||
                        selectedClient.businessLogo ||
                        logo
                      }
                      alt="logo"
                      className="w-[120px] h-5 object-contain"
                    />
                  </div>

                  <p className="text-lg font-medium mb-2">
                    {selectedClient.plan || selectedClient.type || "—"}
                  </p>

                  <div className="text-base text-white/80 font-medium mb-2">
                    Renewal Date:
                    <span className="text-white text-xl font-bold ml-2">
                      {formatDate(
                        selectedClient.UpdatedAt ||
                          selectedClient.CreateAt ||
                          selectedClient.renewalDate
                      )}
                    </span>
                  </div>

                  <div className="text-base text-white/80 font-medium mb-2">
                    Last Year Sales:
                    <span className="text-white text-xl font-bold ml-2">
                      {selectedClient.lastYearSales ||
                        selectedClient.LastYearSales ||
                        "30 412 XOF"}
                    </span>
                  </div>

                  <div className="text-base text-white/80 font-medium mb-8">
                    Total orders Last Year:
                    <span className="text-white text-xl font-bold ml-2">
                      {selectedClient.totalOrders ||
                        selectedClient.Total_Orders ||
                        selectedClient.TotalOrders ||
                        "3 412"}
                    </span>
                  </div>

                  {(selectedClient.Email ||
                    selectedClient.email ||
                    selectedClient.contact ||
                    selectedClient.phone) && (
                    <div className="text-sm text-white/90 mb-6 text-center">
                      {selectedClient.Email ||
                        selectedClient.email ||
                        selectedClient.contact ||
                        selectedClient.phone}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      navigate(
                        `/client-details/${selectedClient?.Clients_id || ""}`
                      )
                    }
                    className="bg-white text-[#D32F2F] w-[140px] h-[38px] rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                  >
                    View More &gt;
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/90">
                  <div className="text-lg font-semibold mb-2">
                    No client selected
                  </div>
                  <div className="text-sm text-white/80">
                    Select a client from the table to see details
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet / Modal */}
        {showRightPanel && selectedClientIndex !== null && (
          <div className="lg:hidden fixed inset-0  bg-opacity-50 z-50 flex items-end">
            <div
              className="w-full max-h-[80vh] overflow-y-auto rounded-t-[20px] text-white flex flex-col items-center py-8 px-6 animate-slide-up"
              style={{
                background: "linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)",
              }}
            >
              <button
                onClick={closeRightPanel}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-6 tracking-wide">
                Company Details
              </h2>

              <div className="bg-white rounded-xl flex items-center justify-center w-[140px] h-[140px] mb-4">
                <img
                  src={
                    selectedClient?.logo ||
                    selectedClient?.Business_Logo ||
                    selectedClient?.businessLogo ||
                    logo
                  }
                  alt="logo"
                  className="w-[100px] h-4 object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {selectedClient?.Business_Name ||
                  selectedClient?.company ||
                  selectedClient?.BusinessName ||
                  "-"}
              </h3>
              <p className="text-base font-medium mb-6">
                {selectedClient?.plan || selectedClient?.type || "-"}
              </p>

              <div className="w-full max-w-sm space-y-4 mb-8">
                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Last Year Sales
                  </div>
                  <div className="text-white text-xl font-bold">
                    {selectedClient?.lastYearSales ||
                      selectedClient?.LastYearSales ||
                      "30 412 XOF"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Total Orders Last Year
                  </div>
                  <div className="text-white text-xl font-bold">
                    {selectedClient?.totalOrders ||
                      selectedClient?.Total_Orders ||
                      selectedClient?.TotalOrders ||
                      "3 412"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Renewal Date
                  </div>
                  <div className="text-white text-base font-semibold">
                    {formatDate(
                      selectedClient?.UpdatedAt ||
                        selectedClient?.CreateAt ||
                        selectedClient?.renewalDate
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={() =>
                    navigate(
                      `/client-details/${
                        selectedClient?.Clients_id ||
                        selectedClient?._id ||
                        selectedClient?.id ||
                        ""
                      }`
                    )
                  }
                  className="bg-white text-[#D32F2F] flex-1 py-3 rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  View Details
                </button>
                <button
                  onClick={closeRightPanel}
                  className="border-2 border-white text-white flex-1 py-3 rounded-md text-base font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const ClientsWithLayout = withAdminLayout(Clients);
export default ClientsWithLayout;
