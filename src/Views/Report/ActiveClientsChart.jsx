import { ArrowDown, ArrowUp } from "lucide-react";
import DonutChart from "../../Components/ui/DonutChart";
import { useState } from "react";

const ActiveClientsChart = ({ reportData = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const periodOptions = [
    { id: "week", label: "1W" },
    { id: "month", label: "1M" },
    { id: "halfYear", label: "6M" },
    { id: "year", label: "1Y" },
  ];

  // Extract data from raw API response using selectedPeriod directly as the chart key
  //   const reports = reportData?.reports || {};
  const chart = reportData?.Chart || {};
  const activeChart = chart?.active?.[selectedPeriod] || {};

  //   const activeCount = Number(reports.TotalActiverestaurant ?? 0);
  const newClients = Number(activeChart.newClients ?? 0);
  const renewedClients = Number(activeChart.renewedClients ?? 0);
  const activeTotalClients = newClients + renewedClients;

  // Calculate percentages - if no data, show 50/50 to display the chart structure
  let renewedPercent, newPercent;
  if (activeTotalClients === 0) {
    renewedPercent = 0;
    newPercent = 0;
  } else {
    newPercent = Math.round((newClients / activeTotalClients) * 100);
    renewedPercent = 100 - newPercent;
  }

  const trend = Number(activeChart.percentageChange ?? 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with title and period selector */}
      <div className="w-full flex items-center justify-between mb-6">
        <h4 className="text-xl font-bold text-gray-900">
          Active Clients (Report)
        </h4>
        <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
          {periodOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedPeriod(p.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedPeriod === p.id
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area with count/trend on left, chart on right */}
      <div className="flex items-center justify-between">
        {/* Left side: Count, trend, and legend */}
        <div className="flex flex-col items-start space-y-6">
          {/* Large count */}
          <div>
            <h2 className="text-5xl font-bold text-green-600">
              {activeTotalClients} Active
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {trend < 0 ? (
                <ArrowDown className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowUp className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm text-gray-600">
                {Math.abs(trend)}%{" "}
                {trend < 0 ? "Less" : trend > 0 ? "More" : "Same"} than last
                period
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-600 rounded-sm inline-block" />
              <span className="text-base font-medium text-gray-900">
                New Clients ({newClients})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-300 rounded-sm inline-block" />
              <span className="text-base font-medium text-gray-900">
                Renewed Clients ({renewedClients})
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Donut chart with percentage label */}
        <div className="relative flex flex-col items-center">
          {activeTotalClients > 0 ? (
            <>
              <div className="text-lg font-semibold text-gray-500 mb-2">
                New: {newPercent}%
              </div>
              <DonutChart
                newPercent={newPercent}
                renewedPercent={renewedPercent}
                size={200}
                stroke={24}
              />
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="text-2xl font-bold text-green-600">
                  <div>{newPercent}%</div>
                  <div className="text-sm text-gray-400">New</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveClientsChart;
