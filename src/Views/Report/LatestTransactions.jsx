import React from "react";
import { useTransactionChart } from "@/hooks/useTransactionChart";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d || "-";
  }
};

const normalizeTransactions = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.success && response.data)
    return Array.isArray(response.data) ? response.data : [];
  if (response.transactions && Array.isArray(response.transactions))
    return response.transactions;
  if (response.data && Array.isArray(response.data.transactions))
    return response.data.transactions;
  return [];
};

const TransactionsTable = ({ transactions, isLoading, isError, error }) => {
  const items = normalizeTransactions(transactions);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] w-full">
        <div className="grid grid-cols-4 md:grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
          <div>#</div>
          <div className="col-span-2">Business Name</div>
          <div className="text-center">Total Sales</div>
          <div className="hidden md:block text-center">Renewal Date</div>
        </div>

        {isLoading ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-400">
            Loading...
          </div>
        ) : isError ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-red-500">
            {error?.message || "Failed to load transactions"}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-500">
            No data found
          </div>
        ) : (
          items.map((t, idx) => (
            <div
              key={t.id ?? idx}
              className={`grid grid-cols-4 md:grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                idx === items.length - 1 ? "rounded-b-2xl" : ""
              }`}
            >
              <div className="text-gray-600">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="col-span-2 font-medium">
                {t.company || t.name || "—"}
              </div>
              <div className="text-center text-gray-700">
                {t.total || t.amount || "#0"}
              </div>
              <div className="hidden md:block text-center text-gray-600">
                {formatDate(t.renewalDate || t.date)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Donut = ({ percent = 50, size = 200 }) => {
  // track (background) is thinner, progress arc is thicker
  const progressStroke = Math.max(10, Math.round(size * 0.1));
  const trackStroke = Math.max(6, Math.round(size * 0.06));

  // radius is calculated to fit the thicker progress stroke
  const radius = (size - progressStroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // portion of the full circle used for the arc (image uses ~72%)
  const arcFraction = 0.72;
  const arcLength = circumference * arcFraction;

  // dash arrays: we draw only the arc segment (progress and track)
  const trackDash = `${arcLength} ${circumference - arcLength}`;
  const progressDashLength = (percent / 100) * arcLength;
  const progressDash = `${progressDashLength} ${
    circumference - progressDashLength
  }`;

  const gradId = React.useMemo(
    () => `txGrad-${Math.random().toString(36).slice(2)}`,
    []
  );

  // rotate so the arc starts around 10 o'clock like the design
  const rotateDeg = -210;

  return (
    <svg
      width={size}
      height={size}
      className="mx-auto"
      viewBox={`0 0 ${size} ${size}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <g transform={`translate(${size / 2},${size / 2})`}>
        {/* background track (partial arc) */}
        <circle
          r={radius}
          stroke="#eef2f7"
          strokeWidth={trackStroke}
          fill="none"
          strokeDasharray={trackDash}
          transform={`rotate(${rotateDeg})`}
        />

        {/* progress arc (thicker, rounded) */}
        <circle
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={progressStroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={progressDash}
          transform={`rotate(${rotateDeg})`}
        />

        {/* center icon */}
        <g transform="translate(0,-30)">
          <circle r={28} fill="#fff" />
          <circle r={20} fill="#afafaf" />
          <g transform="translate(0, -2)" fill="#fff">
            <circle r={6} />
            <rect x={-6} y={8} width={12} height={6} rx={3} />
          </g>
        </g>

        {/* percent text */}
        <text
          x="0"
          y={size * 0.12}
          textAnchor="middle"
          className="font-extrabold"
          style={{ fontSize: Math.round(size * 0.12) }}
        >
          {percent}%
        </text>
      </g>
    </svg>
  );
};

const LatestTransactions = () => {
  const { data, isLoading, isError, error } = useTransactionChart();

  // backend returns { success, message, Chart: { month, lastMonth, percentageChange } }
  const chart = data?.Chart || data || {};

  const stats = React.useMemo(() => {
    const month = chart?.month ?? 0;
    const lastMonth = chart?.lastMonth ?? 0;
    const change = chart?.percentageChange ?? 0;
    return {
      totalFormatted:
        typeof month === "number"
          ? month.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : String(month),
      changePercent: change,
      percent: Math.round(change),
      lastMonth,
    };
  }, [chart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Latest Transactions</h3>
          </div>
          <button className="text-sm text-blue-600">See all</button>
        </div>

        <TransactionsTable />
      </div>

      <div>
        <div className="flex mb-4">
          <h3 className="text-lg font-bold mr-1">Latest Transactions</h3>
          <span>(Reports)</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col ">
          <h4 className="text-md font-semibold mb-2">Total Transactions</h4>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
              <div className="text-sm text-gray-500">Loading chart...</div>
            </div>
          ) : isError ? (
            <div className="text-red-500 text-sm py-6 text-center">
              Failed to load chart: {error?.message || "Unknown error"}
            </div>
          ) : (
            <>
              <div className="text-3xl font-extrabold  mb-2">
                {stats?.totalFormatted || "0"} XOF
              </div>
              <div className="text-sm text-gray-500 mb-4 text-center">
                You have Spent{" "}
                <span className="text-green-500">
                  {stats?.changePercent ?? 32}%
                </span>{" "}
                Lesser than Last Month
              </div>

              <Donut percent={stats?.percent ?? 50} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestTransactions;
