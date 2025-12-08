import React from "react";
import RestaurantPerformanceChart from "./RestaurantPerformanceChart";
import Loading from "../ui/Loading";
import { useRestaurantPerformance } from "../../hooks/useRestaurantPerformance";
import mooeny from "../../assets/Images/admin/client/money.png";
import bill from "../../assets/Images/admin/client/bill.png";
import global from "../../assets/Images/admin/client/global-user.png";

const Performance = ({ clientId }) => {
  // NOTE: We'll conditionally read results below
  const {
    data: performanceDataRaw,
    isLoading,
    isError,
    error,
  } = useRestaurantPerformance(clientId, {
    enabled: Boolean(clientId),
  });
  // hook now returns the inner API `data` object (or the raw response as a fallback)
  const performanceData = performanceDataRaw || {};
  // Normalize API fields to the keys the UI expects and format chart data
  const metrics = {
    totalSales:
      performanceData?.TotalSalesCount ?? performanceData?.TotalSales ?? 0,
    totalOrders:
      performanceData?.TotalOrdersCount ??
      performanceData?.TotalOrderCount ??
      0,
    totalActiveClients: performanceData?.TotalActiveClientsCount ?? 0,
    newCustomers:
      performanceData?.NewCustomersCount ??
      performanceData?.getNewCustomers ??
      0,
    repeatCustomers:
      performanceData?.RepeatCustomersCount ??
      performanceData?.getRepeatCustomers ??
      0,
    avgOrderValue:
      performanceData?.AvgOrderValueCount ??
      performanceData?.getAvgOrderValue ??
      0,
  };

  const parseCurrencyString = (val) => {
    if (val === null || typeof val === "undefined") return 0;
    if (typeof val === "number") return val;
    // remove any non-numeric (except . and -) characters
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Chart data could be returned as an array of objects like { xof: '500.00 xof', time: '10.30' }
  // Map them into { time, value } where value is numeric
  const formattedChartData = (performanceData?.Chart || []).map((item) => ({
    time: item?.time || item?.label || "",
    value: parseCurrencyString(item?.xof ?? item?.value ?? item?.y ?? 0),
  }));

  const MetricCard = ({ imageSrc, title, value, bgColor }) => (
    <div className="bg-white rounded-3xl p-6 shadow-md flex items-center gap-4 w-full">
      <div
        className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}
      >
        <img src={imageSrc} alt={title} className="w-8 h-8 object-contain" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600 font-medium text-sm sm:text-base">
          {title}
        </p>
        <p className="text-gray-900 font-bold text-xl sm:text-2xl">{value}</p>
      </div>
    </div>
  );

  const formatNumber = (value) => {
    if (value === null || typeof value === "undefined") return "0";
    if (typeof value === "number") return value.toLocaleString();
    if (typeof value === "string" && value.trim() !== "") return value;
    return String(value || "0");
  };

  // Import hook here to prevent top-level circular issues if any
  // But we actually import at module scope below
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="py-12 px-4">
        <p className="text-sm text-red-600">
          {error?.message || "Failed to load performance"}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-6 sm:py-10 font-[Poppins]">
      <div className="flex flex-col gap-10">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            imageSrc={mooeny}
            title="Total Sales"
            value={formatNumber(metrics.totalSales)}
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Total Orders"
            value={formatNumber(metrics.totalOrders)}
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Total Active Clients"
            value={formatNumber(metrics.totalActiveClients)}
            bgColor="bg-green-200"
          />
          <MetricCard
            imageSrc={mooeny}
            title="New Customers"
            value={formatNumber(metrics.newCustomers)}
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Repeat Customers"
            value={formatNumber(metrics.repeatCustomers)}
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Avg Order Value"
            value={formatNumber(metrics.avgOrderValue)}
            bgColor="bg-green-200"
          />
        </div>

        {/* Chart Section */}
        <RestaurantPerformanceChart chartData={formattedChartData} />
      </div>
    </div>
  );
};

export default Performance;
