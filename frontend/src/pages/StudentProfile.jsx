// src/pages/StudentProfile.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator";
import Modal from "../components/Modal";

export default function StudentProfile() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: localStorage.getItem("user_name") || "John Doe",
        email: localStorage.getItem("user_email") || "john.doe@university.edu",
        rollNumber: "CS2021045",
        department: "Computer Science",
        semester: "6th",
        phone: "+1 234 567 8900"
    });

    const baselineMetrics = {
        typingSpeed: "45 WPM",
        avgMouseSpeed: "500 px/s",
        avgQuestionTime: "2.5 min",
        focusPattern: "Consistent"
    };

    const examHistory = [
        { id: 1, name: "Data Structures Final", score: 84, integrity: 0.95, date: "2024-01-10" },
        { id: 2, name: "Algorithms Midterm", score: 78, integrity: 0.88, date: "2024-01-05" },
        { id: 3, name: "Database Quiz", score: 92, integrity: 0.98, date: "2024-01-02" },
    ];

    const achievements = [
        { icon: "🏆", title: "Perfect Integrity", desc: "10 exams with 100% integrity score" },
        { icon: "⭐", title: "Top Performer", desc: "Avg score above 85%" },
        { icon: "🎯", title: "Consistent", desc: "Stable baseline for 3 months" },
        { icon: "📚", title: "Active Learner", desc: "Completed 15+ exams" },
    ];

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName={profileData.name} userRole="student" />

            <main className="container py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <div className="card-gradient mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl font-bold text-white">
                                {profileData.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">{profileData.name}</h1>
                                <p className="text-gray-400 mb-3">{profileData.email}</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="badge badge-primary">{profileData.rollNumber}</span>
                                    <span className="badge badge-info">{profileData.department}</span>
                                    <span className="badge badge-success">{profileData.semester} Semester</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="btn btn-secondary"
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Baseline Metrics */}
                            <div className="card-gradient">
                                <h2 className="text-2xl font-bold text-white mb-6">📊 Behavioral Baseline</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="card bg-gray-800">
                                        <div className="text-sm text-gray-400 mb-1">Typing Speed</div>
                                        <div className="text-2xl font-bold text-white">{baselineMetrics.typingSpeed}</div>
                                    </div>
                                    <div className="card bg-gray-800">
                                        <div className="text-sm text-gray-400 mb-1">Mouse Speed</div>
                                        <div className="text-2xl font-bold text-white">{baselineMetrics.avgMouseSpeed}</div>
                                    </div>
                                    <div className="card bg-gray-800">
                                        <div className="text-sm text-gray-400 mb-1">Avg Question Time</div>
                                        <div className="text-2xl font-bold text-white">{baselineMetrics.avgQuestionTime}</div>
                                    </div>
                                    <div className="card bg-gray-800">
                                        <div className="text-sm text-gray-400 mb-1">Focus Pattern</div>
                                        <div className="text-2xl font-bold text-white">{baselineMetrics.focusPattern}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-ghost w-full">
                                        🔄 Update Baseline (Take Practice Test)
                                    </button>
                                </div>
                            </div>

                            {/* Exam History */}
                            <div className="card-gradient">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Recent Exams</h2>
                                    <button className="btn btn-ghost btn-sm">View All →</button>
                                </div>
                                <div className="space-y-3">
                                    {examHistory.map((exam) => (
                                        <div key={exam.id} className="card hover:border-purple-500 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white mb-2">{exam.name}</h3>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-400">📅 {exam.date}</span>
                                                        <span className={`badge ${exam.score >= 80 ? 'badge-success' :
                                                                exam.score >= 60 ? 'badge-warning' : 'badge-danger'
                                                            }`}>
                                                            Score: {exam.score}%
                                                        </span>
                                                        <span className="badge badge-success">
                                                            Integrity: {Math.round(exam.integrity * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className="card-gradient">
                                <h2 className="text-2xl font-bold text-white mb-6">🏆 Achievements</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {achievements.map((achievement, index) => (
                                        <div key={index} className="card bg-gray-800 hover:bg-gray-750 transition-all">
                                            <div className="flex items-start gap-3">
                                                <div className="text-3xl">{achievement.icon}</div>
                                                <div>
                                                    <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
                                                    <p className="text-sm text-gray-400">{achievement.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Overall Performance */}
                            <div className="card-gradient text-center">
                                <h3 className="text-xl font-bold text-white mb-4">Overall Performance</h3>
                                <div className="flex justify-center mb-4">
                                    <RiskScoreIndicator
                                        score={0.12}
                                        size="lg"
                                        showLabel={false}
                                    />
                                </div>
                                <div className="text-3xl font-bold text-green-400 mb-2">88%</div>
                                <p className="text-sm text-gray-400">Average Score</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="card-gradient">
                                <h3 className="text-xl font-bold text-white mb-4">📈 Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Exams Taken</span>
                                        <span className="text-white font-bold">15</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Avg Integrity</span>
                                        <span className="text-green-400 font-bold">94%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Incidents</span>
                                        <span className="text-yellow-400 font-bold">2</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Rank</span>
                                        <span className="text-purple-400 font-bold">Top 10%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="card-gradient">
                                <h3 className="text-xl font-bold text-white mb-4">📋 Account Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="text-gray-400 mb-1">Roll Number</div>
                                        <div className="text-white font-medium">{profileData.rollNumber}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 mb-1">Department</div>
                                        <div className="text-white font-medium">{profileData.department}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 mb-1">Semester</div>
                                        <div className="text-white font-medium">{profileData.semester}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 mb-1">Phone</div>
                                        <div className="text-white font-medium">{profileData.phone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy Settings */}
                            <div className="card-gradient">
                                <h3 className="text-xl font-bold text-white mb-4">🔒 Privacy</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Data Sharing</span>
                                        <span className="badge badge-success">Minimal</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Video Recording</span>
                                        <span className="badge badge-danger">Disabled</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Behavioral Only</span>
                                        <span className="badge badge-success">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Profile"
                size="md"
            >
                <form className="space-y-4">
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            className="input"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Phone</label>
                        <input
                            type="tel"
                            className="input"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            onClick={(e) => {
                                e.preventDefault();
                                localStorage.setItem("user_name", profileData.name);
                                localStorage.setItem("user_email", profileData.email);
                                setShowEditModal(false);
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
