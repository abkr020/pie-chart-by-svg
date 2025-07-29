import React from 'react';

type BarData = {
  label: string;
  value: number;
  color?: string;
};

type BarChartProps = {
  data: BarData[];
  width?: number;
  height?: number;
  gridLines?: number; // Optional number of Y-axis grid lines
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 500,
  height = 300,
  gridLines = 5,
}) => {
  const maxVal = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartHeight = height - margin.top - margin.bottom;
  const chartWidth = width - margin.left - margin.right;

  return (
    <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
      {/* Y-axis grid lines + labels */}
      {[...Array(gridLines)].map((_, i) => {
        const yVal = (maxVal / gridLines) * i;
        const yPos = height - margin.bottom - (yVal / maxVal) * chartHeight;

        return (
          <g key={i}>
            <line
              x1={margin.left}
              y1={yPos}
              x2={width - margin.right}
              y2={yPos}
              stroke="#ccc"
              strokeDasharray="4"
            />
            <text
              x={margin.left - 8}
              y={yPos + 4}
              fontSize={11}
              textAnchor="end"
              fill="#555"
            >
              {Math.round(yVal)}
            </text>
          </g>
        );
      })}

      {/* X and Y axis lines */}
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke="#000"
      />
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke="#000"
      />

      {/* Bars and labels */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxVal) * chartHeight;
        const x = margin.left + i * barWidth + 10;
        const y = height - margin.bottom - barHeight;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth - 20}
              height={barHeight}
              fill={d.color || 'steelblue'}
              rx={4}
            />
            {/* Value on top */}
            <text
              x={x + (barWidth - 20) / 2}
              y={y - 5}
              fontSize={11}
              textAnchor="middle"
              fill="#333"
            >
              {d.value}
            </text>
            {/* Label below X-axis */}
            <text
              x={x + (barWidth - 20) / 2}
              y={height - margin.bottom + 15}
              fontSize={11}
              textAnchor="middle"
              fill="#333"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default BarChart;
