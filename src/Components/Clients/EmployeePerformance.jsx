import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EmployeePerformance = ({ employee }) => {
  const constTipsEarned = employee?.Performance?.tips_earned ?? 6092;
  const constTipsTarget = employee?.Performance?.tips_target ?? 12000;

  const gaugeData = useMemo(() => {
    const remainingTips = Math.max(0, constTipsTarget - constTipsEarned);
    return {
      labels: ["earned", "remaining"],
      datasets: [
        {
          data: [constTipsEarned, remainingTips],
          backgroundColor: ["#8B3A9C", "#1a1a1a"],
          borderColor: ["#8B3A9C", "#1a1a1a"],
          borderWidth: 8,
          cutout: "75%",
          spacing: 0,
        },
      ],
    };
  }, [constTipsEarned, constTipsTarget]);

  return (
    <div className="mt-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales Contributed */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 font-medium">
              Total Sales Contributed
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {employee?.Performance?.total_sales || 999}
            </div>
          </div>
        </div>

        {/* Total Orders Taken */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 font-medium">
              Total Orders Taken
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {employee?.Performance?.total_orders || 999}
            </div>
          </div>
        </div>

        {/* Total Tables Served */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 font-medium">
              Total Tables Served
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {employee?.Performance?.total_tables || 999}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Avg Working hrs
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm font-medium text-gray-700">
                  serving
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-sm font-medium text-gray-700">
                  helping
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-5">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    employee?.Performance?.avg_working_hours || [
                      { name: "Sat", serving: 10, helping: 3 },
                      { name: "Sun", serving: 10, helping: 2 },
                      { name: "Mon", serving: 10, helping: 5 },
                      { name: "Tue", serving: 10, helping: 7 },
                      { name: "Wed", serving: 10, helping: 4 },
                      { name: "Thu", serving: 10, helping: 4 },
                      { name: "Fri", serving: 10, helping: 6 },
                    ]
                  }
                  barGap={4}
                  barCategoryGap="20%"
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#000", fontSize: 14, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#000", fontSize: 14, fontWeight: 600 }}
                    ticks={[0, 1, 3, 5, 7, 10]}
                    domain={[0, 10]}
                    dx={-5}
                    label={{
                      value: "hours",
                      angle: 0,
                      position: "top",
                      offset: 20,
                      style: {
                        fill: "#000",
                        fontSize: 14,
                        fontWeight: 600,
                        textAnchor: "start",
                      },
                    }}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  />
                  <Bar
                    dataKey="serving"
                    fill="#2563EB"
                    radius={[20, 20, 20, 20]}
                    barSize={24}
                  />
                  <Bar
                    dataKey="helping"
                    fill="#22D3EE"
                    radius={[20, 20, 20, 20]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Total Tips Earned</h3>
          <div className="flex-1 flex flex-col items-center justify-center pt-4">
            <div className="text-xs text-gray-500 mb-2">
              Average tip per order is 20-30 XOF
            </div>
            <div className="w-56 h-32 relative">
              <Doughnut
                data={gaugeData}
                options={{
                  rotation: 270,
                  circumference: 180,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    datalabels: { display: false },
                  },
                }}
              />
              {/* Center text */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                <div className="text-3xl font-bold text-[#6A1B9A]">
                  {constTipsEarned.toLocaleString("en-US")} XOF
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              Earner {constTipsEarned.toLocaleString("en-US")} XOF as tip in
              last 30 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;
