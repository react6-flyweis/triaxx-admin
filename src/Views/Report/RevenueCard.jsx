const defaultBars = [8, 60, 12, 78, 62, 70, 45, 75, 18, 56, 64, 58];
const defaultMonths = [
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

const formatAmount = (amt) => {
  if (amt == null) return "-";
  try {
    if (typeof amt === "number") return amt.toLocaleString();
    // allow string numbers
    const n = Number(String(amt).replace(/[^0-9.-]+/g, ""));
    return isNaN(n) ? String(amt) : n.toLocaleString();
  } catch {
    return String(amt);
  }
};

const RevenueCard = ({
  total = "9 137 XOF",
  changePercent = 12,
  bars = defaultBars,
  months = defaultMonths,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="text-3xl font-bold text-blue-600">{total}</div>
      <div className="text-sm text-green-500 mt-2">
        ↑ {changePercent}% Sold more than Last Month
      </div>

      <div className="mt-6 h-40">
        <div className="flex items-end h-full space-x-2">
          {bars.map((h, i) => (
            <div
              key={i}
              className="bg-blue-600 rounded-sm"
              style={{ width: 18, height: `${h}%` }}
            />
          ))}
        </div>

        <div className="flex justify-between text-xs mt-3 text-gray-500">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
