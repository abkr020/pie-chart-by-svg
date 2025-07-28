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

const getMidAngle = (start: number, end: number) => (start + end) / 2;

const polarToCartesian = (cx: number, cy: number, r: number, angleRad: number) => ({
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
});

const getArcSegmentPath = (
    cx: number,
    cy: number,
    radius: number,
    angleStartRad: number,
    angleEndRad: number
): string => {
    const start = polarToCartesian(cx, cy, radius, angleStartRad);
    const end = polarToCartesian(cx, cy, radius, angleEndRad);
    const largeArc = angleEndRad - angleStartRad > Math.PI ? 1 : 0;

    return [
        `M ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    ].join(' ');
};


const PieChart: React.FC<Props> = ({ data, radius = 100, innerRadius = 0 }) => {
    const cx = radius + 100;
    const cy = radius + 50;
    let startAngle = 0;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    return (
        <div style={{ textAlign: "center", padding: '5px' }}>
            <svg width={(radius * 2) + 200} height={(radius * 2) + 100} style={{ backgroundColor: 'darkgray' }}>
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
                                strokeWidth={1}
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
                {hoveredIndex !== null && (() => {
                    const hovered = data[hoveredIndex];
                    const sliceStartAngle = data
                        .slice(0, hoveredIndex)
                        .reduce((acc, cur) => acc + (cur.value / 100) * 2 * Math.PI, 0);
                    const sliceAngle = (hovered.value / 100) * 2 * Math.PI;
                    const sliceEndAngle = sliceStartAngle + sliceAngle;
                    const midAngle = getMidAngle(sliceStartAngle, sliceEndAngle);

                    const r1 = radius + 8; // arc ring
                    const r2 = r1 + 20;    // line endpoint

                    const arcPoint = polarToCartesian(cx, cy, r1, midAngle);
                    const linePoint = polarToCartesian(cx, cy, r2, midAngle);

                    const textOffsetX = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? -40 : 10;
                    const labelAnchorPoint = {
                        x: linePoint.x + (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? -20 : 20),
                        y: linePoint.y,
                    };


                    return (
                        <>
                            {/* Outer highlight arc */}
                            <path
                                d={getArcSegmentPath(cx, cy, radius + 8, sliceStartAngle, sliceEndAngle)}
                                fill="none"
                                stroke={hovered.color}
                                strokeWidth="2"
                            />

                            {/* Pointer line from arc edge to label line start */}
                            <line
                                x1={arcPoint.x}
                                y1={arcPoint.y}
                                x2={linePoint.x}
                                y2={linePoint.y}
                                stroke={hovered.color}
                                strokeWidth="1.5"
                            />

                            {/* Horizontal label line */}
                            <line
                                x1={linePoint.x}
                                y1={linePoint.y}
                                x2={labelAnchorPoint.x}
                                y2={labelAnchorPoint.y}
                                stroke={hovered.color}
                                strokeWidth="1.5"
                            />

                            {/* Circle at label end */}
                            <circle cx={labelAnchorPoint.x} cy={labelAnchorPoint.y} r={2} fill={hovered.color} />

                            {/* Value text */}
                            <text
                                x={labelAnchorPoint.x + (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? -10 : 10)}
                                y={labelAnchorPoint.y + 5}
                                fontSize="13"
                                fontWeight="bold"
                                fill={hovered.color}
                                textAnchor={midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? "end" : "start"}
                            >
                                {hovered.value}%
                            </text>
                        </>

                    );
                })()}

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
