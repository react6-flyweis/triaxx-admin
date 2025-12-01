import React from "react";

const DonutChart = ({
  newPercent = 30,
  renewedPercent = 70,
  size = 96,
  stroke = 10,
  className = "",
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // New clients segment (dark green) - starts at top
  const newOffset = 0;
  const newDash = (newPercent / 100) * circumference;

  // Renewed clients segment (light green) - follows new clients
  const renewedOffset = -newDash;
  const renewedDash = (renewedPercent / 100) * circumference;

  const centerTextStyle = {
    fontSize: Math.round(size / 5),
    fontWeight: 700,
    fill: "#86efac",
    textAnchor: "middle",
    dominantBaseline: "central",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* Background circle */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#f3f4f6"
          strokeWidth={stroke}
        />

        {/* Renewed clients (light green) - larger segment */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#86efac"
          strokeWidth={stroke}
          strokeDasharray={`${renewedDash} ${circumference}`}
          strokeDashoffset={renewedOffset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />

        {/* New clients (dark green) - smaller segment */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeDasharray={`${newDash} ${circumference}`}
          strokeDashoffset={newOffset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />

        <text x="0" y="0" style={centerTextStyle}>{`${renewedPercent}%`}</text>
      </g>
    </svg>
  );
};

export default DonutChart;
