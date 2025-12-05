// src/pages/ProctorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator";
import StatCard from "../components/StatCard";
import Modal from "../components/Modal";
import { socket } from "../socket";

export default function ProctorDashboard() {
    const navigate = useNavigate();
    const [activeExams, setActiveExams] = useState([
        {
            id: 1,
            name: "Data Structures Final",
            activeStudents: 118,
            totalStudents: 120,
            startTime: "10:00 AM",
            timeRemaining: "28 min",
            avgProgress: 32,
            totalQuestions: 50
        }
    ]);

    const [alerts, setAlerts] = useState([
        {
            id: 1,
            studentName: "John Doe",
            studentId: "CS2021045",
            riskScore: 0.87,
            incidents: [
                { type: "tab_switch", count: 15, time: "10:15" },
                { type: "typing_speed", value: "92 WPM", baseline: "45 WPM", time: "10:17" },
                { type: "copy_paste", time: "10:20" },
                { type: "window_blur", duration: "45s", time: "10:22" }
            ],
            examId: 1
        },
        {
            id: 2,
            studentName: "Jane Smith",
            studentId: "CS2021046",
            riskScore: 0.62,
            incidents: [
                { type: "window_blur", duration: "120s", time: "10:18" }
            ],
            examId: 1
        }
    ]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);

    const stats = {
        activeExams: activeExams.length,
        totalStudents: activeExams.reduce((sum, exam) => sum + exam.activeStudents, 0),
        highRiskAlerts: alerts.filter(a => a.riskScore > 0.7).length,
        mediumRiskAlerts: alerts.filter(a => a.riskScore >= 0.5 && a.riskScore <= 0.7).length
    };

    const viewStudentDetails = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const getIncidentIcon = (type) => {
        const icons = {
            tab_switch: "🔄",
            typing_speed: "⌨️",
            copy_paste: "📋",
            window_blur: "👁️",
            mouse_pattern: "🖱️"
        };
        return icons[type] || "⚠️";
    };

    const getIncidentLabel = (incident) => {
        const labels = {
            tab_switch: `Tab switched ${incident.count} times`,
            typing_speed: `Typing speed: ${incident.value} (baseline: ${incident.baseline})`,
            copy_paste: "Copy-paste detected",
            window_blur: `Window blur for ${incident.duration}`,
            mouse_pattern: "Unusual mouse pattern"
        };
        return labels[incident.type] || "Suspicious activity";
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName="Dr. Smith" userRole="proctor" />

            <main className="container py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            🔴 Live Monitoring Dashboard
                        </h1>
                        <p className="text-gray-400">Real-time exam proctoring and behavioral analytics</p>
                    </div>
                    <button onClick={() => navigate("/proctor/create-exam")} className="btn btn-primary">
                        + Create New Exam
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="📝"
                        label="Active Exams"
                        value={stats.activeExams}
                        color="primary"
                    />
                    <StatCard
                        icon="👥"
                        label="Active Students"
                        value={stats.totalStudents}
                        color="info"
                    />
                    <StatCard
                        icon="🔴"
                        label="High Risk Alerts"
                        value={stats.highRiskAlerts}
                        color="danger"
                    />
                    <StatCard
                        icon="🟡"
                        label="Medium Risk"
                        value={stats.mediumRiskAlerts}
                        color="warning"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Exams */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeExams.map((exam) => (
                            <div key={exam.id} className="card-gradient">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{exam.name}</h2>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>👥 {exam.activeStudents}/{exam.totalStudents} active</span>
                                            <span>⏰ {exam.timeRemaining} remaining</span>
                                            <span>📊 Avg: {exam.avgProgress}/{exam.totalQuestions}</span>
                                        </div>
                                    </div>
                                    <span className="badge badge-success">🔴 Live</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-400">Overall Progress</span>
                                        <span className="text-white font-medium">
                                            {Math.round((exam.avgProgress / exam.totalQuestions) * 100)}%
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(exam.avgProgress / exam.totalQuestions) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Alerts for this exam */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        ⚠️ Alerts ({alerts.filter(a => a.examId === exam.id).length})
                                    </h3>
                                    <div className="space-y-3">
                                        {alerts.filter(a => a.examId === exam.id).map((alert) => (
                                            <div
                                                key={alert.id}
                                                className={`card cursor-pointer hover:border-${alert.riskScore > 0.7 ? 'red' : 'yellow'}-500`}
                                                onClick={() => viewStudentDetails(alert)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <RiskScoreIndicator
                                                            score={alert.riskScore}
                                                            size="sm"
                                                            showLabel={false}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-white">{alert.studentName}</h4>
                                                                <span className="text-sm text-gray-400">({alert.studentId})</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {alert.incidents.slice(0, 3).map((incident, idx) => (
                                                                    <span key={idx} className="text-xs text-gray-400">
                                                                        {getIncidentIcon(incident.type)} {incident.type.replace('_', ' ')}
                                                                    </span>
                                                                ))}
                                                                {alert.incidents.length > 3 && (
                                                                    <span className="text-xs text-gray-400">
                                                                        +{alert.incidents.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-sm btn-ghost">
                                                        View Details →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeExams.length === 0 && (
                            <div className="card-gradient text-center py-12">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Active Exams</h3>
                                <p className="text-gray-400 mb-6">Create a new exam to start monitoring</p>
                                <button onClick={() => navigate("/proctor/create-exam")} className="btn btn-primary">+ Create Exam</button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">📊 Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Normal Behavior</span>
                                    <span className="text-green-400 font-bold">
                                        {activeExams.reduce((sum, e) => sum + e.activeStudents, 0) - alerts.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Warnings</span>
                                    <span className="text-yellow-400 font-bold">{stats.mediumRiskAlerts}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">High Risk</span>
                                    <span className="text-red-400 font-bold">{stats.highRiskAlerts}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Incidents */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">🚨 Recent Incidents</h3>
                            <div className="space-y-3">
                                {alerts.flatMap(alert =>
                                    alert.incidents.slice(0, 2).map((incident, idx) => ({
                                        ...incident,
                                        studentName: alert.studentName,
                                        key: `${alert.id}-${idx}`
                                    }))
                                ).slice(0, 5).map((incident) => (
                                    <div key={incident.key} className="timeline-item">
                                        <div className="text-sm">
                                            <div className="font-medium text-white mb-1">
                                                {getIncidentIcon(incident.type)} {incident.studentName}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {getIncidentLabel(incident)}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {incident.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="card-gradient">
                            <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => navigate("/proctor")} className="btn btn-secondary w-full justify-start">
                                    📊 View All Exams
                                </button>
                                <button className="btn btn-secondary w-full justify-start">
                                    👥 Manage Students
                                </button>
                                <button onClick={() => navigate("/proctor/analytics")} className="btn btn-secondary w-full justify-start">
                                    📈 Analytics Report
                                </button>
                                <button className="btn btn-secondary w-full justify-start">
                                    ⚙️ Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <Modal
                    isOpen={showStudentModal}
                    onClose={() => setShowStudentModal(false)}
                    title={`Student Details: ${selectedStudent.studentName}`}
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Risk Score */}
                        <div className="flex items-center justify-between p-6 bg-gray-800 rounded-xl">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Risk Assessment</h3>
                                <p className="text-gray-400 text-sm">Real-time behavioral analysis</p>
                            </div>
                            <RiskScoreIndicator score={selectedStudent.riskScore} size="lg" />
                        </div>

                        {/* Incidents Timeline */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">🚨 Incident Log</h3>
                            <div className="space-y-3">
                                {selectedStudent.incidents.map((incident, idx) => (
                                    <div key={idx} className="card">
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{getIncidentIcon(incident.type)}</div>
                                            <div className="flex-1">
                                                <div className="font-medium text-white mb-1">
                                                    {getIncidentLabel(incident)}
                                                </div>
                                                <div className="text-sm text-gray-400">Time: {incident.time}</div>
                                            </div>
                                            <span className={`badge ${selectedStudent.riskScore > 0.7 ? 'badge-danger' : 'badge-warning'
                                                }`}>
                                                {incident.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Behavior Comparison */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">📊 Behavior Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 text-gray-400 font-medium">Metric</th>
                                            <th className="text-right py-3 text-gray-400 font-medium">Baseline</th>
                                            <th className="text-right py-3 text-gray-400 font-medium">Current</th>
                                            <th className="text-right py-3 text-gray-400 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-3 text-white">Typing Speed</td>
                                            <td className="text-right text-gray-400">45 WPM</td>
                                            <td className="text-right text-white">92 WPM</td>
                                            <td className="text-right">
                                                <span className="badge badge-danger">⚠️ High</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="py-3 text-white">Tab Switches</td>
                                            <td className="text-right text-gray-400">1-2</td>
                                            <td className="text-right text-white">15</td>
                                            <td className="text-right">
                                                <span className="badge badge-danger">⚠️ High</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-white">Mouse Movement</td>
                                            <td className="text-right text-gray-400">500 px/s</td>
                                            <td className="text-right text-white">80 px/s</td>
                                            <td className="text-right">
                                                <span className="badge badge-warning">⚠️ Low</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="btn btn-danger flex-1">
                                🚫 Flag for Review
                            </button>
                            <button className="btn btn-success flex-1">
                                ✓ Mark as False Positive
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
