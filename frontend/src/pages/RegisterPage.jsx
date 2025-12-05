// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rollNumber: "",
        password: "",
        confirmPassword: ""
    });
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                localStorage.setItem("user_name", formData.name);
                localStorage.setItem("user_email", formData.email);
                localStorage.setItem("user_id", Math.floor(Math.random() * 1000));
                localStorage.setItem("needs_baseline", "true");
                navigate("/baseline-setup");
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200">
                        🎓
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500">Join ExamPulse AI</p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                            Personal Info
                        </span>
                        <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                            Security
                        </span>
                    </div>
                    <div className="progress-bar bg-slate-200">
                        <div className="progress-fill bg-blue-600" style={{ width: `${step * 50}%` }}></div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="card shadow-xl border-none">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input"
                                        placeholder="john.doe@university.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Roll Number / Student ID</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        className="input"
                                        placeholder="CS2021045"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="input"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="input"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="alert alert-info bg-blue-50 border-blue-200 text-blue-800">
                                    <span>ℹ️</span>
                                    <div className="text-sm">
                                        After registration, you'll complete 2 practice tests to create your behavioral baseline.
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn btn-secondary flex-1"
                                >
                                    ← Back
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary flex-1 justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="spinner spinner-sm border-white"></div>
                                ) : step === 1 ? (
                                    "Continue →"
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
