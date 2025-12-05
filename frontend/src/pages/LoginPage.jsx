// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Mock login - in production, call your backend API
            localStorage.setItem("user_name", email.split("@")[0]);
            localStorage.setItem("user_id", Math.floor(Math.random() * 1000));
            localStorage.setItem("user_role", role);
            localStorage.setItem("user_email", email);

            if (role === "proctor") {
                navigate("/proctor");
            } else {
                navigate("/");
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200">
                        🎓
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">ExamPulse AI</h1>
                    <p className="text-slate-500">Behavioral Analytics for Exam Integrity</p>
                </div>

                {/* Login Card */}
                <div className="card shadow-xl border-none">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome Back</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Role Selection */}
                        <div className="input-group">
                            <label className="input-label">Login As</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all border ${role === "student"
                                        ? "bg-blue-50 border-blue-200 text-blue-700"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    🎓 Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("proctor")}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all border ${role === "proctor"
                                        ? "bg-blue-50 border-blue-200 text-blue-700"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    👨‍🏫 Proctor
                                </button>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="student@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-700">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner spinner-sm border-white"></div>
                            ) : (
                                <>Sign In</>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                        <div className="text-xl mb-1">🔒</div>
                        <div className="text-xs font-medium text-slate-600">Secure</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                        <div className="text-xl mb-1">🕵️</div>
                        <div className="text-xs font-medium text-slate-600">Privacy</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100">
                        <div className="text-xl mb-1">⚡</div>
                        <div className="text-xs font-medium text-slate-600">Real-time</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
