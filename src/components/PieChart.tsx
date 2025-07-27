import React, { useState } from "react";

type PieData = {
    label: string;
    value: number; // in percent (sum = 100)
    color: string;
};

type Props = {
    data: PieData[];
    radius?: number;
    innerRadius?: number; // <-- NEW
};

const getArcPath = (
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
): string => {
    const polarToCartesian = (r: number, angle: number) => ({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
    });

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const outerStart = polarToCartesian(outerR, startAngle);
    const outerEnd = polarToCartesian(outerR, endAngle);
    const innerEnd = polarToCartesian(innerR, endAngle);
    const innerStart = polarToCartesian(innerR, startAngle);

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
        `Z`,
    ].join(" ");
};

const PieChart: React.FC<Props> = ({ data, radius = 100, innerRadius = 0 }) => {
    const cx = radius + 5;
    const cy = radius + 5;
    let startAngle = 0;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    return (
        <div style={{ textAlign: "center", padding: '5px' }}>
            <svg width={(radius * 2) + 10} height={(radius * 2) + 10}>
                {data.map((slice, index) => {
                    const sliceAngle = (slice.value / 100) * 2 * Math.PI;
                    const endAngle = startAngle + sliceAngle;

                    const isHovered = index === hoveredIndex;
                    const updatedRadious = (isHovered ? radius + 5 : radius)
                    const updatedInnerRadious = (isHovered ? innerRadius - 5 : innerRadius)
                    const path = getArcPath(cx, cy, updatedRadious, updatedInnerRadious, startAngle, endAngle);
                    console.log('path====', path);

                    console.log("aaaa", isHovered);


                    const pathElement = (
                        <>

                            <path
                                key={index}
                                d={path}
                                fill={slice.color}
                                stroke={isHovered ? slice.color : '#fff'}
                                strokeWidth={isHovered ? 2 : 1}
                                opacity={hoveredIndex === null || isHovered ? 1 : 0.5}
                                onMouseEnter={(e) => {
                                    setTooltipPos({ x: e.clientX, y: e.clientY })
                                    setHoveredIndex(index)
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null)
                                    setTooltipPos(null);
                                }}
                            />
                            {
                                hoveredIndex !== null && (
                                    <text
                                        x={cx}
                                        y={cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="16"
                                        fontWeight="bold"
                                        fill={data[hoveredIndex].color}
                                    >
                                        {data[hoveredIndex].label}
                                    </text>
                                )
                            }
                        </>
                    );
                    {/* Center label */ }

                    startAngle = endAngle;
                    return pathElement;
                })}
            </svg>
            {hoveredIndex !== null && tooltipPos && (
                <div
                    style={{
                        position: "fixed",
                        top: tooltipPos.y + 10,
                        left: tooltipPos.x + 10,
                        background: "#fff",
                        // border: "1px solid #ccc",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        pointerEvents: "none",
                        fontSize: "14px",
                        color: "#333",
                        whiteSpace: "nowrap",
                        zIndex: 1000,
                    }}
                >
                    <strong>{data[hoveredIndex].label}</strong>: {data[hoveredIndex].value}%
                </div>
            )}

            {/* Labels Below Chart */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: 'wrap' }}>
                {data.map((slice, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "16px",
                            fontWeight: hoveredIndex === index ? "bold" : "normal",
                            color: slice.color, // neutral text color
                        }}
                    >
                        <div style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: slice.color,
                            borderRadius: "3px",
                            boxShadow: hoveredIndex === index ? "0 0 3px rgba(0,0,0,0.5)" : "none"
                        }} />
                        {slice.label}: {slice.value}%
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PieChart;
