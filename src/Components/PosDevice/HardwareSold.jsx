import React from "react";
import { useNavigate } from "react-router-dom";

function HardwareSold({ soldDetails = [], loading = false }) {
  const navigate = useNavigate();

  const items = Array.isArray(soldDetails) ? soldDetails : [];

  const renderRows = () => {
    if (loading) {
      // Render 3 skeleton rows while loading
      return [0, 1, 2].map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className={`flex items-center h-[53px] px-6 bg-white border-x border-b border-[#00000033] border-opacity-20 text-sm ${
            idx === 2 ? "rounded-b-2xl" : ""
          }`}
        >
          <div className="w-[5%] min-w-[40px]">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-[25%] min-w-[140px] truncate">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="w-[25%] min-w-[160px] text-center truncate">
            <div className="h-4 bg-gray-200 rounded w-28 mx-auto animate-pulse" />
          </div>
          <div className="w-[25%] min-w-[140px]">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <div className="w-[20%] min-w-[100px]">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
      ));
    }

    if (items.length === 0) {
      return (
        <div className="flex items-center h-[53px] px-6 bg-white border-x border-b border-[#00000033] border-opacity-20 text-sm rounded-b-2xl">
          <div className="w-full text-center text-sm text-[#6B7280]">
            No hardware sold data available.
          </div>
        </div>
      );
    }

    return items.map((item, index) => {
      const id = item.Id || item.id || String(index + 1).padStart(2, "0");
      const businessName =
        item.BusinessName ||
        item.businessName ||
        item.Business ||
        item.Name ||
        "—";
      const planPurchased =
        item.PlanPurchased ||
        item.planPurchased ||
        item.PlanName ||
        item.plan ||
        "—";
      const purchasedDate =
        item.PurchasedDate ||
        item.purchasedDate ||
        item.PurchaseDate ||
        item.date ||
        "—";
      const device =
        item.Device || item.device || item.Hardware || item.DeviceType || "—";

      return (
        <div
          key={id + "-" + index}
          className={`flex items-center h-[53px] px-6 bg-white border-x border-b border-[#00000033] border-opacity-20 text-sm ${
            index === items.length - 1 ? "rounded-b-2xl" : ""
          }`}
        >
          <span className="w-[5%] min-w-[40px]">{id}</span>
          <span className="w-[25%] min-w-[140px] truncate">{businessName}</span>
          <span className="w-[25%] min-w-[160px] text-center truncate">
            {planPurchased}
          </span>
          <span className="w-[25%] min-w-[140px]">{purchasedDate}</span>
          <span className="w-[20%] min-w-[100px] font-bold text-green-500">
            {device}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-start w-full font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4 px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-black">
          Hardware Sold
        </h2>
        <button
          onClick={() => navigate("/pos-device-history")}
          className="text-sm sm:text-base font-semibold text-black hover:underline"
        >
          See all
        </button>
      </div>

      {/* Scrollable Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl">
        <div className="min-w-[720px]">
          {/* Table Header */}
          <div className="flex items-center h-[51px] px-6 bg-gradient-to-b from-purple-100 to-red-100 text-[#00000099] font-semibold text-sm border-opacity-20 rounded-t-2xl">
            <span className="w-[5%] min-w-[40px]">#</span>
            <span className="w-[25%] min-w-[140px]">Business Name</span>
            <span className="w-[25%] min-w-[160px] text-center">
              Plan Purchased
            </span>
            <span className="w-[25%] min-w-[140px]">Purchased Date</span>
            <span className="w-[20%] min-w-[100px]">Device</span>
          </div>

          {/* Table Rows */}
          {renderRows()}
        </div>
      </div>
    </div>
  );
}

export default HardwareSold;
