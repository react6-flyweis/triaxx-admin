import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { Users, RotateCcw } from "lucide-react";

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={6}
      fill="#FFFFFF"
      stroke={props.stroke}
      strokeWidth={3}
    />
  );
};

export default function MonthlyGrowthChart({ monthlyData } = {}) {
  // monthlyData expected as array of { NewclientCount, CleintsRenewalsCount } for 12 months
  console.log("MonthlyGrowthChart monthlyData:", monthlyData);
  const data =
    monthlyData && Array.isArray(monthlyData) && monthlyData.length
      ? monthlyData.map((d, i) => {
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return {
            month: months[i] ?? `M${i + 1}`,
            newClients: Number(d?.NewclientCount || 0),
            renewals: Number(d?.CleintsRenewalsCount || 0),
          };
        })
      : [];

  return (
    <div className="w-full ">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <h2 className="poppins-text  text-2xl font-bold text-black mb-4 mt-8">
          Monthly Growth
        </h2>

        {/* Chart Container */}
        <div
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{
            boxShadow:
              "0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 1px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Legend */}
          <div className="flex justify-end gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-b from-purple-600 to-red-500 rounded-sm opacity-40"></div>
              <span className="text-sm font-medium text-black font-['Poppins']">
                New Clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-b from-purple-700 to-red-600 rounded-sm"></div>
              <span className="text-sm font-medium text-black font-['Poppins']">
                Clients Renewals
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No monthly growth data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 14,
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fill: "#000000",
                    }}
                  />
                  <YAxis
                    domain={[0, 500]}
                    ticks={[0, 100, 250, 500]}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 14,
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fill: "#000000",
                      textAnchor: "end",
                    }}
                  />

                  {/* Grid lines */}
                  <defs>
                    <pattern
                      id="grid"
                      width="100%"
                      height="1"
                      patternUnits="userSpaceOnUse"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                        stroke="rgba(0, 0, 0, 0.1)"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>

                  <Line
                    type="monotone"
                    dataKey="newClients"
                    stroke="url(#newClientsGradient)"
                    strokeWidth={3}
                    dot={<CustomDot />}
                  />
                  <Line
                    type="monotone"
                    dataKey="renewals"
                    stroke="url(#renewalsGradient)"
                    strokeWidth={3}
                    dot={<CustomDot />}
                  />

                  <defs>
                    <linearGradient
                      id="newClientsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(106, 27, 154, 0.4)" />
                      <stop offset="100%" stopColor="rgba(211, 47, 47, 0.4)" />
                    </linearGradient>
                    <linearGradient
                      id="renewalsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6A1B9A" />
                      <stop offset="100%" stopColor="#D32F2F" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom Message */}
        </div>
      </div>
    </div>
  );
}
