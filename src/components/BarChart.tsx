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
};

const BarChart: React.FC<BarChartProps> = ({ data, width = 500, height = 300 }) => {
    const maxVal = Math.max(...data.map((d) => d.value));
    const barWidth = width / data.length;
    const labelHeight = 20;

    return (
        <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
            {data.map((d, i) => {
                const barHeight = (d.value / maxVal) * (height - 2 * labelHeight);
                const x = i * barWidth + 10;
                const y = height - barHeight - labelHeight;

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
                            fontSize={12}
                            textAnchor="middle"
                            fill="#333"
                        >
                            {d.value}
                        </text>
                        {/* Label below */}
                        <text
                            x={x + (barWidth - 20) / 2}
                            y={height - 5}
                            fontSize={12}
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
