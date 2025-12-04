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

  // Compute angles for label placement (we rotate circles by -90 so 0% starts at top)
  const startAngle = -90;
  const newSweep = (newPercent / 100) * 360;
  const renewedSweep = (renewedPercent / 100) * 360;
  const newMid = startAngle + newSweep / 2;
  const renewedMid = startAngle + newSweep + renewedSweep / 2;

  const labelRadius = radius - stroke / 10; // position labels near the middle of the stroke
  const deg2rad = (d) => (d * Math.PI) / 180;
  const newLabelX = Math.cos(deg2rad(newMid)) * labelRadius;
  const newLabelY = Math.sin(deg2rad(newMid)) * labelRadius;
  const renewedLabelX = Math.cos(deg2rad(renewedMid)) * labelRadius;
  const renewedLabelY = Math.sin(deg2rad(renewedMid)) * labelRadius;

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
          stroke="#7bf1a8" //bg-green-300
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
          stroke="#00a63e" //bg-green-600
          strokeWidth={stroke}
          strokeDasharray={`${newDash} ${circumference}`}
          strokeDashoffset={newOffset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        {/* Percentage labels positioned along the arc midpoints */}
        <text
          x={newLabelX}
          y={newLabelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.max(10, Math.round(size * 0.1))}
          fill="#ffffff"
          style={{ pointerEvents: "none" }}
        >
          {`${Math.round(newPercent)}%`}
        </text>

        <text
          x={renewedLabelX}
          y={renewedLabelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.max(10, Math.round(size * 0.1))}
          fill="#05692f"
          style={{ pointerEvents: "none" }}
        >
          {`${Math.round(renewedPercent)}%`}
        </text>
      </g>
    </svg>
  );
};

export default DonutChart;
