// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import StatCard from "./StatCard";
import { socket } from "../socket";

function getUserName() {
  return localStorage.getItem("user_name") || "";
}

export default function Dashboard() {
  const [userId, setUserId] = useState(Number(localStorage.getItem("user_id") || 1));
  const [upcomingExams, setUpcomingExams] = useState([
    { id: 1, name: "Data Structures Final", date: "2024-01-15", time: "10:00 AM", duration: "60 min", questions: 50 },
    { id: 2, name: "Algorithms Midterm", date: "2024-01-18", time: "2:00 PM", duration: "90 min", questions: 40 },
  ]);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "exam_completed", title: "Database Systems Quiz", time: "2 hours ago", score: 85 },
    { id: 2, type: "baseline_updated", title: "Baseline Profile Updated", time: "1 day ago" },
  ]);
  const navigate = useNavigate();
  const userName = getUserName();

  const stats = {
    examsCompleted: 12,
    averageScore: 87,
    integrityScore: 98,
    upcomingExams: upcomingExams.length
  };

  const startExam = (examId) => {
    localStorage.setItem("exam_id", examId);
    socket.emit("join_exam", {
      user_id: userId,
      exam_id: examId,
      role: "student",
    });
    navigate("/exam", { state: { user_id: userId, exam_id: examId } });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={userName} userRole="student" />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {userName || "Student"}! 👋
          </h1>
          <p className="text-slate-500">
            Ready to take your next exam? Here's your dashboard overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📝"
            label="Exams Completed"
            value={stats.examsCompleted}
            trend="up"
            trendValue="+2 this week"
          />
          <StatCard
            icon="📊"
            label="Average Score"
            value={`${stats.averageScore}%`}
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            icon="✅"
            label="Integrity Score"
            value={`${stats.integrityScore}%`}
            color="success"
          />
          <StatCard
            icon="📅"
            label="Upcoming Exams"
            value={stats.upcomingExams}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams */}
          <div className="lg:col-span-2">
            <div className="card shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Upcoming Exams</h2>
                <button className="btn btn-ghost btn-sm">View All →</button>
              </div>

              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-all bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {exam.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            📅 {exam.date}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏰ {exam.time}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {exam.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            📋 {exam.questions} questions
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => startExam(exam.id)}
                        className="btn btn-primary ml-4"
                      >
                        Start Test →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {upcomingExams.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-slate-400">No upcoming exams</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/practice")}
                  className="w-full btn btn-secondary justify-start hover:bg-slate-50"
                >
                  <span className="text-xl mr-2">🎯</span>
                  Practice Test
                </button>
                <button
                  onClick={() => navigate("/results")}
                  className="w-full btn btn-secondary justify-start hover:bg-slate-50"
                >
                  <span className="text-xl mr-2">📊</span>
                  View Results
                </button>
                <button
                  onClick={() => navigate("/baseline")}
                  className="w-full btn btn-secondary justify-start hover:bg-slate-50"
                >
                  <span className="text-xl mr-2">⚙️</span>
                  Update Baseline
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="text-2xl">
                      {activity.type === "exam_completed" ? "✅" : "🔄"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                      {activity.score && (
                        <span className="badge badge-success mt-1">
                          Score: {activity.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>💡</span> Exam Tips
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Use a stable internet connection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Close other tabs and applications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Stay in the exam window
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Maintain your normal behavior
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
