// src/components/Header.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ userName, userRole = "student" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = userRole === "proctor"
    ? [
      { path: "/proctor", label: "Dashboard", icon: "📊" },
      { path: "/proctor/create-exam", label: "Create Exam", icon: "➕" },
      { path: "/proctor/analytics", label: "Analytics", icon: "📈" },
    ]
    : [
      { path: "/", label: "Dashboard", icon: "🏠" },
      { path: "/results", label: "Results", icon: "📊" },
      { path: "/profile", label: "Profile", icon: "👤" },
    ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-xl shadow-sm text-white">
              🎓
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">ExamPulse AI</h1>
              <p className="text-xs text-slate-500">Behavioral Analytics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-800">{userName || "User"}</p>
              <p className="text-xs text-slate-500 capitalize">{userRole}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
