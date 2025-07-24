import React, { useState } from "react";

type PieData = {
    label: string;
    value: number; // in percent (sum = 100)
    color: string;
};

type Props = {
    data: PieData[];
    radius?: number;
};

const getArcPath = (
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number
): string => {
    const start = {
        x: cx + radius * Math.cos(startAngle),
        y: cy + radius * Math.sin(startAngle),
    };

    const end = {
        x: cx + radius * Math.cos(endAngle),
        y: cy + radius * Math.sin(endAngle),
    };

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    // console.log("  ↪ Arc Start:", start);
    // console.log("  ↪ Arc End:", end);
    // console.log("  ↪ Large Arc Flag:", largeArcFlag);

    const path = [
        `M ${cx} ${cy}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        "Z",
    ].join(" ");

    // console.log("  ↪ SVG Path:", path);
    return path;
};

const PieChart: React.FC<Props> = ({ data, radius = 100 }) => {
    const cx = radius + 5;
    const cy = radius + 5;
    let startAngle = 0;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    // console.log("🔵 Rendering Pie Chart");
    // console.log("👉 Center:", { cx, cy });

    return (
        <div style={{ textAlign: "center", padding: '5px' }}>
            <svg width={(radius * 2) + 10} height={(radius * 2) + 10}>
                {data.map((slice, index) => {
                    const sliceAngle = (slice.value / 100) * 2 * Math.PI;
                    const endAngle = startAngle + sliceAngle;

                    const isHovered = index === hoveredIndex;
                    const updatedRadious = (isHovered ? radius + 3 : radius)
                    const path = getArcPath(cx, cy, updatedRadious, startAngle, endAngle);

                    console.log("aaaa", isHovered);

                    const pathElement = (
                        <path
                            key={index}
                            d={path}
                            fill={slice.color}
                            stroke="#fff"
                            strokeWidth={isHovered ? 1 : 0.5}
                            opacity={hoveredIndex === null || isHovered ? 1 : 0.5}
                            onMouseEnter={(e) => {
                                setTooltipPos({ x: e.clientX, y: e.clientY })
                                setHoveredIndex(index)
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null)
                                setTooltipPos(null);
                            }}
                        // onMouseMove={(e) => {
                        //     setTooltipPos({ x: e.clientX, y: e.clientY });
                        // }}
                        />
                    );

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
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "12px" }}>
                {data.map((slice, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            fontWeight: hoveredIndex === index ? "bold" : "normal",
                            color: slice.color,
                            margin: "5px 0",
                        }}
                    >
                        {slice.label}: {slice.value}%
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
