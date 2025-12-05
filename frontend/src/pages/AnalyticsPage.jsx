// src/pages/AnalyticsPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator";
import StatCard from "../components/StatCard";

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("week");
    const [selectedExam, setSelectedExam] = useState("all");

    const stats = {
        totalExams: 24,
        totalStudents: 450,
        avgIntegrityScore: 0.94,
        incidentsDetected: 38,
        falsePositives: 5,
        highRiskStudents: 8
    };

    const recentExams = [
        { id: 1, name: "Data Structures Final", students: 120, avgScore: 78, incidents: 12, date: "2024-01-15" },
        { id: 2, name: "Algorithms Midterm", students: 115, avgScore: 82, incidents: 8, date: "2024-01-12" },
        { id: 3, name: "Database Quiz", students: 95, avgScore: 88, incidents: 3, date: "2024-01-10" },
    ];

    const incidentTypes = [
        { type: "Tab Switch", count: 18, percentage: 47 },
        { type: "Copy/Paste", count: 8, percentage: 21 },
        { type: "Window Blur", count: 7, percentage: 18 },
        { type: "Typing Anomaly", count: 5, percentage: 14 },
    ];

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName="Dr. Smith" userRole="proctor" />

            <main className="container py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard 📈</h1>
                        <p className="text-gray-400">Comprehensive behavioral analytics and insights</p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex gap-2">
                        {["day", "week", "month", "year"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`btn btn-sm ${timeRange === range ? 'btn-primary' : 'btn-ghost'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="📝"
                        label="Total Exams"
                        value={stats.totalExams}
                        trend="up"
                        trendValue="+3 this week"
                    />
                    <StatCard
                        icon="👥"
                        label="Total Students"
                        value={stats.totalStudents}
                        trend="up"
                        trendValue="+12%"
                    />
                    <StatCard
                        icon="✅"
                        label="Avg Integrity Score"
                        value={`${Math.round(stats.avgIntegrityScore * 100)}%`}
                        color="success"
                    />
                    <StatCard
                        icon="⚠️"
                        label="Incidents Detected"
                        value={stats.incidentsDetected}
                        color="warning"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Incident Types Breakdown */}
                        <div className="card-gradient">
                            <h2 className="text-2xl font-bold text-white mb-6">Incident Types Distribution</h2>
                            <div className="space-y-4">
                                {incidentTypes.map((incident) => (
                                    <div key={incident.type}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{incident.type}</span>
                                            <span className="text-gray-400">{incident.count} incidents</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${incident.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Exams Performance */}
                        <div className="card-gradient">
                            <h2 className="text-2xl font-bold text-white mb-6">Recent Exam Performance</h2>
                            <div className="space-y-3">
                                {recentExams.map((exam) => (
                                    <div key={exam.id} className="card hover:border-purple-500 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-2">{exam.name}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span>👥 {exam.students} students</span>
                                                    <span>📊 Avg: {exam.avgScore}%</span>
                                                    <span>⚠️ {exam.incidents} incidents</span>
                                                    <span>📅 {exam.date}</span>
                                                </div>
                                            </div>
                                            <button className="btn btn-ghost btn-sm">
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Behavioral Trends Chart Placeholder */}
                        <div className="card-gradient">
                            <h2 className="text-2xl font-bold text-white mb-6">Behavioral Trends</h2>
                            <div className="chart-container flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📊</div>
                                    <p className="text-gray-400">Chart visualization</p>
                                    <p className="text-sm text-gray-500">Integrate Chart.js or Recharts for live graphs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Overall Integrity Score */}
                        <div className="card-gradient text-center">
                            <h3 className="text-xl font-bold text-white mb-4">Overall Integrity</h3>
                            <div className="flex justify-center mb-4">
                                <RiskScoreIndicator
                                    score={1 - stats.avgIntegrityScore}
                                    size="lg"
                                    showLabel={false}
                                />
                            </div>
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {Math.round(stats.avgIntegrityScore * 100)}%
                            </div>
                            <p className="text-sm text-gray-400">Excellent performance</p>
                        </div>

                        {/* Risk Distribution */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">Risk Distribution</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-900 bg-opacity-20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <span className="text-white">Low Risk</span>
                                    </div>
                                    <span className="text-green-400 font-bold">412</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-yellow-900 bg-opacity-20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <span className="text-white">Medium Risk</span>
                                    </div>
                                    <span className="text-yellow-400 font-bold">30</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-900 bg-opacity-20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <span className="text-white">High Risk</span>
                                    </div>
                                    <span className="text-red-400 font-bold">8</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Insights */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <p className="text-white font-medium mb-1">Tab switching is the most common incident</p>
                                    <p className="text-gray-400">Consider adjusting sensitivity for open-book exams</p>
                                </div>
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <p className="text-white font-medium mb-1">False positive rate: 13%</p>
                                    <p className="text-gray-400">Within acceptable range</p>
                                </div>
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <p className="text-white font-medium mb-1">Integrity scores improving</p>
                                    <p className="text-gray-400">+5% compared to last month</p>
                                </div>
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">📥 Export Data</h3>
                            <div className="space-y-2">
                                <button className="btn btn-secondary w-full justify-start">
                                    📄 Download PDF Report
                                </button>
                                <button className="btn btn-secondary w-full justify-start">
                                    📊 Export to Excel
                                </button>
                                <button className="btn btn-secondary w-full justify-start">
                                    📧 Email Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
