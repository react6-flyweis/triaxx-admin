import React from "react";
import { useNavigate } from "react-router-dom";

const TopPerformers = ({ performers } = {}) => {
  const navigate = useNavigate();
  const performersData =
    performers && Array.isArray(performers) && performers.length
      ? performers.map((p, idx) => ({
          id: String(idx + 1).padStart(2, "0"),
          company: p?.CompnayName || p?.company || "Unknown",
          sales: `${Number(p?.TotalSales || 0).toLocaleString()} XOF`,
          renewalDate: p?.RenewalDate
            ? new Date(p.RenewalDate).toLocaleDateString()
            : "-",
        }))
      : [];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-black">
          Top Performers
        </h2>
        <button
          onClick={() => navigate("/top-performers-list")}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          See all
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 md:grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
            <div>#</div>
            <div className="col-span-2">Company Name</div>
            <div className="text-center">Total Sales</div>
            <div className="hidden md:block text-center">Renewal Date</div>
          </div>

          {/* Table Rows */}
          {performersData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No top performers data available
            </div>
          ) : (
            performersData.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 md:grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                  index === performersData.length - 1 ? "rounded-b-2xl" : ""
                }`}
              >
                <div>{item.id}</div>
                <div className="col-span-2">{item.company}</div>
                <div className="text-center text-green-500">{item.sales}</div>
                <div className="hidden md:block text-center text-red-500">
                  {item.renewalDate}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;
