import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTicketsChart } from "@/hooks/useTicketsChart";

const TicketsChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1Month");

  const periodOptions = [
    { id: "1Day", label: "1D" },
    { id: "1Month", label: "1M" },
    { id: "3Month", label: "3M" },
    { id: "4Month", label: "4M" },
    // { id: "1Year", label: "1Y" },
  ];

  const {
    data: ticketsResp,
    isLoading,
    error,
  } = useTicketsChart(selectedPeriod);

  // Response shape: { success, message, filter, data: { TicketsCharcount: [...] } }
  const series =
    ticketsResp?.data?.TicketsCharcount ?? ticketsResp?.TicketsCharcount ?? [];

  const total = series.reduce((s, item) => s + Number(item.count ?? 0), 0);

  // Transform data for area chart
  const chartData = series.map((item) => ({
    date: item.date || item.name || "N/A",
    tickets: Number(item.count ?? 0),
    status: item.status || "open",
  }));

  const trend = 0; // backend doesn't provide trend in this endpoint

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="w-full flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-green-600">{total} Tickets</h2>
          <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-1 bg-linear-to-b from-purple-900/10 to-red-600/10 rounded-l-full p-1 absolute top-5 right-0">
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

      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="h-3 w-5 bg-red-500 inline-block rounded" />
            <span className="text-sm text-gray-900">Open ({openTickets})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-5 bg-green-500 inline-block rounded" />
            <span className="text-sm text-gray-900">
              Resolved ({resolvedTickets})
            </span>
          </div>
        </div> */}

        <div className="w-full h-[220px] ">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              Error loading chart
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="ticketsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#34C759" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#34C759" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "600" }}
                />
                <Area
                  type="natural"
                  dataKey="tickets"
                  stroke="#34C759"
                  strokeWidth={3}
                  fill="url(#ticketsGradient)"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsChart;
