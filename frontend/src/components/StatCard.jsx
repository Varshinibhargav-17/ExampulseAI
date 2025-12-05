// src/components/StatCard.jsx
import React from "react";

export default function StatCard({ icon, label, value, trend, trendValue, color = "primary" }) {
    return (
        <div className="stat-card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{icon}</span>
                        <span className="text-sm text-slate-500 font-medium">{label}</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{trend === 'up' ? '↗' : '↘'}</span>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
