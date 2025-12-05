// src/pages/CreateExamPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function CreateExamPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        examName: "",
        duration: 60,
        totalQuestions: 50,
        scheduledDate: "",
        scheduledTime: "",
        monitoringSensitivity: "medium",
        allowTabSwitch: false,
        allowCopyPaste: false,
        instructions: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, send to backend
        console.log("Creating exam:", formData);
        navigate("/proctor");
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName="Dr. Smith" userRole="proctor" />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/proctor")}
                            className="btn btn-ghost mb-4"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-white mb-2">Create New Exam</h1>
                        <p className="text-gray-400">Set up a new exam with behavioral monitoring</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            {["Basic Info", "Settings", "Review"].map((label, index) => (
                                <div key={index} className="flex items-center flex-1">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step > index + 1 ? 'bg-green-600 text-white' :
                                            step === index + 1 ? 'bg-purple-600 text-white' :
                                                'bg-gray-700 text-gray-400'
                                        }`}>
                                        {step > index + 1 ? '✓' : index + 1}
                                    </div>
                                    <span className={`ml-3 font-medium ${step >= index + 1 ? 'text-white' : 'text-gray-500'
                                        }`}>
                                        {label}
                                    </span>
                                    {index < 2 && (
                                        <div className={`flex-1 h-1 mx-4 rounded ${step > index + 1 ? 'bg-green-600' : 'bg-gray-700'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="card-gradient space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

                                <div className="input-group">
                                    <label className="input-label">Exam Name *</label>
                                    <input
                                        type="text"
                                        name="examName"
                                        className="input"
                                        placeholder="e.g., Data Structures Final Exam"
                                        value={formData.examName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="input-group">
                                        <label className="input-label">Duration (minutes) *</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            className="input"
                                            min="15"
                                            max="300"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Total Questions *</label>
                                        <input
                                            type="number"
                                            name="totalQuestions"
                                            className="input"
                                            min="1"
                                            max="200"
                                            value={formData.totalQuestions}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="input-group">
                                        <label className="input-label">Scheduled Date *</label>
                                        <input
                                            type="date"
                                            name="scheduledDate"
                                            className="input"
                                            value={formData.scheduledDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Scheduled Time *</label>
                                        <input
                                            type="time"
                                            name="scheduledTime"
                                            className="input"
                                            value={formData.scheduledTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Exam Instructions</label>
                                    <textarea
                                        name="instructions"
                                        className="input"
                                        rows="4"
                                        placeholder="Enter instructions for students..."
                                        value={formData.instructions}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary w-full"
                                >
                                    Continue to Settings →
                                </button>
                            </div>
                        )}

                        {/* Step 2: Settings */}
                        {step === 2 && (
                            <div className="card-gradient space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Monitoring Settings</h2>

                                <div className="input-group">
                                    <label className="input-label">Monitoring Sensitivity</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["low", "medium", "high"].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, monitoringSensitivity: level })}
                                                className={`py-3 px-4 rounded-xl font-medium transition-all ${formData.monitoringSensitivity === level
                                                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                                                        : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">
                                                    {level === "low" ? "🟢" : level === "medium" ? "🟡" : "🔴"}
                                                </div>
                                                <div className="capitalize">{level}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {formData.monitoringSensitivity === "low" && "Relaxed monitoring - fewer alerts"}
                                        {formData.monitoringSensitivity === "medium" && "Balanced monitoring - recommended"}
                                        {formData.monitoringSensitivity === "high" && "Strict monitoring - maximum security"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Behavioral Tracking</h3>

                                    <div className="card bg-gray-800">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="trackMouse"
                                                className="mt-1 w-5 h-5"
                                                defaultChecked
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="trackMouse" className="text-white font-medium cursor-pointer">
                                                    Track Mouse Movements
                                                </label>
                                                <p className="text-sm text-gray-400">Monitor mouse speed, patterns, and idle time</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gray-800">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="trackKeyboard"
                                                className="mt-1 w-5 h-5"
                                                defaultChecked
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="trackKeyboard" className="text-white font-medium cursor-pointer">
                                                    Track Keystroke Dynamics
                                                </label>
                                                <p className="text-sm text-gray-400">Monitor typing speed and patterns</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gray-800">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="trackWindow"
                                                className="mt-1 w-5 h-5"
                                                defaultChecked
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="trackWindow" className="text-white font-medium cursor-pointer">
                                                    Track Window Activity
                                                </label>
                                                <p className="text-sm text-gray-400">Detect tab switches and window blur events</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Restrictions</h3>

                                    <div className="card bg-gray-800">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                name="allowTabSwitch"
                                                id="allowTabSwitch"
                                                className="mt-1 w-5 h-5"
                                                checked={formData.allowTabSwitch}
                                                onChange={handleChange}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="allowTabSwitch" className="text-white font-medium cursor-pointer">
                                                    Allow Tab Switching
                                                </label>
                                                <p className="text-sm text-gray-400">
                                                    {formData.allowTabSwitch
                                                        ? "Students can switch tabs (will be logged)"
                                                        : "Tab switching will trigger warnings"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gray-800">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                name="allowCopyPaste"
                                                id="allowCopyPaste"
                                                className="mt-1 w-5 h-5"
                                                checked={formData.allowCopyPaste}
                                                onChange={handleChange}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="allowCopyPaste" className="text-white font-medium cursor-pointer">
                                                    Allow Copy/Paste
                                                </label>
                                                <p className="text-sm text-gray-400">
                                                    {formData.allowCopyPaste
                                                        ? "Copy/paste allowed (will be logged)"
                                                        : "Copy/paste will be blocked"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn btn-secondary flex-1"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="btn btn-primary flex-1"
                                    >
                                        Review & Create →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="card-gradient space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Review & Confirm</h2>

                                <div className="space-y-4">
                                    <div className="card bg-gray-800">
                                        <h3 className="text-lg font-semibold text-white mb-4">Exam Details</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Name:</span>
                                                <p className="text-white font-medium">{formData.examName}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Duration:</span>
                                                <p className="text-white font-medium">{formData.duration} minutes</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Questions:</span>
                                                <p className="text-white font-medium">{formData.totalQuestions}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Scheduled:</span>
                                                <p className="text-white font-medium">
                                                    {formData.scheduledDate} at {formData.scheduledTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gray-800">
                                        <h3 className="text-lg font-semibold text-white mb-4">Monitoring Configuration</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Sensitivity:</span>
                                                <span className={`badge ${formData.monitoringSensitivity === "low" ? "badge-success" :
                                                        formData.monitoringSensitivity === "medium" ? "badge-warning" :
                                                            "badge-danger"
                                                    }`}>
                                                    {formData.monitoringSensitivity.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Tab Switching:</span>
                                                <span className="text-white">
                                                    {formData.allowTabSwitch ? "Allowed (logged)" : "Blocked"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Copy/Paste:</span>
                                                <span className="text-white">
                                                    {formData.allowCopyPaste ? "Allowed (logged)" : "Blocked"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.instructions && (
                                        <div className="card bg-gray-800">
                                            <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
                                            <p className="text-gray-300 text-sm">{formData.instructions}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="alert alert-info">
                                    <span>ℹ️</span>
                                    <div>
                                        <p className="font-medium mb-1">Ready to Create</p>
                                        <p className="text-sm">
                                            Once created, invitation emails will be sent to enrolled students.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn btn-secondary flex-1"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success flex-1"
                                    >
                                        ✓ Create Exam
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
