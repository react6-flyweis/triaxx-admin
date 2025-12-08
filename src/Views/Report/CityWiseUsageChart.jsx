import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useRestaurantByChartByCity } from "@/hooks/useReports";

const CityWiseUsageChart = ({ reportData = {} }) => {
  // Try to read city usage data from API response; fall back to sample data
  // Report prop can contain older report shapes (cityWiseUsage)
  const apiDataFromProp =
    reportData?.reports?.cityWiseUsage || reportData?.reports?.CityWiseUsage;

  // Prefer live API via react-query hook when available
  const { data: apiHookDataRaw } = useRestaurantByChartByCity();

  // Normalize API shape to expected format: either [{ city, low, good }] OR
  // new endpoint shape: { chart: [{ City, RestaurantCount }] }
  // NOTE: Removed mock/sample data — component now shows real API/prop data only.
  let data = [];

  // If parent provided prop-shaped data use it
  if (Array.isArray(apiDataFromProp) && apiDataFromProp.length > 0) {
    data = apiDataFromProp.map((d) => ({
      city: d.city || d.name || d.label || "-",
      low: Number(d.low ?? d.lowConsumption ?? d.low_value ?? 0),
      good: Number(d.good ?? d.goodConsumption ?? d.good_value ?? 0),
    }));
  }

  // If we have hook API data, normalize it to single-bar format: [{ city, count }]
  const apiHookData = apiHookDataRaw ?? apiDataFromProp;
  const apiChart = apiHookData?.chart ?? apiHookData?.data?.chart ?? null;
  const isApiChart = Array.isArray(apiChart) && apiChart.length > 0;
  if (isApiChart) {
    data = apiChart.map((d) => ({
      city: d.City || d.city || "-",
      count: Number(d.RestaurantCount ?? d.count ?? 0),
    }));
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">City Wise Usage (Report)</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-amber-400 inline-block" />
            <span>Low consumption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-600 inline-block" />
            <span>Good consumption</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-gray-500">
          No data available
        </div>
      ) : (
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              {/* <Legend verticalAlign="top" align="right" /> */}
              {isApiChart ? (
                <Bar
                  dataKey="count"
                  name="Restaurants"
                  fill="#2563eb"
                  barSize={14}
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList dataKey="count" position="top" />
                </Bar>
              ) : (
                <>
                  <Bar
                    dataKey="low"
                    name="Low consumption"
                    fill="#f59e0b"
                    barSize={10}
                    radius={[6, 6, 0, 0]}
                  >
                    <LabelList dataKey="low" position="top" />
                  </Bar>
                  <Bar
                    dataKey="good"
                    name="Good consumption"
                    fill="#2563eb"
                    barSize={10}
                    radius={[6, 6, 0, 0]}
                  >
                    <LabelList dataKey="good" position="top" />
                  </Bar>
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CityWiseUsageChart;
