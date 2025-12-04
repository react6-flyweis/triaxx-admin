const RedDonutChart = ({
  primaryPercent = 100,
  secondaryPercent = 0,
  size = 96,
  stroke = 12,
  className = "",
  centerLabel = "",
  centerValue = null,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const primaryDash = (primaryPercent / 100) * circumference;
  const secondaryOffset = -primaryDash;
  const secondaryDash = (secondaryPercent / 100) * circumference;

  //   const startAngle = -90;
  //   const primarySweep = (primaryPercent / 100) * 360;
  //   const secondarySweep = (secondaryPercent / 100) * 360;
  const showSecondary = secondaryPercent > 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* Background ring */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#f3f4f6"
          strokeWidth={stroke}
        />

        {showSecondary ? (
          <>
            {/* secondary (lighter red) */}
            <circle
              r={radius}
              fill="transparent"
              stroke="#fca5a5"
              strokeWidth={stroke}
              strokeDasharray={`${secondaryDash} ${circumference}`}
              strokeDashoffset={secondaryOffset}
              strokeLinecap="round"
              transform="rotate(-90)"
            />

            {/* primary (darker red) */}
            <circle
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={stroke}
              strokeDasharray={`${primaryDash} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(-90)"
            />
          </>
        ) : (
          // Single-value: draw primary arc on top of background using primary color
          <circle
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={stroke}
            strokeDasharray={`${primaryDash} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        )}

        {/* Center label / value */}
        <g>
          <circle r={radius - stroke * 1.1} fill="#ffffff" />
          {centerValue !== null ? (
            <text
              x={0}
              y={-6}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(12, Math.round(size * 0.15))}
              fill="#111827"
              style={{ pointerEvents: "none", fontWeight: 700 }}
            >
              {String(centerValue)}
            </text>
          ) : (
            <text
              x={0}
              y={-6}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(12, Math.round(size * 0.12))}
              fill="#111827"
              style={{ pointerEvents: "none", fontWeight: 700 }}
            >
              {`${Math.round(primaryPercent)}%`}
            </text>
          )}

          {centerLabel && (
            <text
              x={0}
              y={12}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(10, Math.round(size * 0.09))}
              fill="#6b7280"
              style={{ pointerEvents: "none" }}
            >
              {centerLabel}
            </text>
          )}
        </g>
      </g>
    </svg>
  );
};

export default RedDonutChart;
