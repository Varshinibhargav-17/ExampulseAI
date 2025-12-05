// src/components/RiskScoreIndicator.jsx
import React from "react";

export default function RiskScoreIndicator({ score, size = "md", showLabel = true }) {
    const getRiskLevel = (score) => {
        if (score < 0.3) return { level: "low", label: "Normal", color: "success" };
        if (score < 0.7) return { level: "medium", label: "Warning", color: "warning" };
        return { level: "high", label: "High Risk", color: "danger" };
    };

    const risk = getRiskLevel(score);
    const percentage = Math.round(score * 100);

    const sizeClasses = {
        sm: "w-12 h-12 text-xs",
        md: "w-16 h-16 text-sm",
        lg: "w-24 h-24 text-lg"
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="var(--color-border)"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke={`var(--color-${risk.color})`}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${percentage * 2.83} 283`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold ${sizeClasses[size]}`} style={{ color: `var(--color-${risk.color})` }}>
                        {percentage}
                    </span>
                </div>
            </div>
            {showLabel && (
                <span className={`badge badge-${risk.color}`}>
                    {risk.label}
                </span>
            )}
        </div>
    );
}
