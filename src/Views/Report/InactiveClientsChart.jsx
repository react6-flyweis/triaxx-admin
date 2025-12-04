import { ArrowDown, ArrowUp } from "lucide-react";
import RedDonutChart from "../../Components/ui/RedDonutChart";
import { useState } from "react";

const InactiveClientsChart = ({ reportData = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const periodOptions = [
    { id: "week", label: "1W" },
    { id: "month", label: "1M" },
    { id: "halfYear", label: "6M" },
    { id: "year", label: "1Y" },
  ];

  const chart = reportData?.Chart || {};
  const inactiveChart = chart?.inactive?.[selectedPeriod] || {};

  const inactiveCount = Number(inactiveChart.inactiveClients ?? 0);

  const trend = Number(inactiveChart.percentageChange ?? 0);

  const selectedLabel =
    periodOptions.find((p) => p.id === selectedPeriod)?.label || selectedPeriod;

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="w-full flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-red-600">
            {inactiveCount} Inactive
          </h2>
          <div className="flex items-center gap-2">
            {trend < 0 ? (
              <ArrowDown className="h-4 w-4 text-red-600" />
            ) : (
              <ArrowUp className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm text-gray-600">
              {Math.abs(trend)}%{" "}
              {trend < 0 ? "Less" : trend > 0 ? "More" : "Same"} than last
              period
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 rounded-l-full p-1 absolute top-5 right-0">
          {periodOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedPeriod(p.id);
              }}
              className={`px-2 rounded-full text-xs font-semibold transition-colors ${
                selectedPeriod === p.id
                  ? " text-black"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-5 bg-red-600 inline-block" />
              {selectedLabel}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          {inactiveCount > 0 ? (
            <RedDonutChart
              size={150}
              stroke={28}
              centerLabel={selectedLabel}
              centerValue={inactiveCount}
            />
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

export default InactiveClientsChart;
