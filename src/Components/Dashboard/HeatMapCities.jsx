import React, { useState } from "react";
import { useRestaurantSubscriptionCities } from "../../hooks/useRestaurantSubscriptionCities";

const ExactPieChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useRestaurantSubscriptionCities();

  // normalize API response: hook returns either the API wrapper or inner data
  const payload = rawData?.data ?? rawData ?? {};
  const apiChart = payload?.chart || [];

  const defaultColors = ["#525B7A", "#FF7A1A", "#2563EB", "#FF00FF", "#06B6D4"];

  // map incoming chart items into { name, value, color }
  const mapped = apiChart.length
    ? apiChart.map((it, i) => ({
        name: it.city || it.name || `City ${i + 1}`,
        value: Number(it.value ?? it.count ?? it.percentage ?? 0) || 0,
        color: it.color ?? defaultColors[i % defaultColors.length],
      }))
    : [
        // { name: 'Johannesburg', value: 30, color: '#525B7A' },
        // { name: 'Cairo', value: 15, color: '#FF7A1A' },
        // { name: 'Cape Town', value: 35, color: '#2563EB' },
        // { name: 'Nairobi', value: 20, color: '#FF00FF' },
      ];

  // compute startAngle/endAngle for slices when not provided
  const computeAngles = (items) => {
    const sum = items.reduce((s, it) => s + (it.value || 0), 0) || 1;
    let current = 0;
    return items.map((it) => {
      const portion = (it.value || 0) / sum;
      const startAngle = current;
      const endAngle = current + portion * 360;
      current = endAngle;
      return { ...it, startAngle, endAngle };
    });
  };

  const data = computeAngles(mapped);

  const createPath = (cx, cy, r, startAngle, endAngle, isHovered) => {
    const rad = isHovered ? r + 8 : r;
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + rad * Math.cos(start);
    const y1 = cy + rad * Math.sin(start);
    const x2 = cx + rad * Math.cos(end);
    const y2 = cy + rad * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${rad} ${rad} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (cx, cy, r, startAngle, endAngle) => {
    const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
    const tr = r * 0.6;
    return {
      x: cx + tr * Math.cos(midAngle),
      y: cy + tr * Math.sin(midAngle),
    };
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl p-4" style={{ width: 380, height: 368 }}>
        <h2 className="text-[18px] font-bold mb-2 px-3">
          Heat Map(<span className="font-bold">Cities</span>)
        </h2>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl p-4" style={{ width: 380, height: 368 }}>
        <h2 className="text-[18px] font-bold mb-2 px-3">
          Heat Map(<span className="font-bold">Cities</span>)
        </h2>
        <div className="text-red-600">
          Error: {error?.message || "Failed to load data"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl  p-4" style={{ width: 380, height: 368 }}>
      <h2 className="text-[18px] font-bold mb-2 px-3">
        Heat Map(<span className="font-bold">Cities</span>)
      </h2>
      <svg width="100%" height="300" viewBox="0 0 320 320">
        {data.map((slice, i) => {
          const cx = 160;
          const cy = 160;
          const r = 120;
          const isHovered = hoveredIndex === i;
          const textPos = getTextPosition(
            cx,
            cy,
            r,
            slice.startAngle,
            slice.endAngle
          );

          return (
            <g key={i}>
              <path
                d={createPath(
                  cx,
                  cy,
                  r,
                  slice.startAngle,
                  slice.endAngle,
                  isHovered
                )}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="6"
                style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={textPos.x}
                y={textPos.y - 8}
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="700"
              >
                {slice.value}%
              </text>
              <text
                x={textPos.x}
                y={textPos.y + 12}
                textAnchor="middle"
                fill="#fff"
                fontSize="13"
                fontWeight="600"
              >
                {slice.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ExactPieChart;
