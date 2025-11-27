import React, { useState } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import {
  ChevronDown,
  Trash2,
  Edit,
  FileText,
  Server,
  MapPin,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";
import useAudits from "@/hooks/useAudits";

const AuditLogTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = ["Today", "This Week", "This Month", "This Year"];

  // No local mock data — rely on the backend via `useAudits`.

  // Use React Query hook to fetch audits
  const { data: auditsData, isLoading: loading, error, refetch } = useAudits();

  // Normalise service response to an array of audits
  const audits =
    (auditsData && (auditsData.data || auditsData.audits || auditsData)) || [];

  // Format audit row
  const formatAuditRow = (audit) => {
    const date = new Date(audit.created_at || audit.timestamp || audit.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      userName: audit.user_name || audit.user?.name || "Unknown User",
      role: audit.user_role || audit.role || "N/A",
      client: audit.client_name || audit.client || "N/A",
      action: audit.action || "Unknown",
      environment: audit.environment || "N/A",
      ip: audit.ip_address || audit.ip || "N/A",
      date: formattedDate,
      time: formattedTime,
      isDelete: audit.action?.toLowerCase().includes("delete"),
      isUpdate: audit.action?.toLowerCase().includes("update"),
    };
  };

  const formattedRows = audits.map(formatAuditRow);

  return (
    <div className="w-full overflow-y-auto poppins-text px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audits</h1>

        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>

          {/* Period Dropdown */}
          <div className="relative w-fit">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 text-sm font-medium">
                {selectedPeriod}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-[246px] bg-white shadow-md rounded-lg flex flex-col px-3 py-5 z-30">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left h-8 px-2 py-1 border-b border-black/20 font-medium text-[16px] leading-6 font-[Manrope]
                      ${
                        selectedPeriod === period
                          ? "bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded"
                          : "text-black hover:bg-gray-100"
                      }
                    `}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-12 w-12 text-purple-600"
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
            <span className="text-gray-600 text-lg">Loading audits...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-6 mb-6 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="mb-2">
            ⚠️ {error?.response?.data?.message || String(error)}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto w-full">
          <div className="min-w-3xl">
            {/* Table Header */}
            <div className="sticky top-0 z-10 bg-linear-to-b from-purple-200 to-red-200 border-b border-black/20 rounded-t-lg h-16 flex items-center px-4 md:px-6 text-xs sm:text-sm md:text-base text-[#00000099]">
              <div className="flex-[1.2] font-semibold min-w-[120px]">
                User Name
              </div>
              <div className="flex-1 font-semibold min-w-[140px]">Client</div>
              <div className="flex-1 font-semibold min-w-[120px]">Action</div>
              <div className="flex-1 font-semibold min-w-[140px]">
                Environment
              </div>
              <div className="flex-1 font-semibold min-w-[140px]">
                IP Address
              </div>
              <div className="flex-1 text-right font-semibold min-w-40">
                Time Stamp
              </div>
            </div>

            {/* Table Rows */}
            {formattedRows.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white border border-gray-200">
                No audit logs found.
              </div>
            ) : (
              formattedRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-4 md:px-6 border-b border-gray-200 h-20 text-xs sm:text-sm md:text-base bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-[1.2] min-w-[120px]">
                    <div className="font-semibold truncate">{row.userName}</div>
                    <div className="text-xs text-gray-600">{row.role}</div>
                  </div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate">
                    {row.client}
                  </div>
                  <div
                    className={`flex-1 font-semibold min-w-[120px] flex items-center gap-3 ${
                      row.isUpdate
                        ? "text-green-500"
                        : row.isDelete
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="flex items-center">
                      {row.isUpdate ? (
                        <Edit className="w-4 h-4" />
                      ) : row.isDelete ? (
                        <Trash2 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </span>
                    <span className="truncate">{row.action}</span>
                  </div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{row.environment}</span>
                  </div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{row.ip}</span>
                  </div>
                  <div className="flex-1 text-right min-w-40">
                    <div
                      className={`font-semibold flex items-center justify-end gap-2 ${
                        row.isDelete ? "text-red-500" : "text-black"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{row.date}</span>
                    </div>
                    <div
                      className={`font-semibold flex items-center justify-end gap-2 ${
                        row.isDelete ? "text-red-500" : "text-black"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>{row.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AuditLogTableWithLayout = withAdminLayout(AuditLogTable);

export default AuditLogTableWithLayout;
