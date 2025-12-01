import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  bgColor = "bg-gray-100",
  valueColor = "text-gray-900",
  trend,
  subtext,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}
      >
        {Icon ? <Icon className="h-7 w-7 text-gray-700" /> : null}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p
          className={`text-3xl font-bold ${valueColor || "text-gray-900"} mb-1`}
        >
          {value}
        </p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 mt-2 text-sm ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;
