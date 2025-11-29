import React from "react";

/**
 * A summary/stat card used across the app (Supports page and dashboard metrics).
 * Updated to support passing a React icon node, larger sizes and rounded look matching the design.
 */
const TicketSummaryCard = ({
  title,
  count,
  iconBgColor = "bg-gray-100",
  textColor = "text-gray-900",
  icon = null,
}) => {
  return (
    <div className="w-full shadow-lg rounded-3xl bg-white p-4 hover:shadow-xl transition-shadow duration-200 border border-black/10">
      <div className="flex items-center gap-6">
        {/* Icon Container */}
        <div
          className={`size-16 rounded-full flex items-center justify-center shrink-0 ${iconBgColor}`}
        >
          {icon}
        </div>

        {/* Content Container */}
        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
          <p className="text-gray-600 font-medium text-sm sm:text-base leading-tight font-['Poppins']">
            {title}
          </p>
          <h2
            className={`font-extrabold text-2xl  ${textColor} leading-tight mt-1 font-['Poppins']`}
          >
            {count}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default TicketSummaryCard;
