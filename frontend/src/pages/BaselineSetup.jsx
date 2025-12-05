// src/pages/BaselineSetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function BaselineSetup() {
    const [step, setStep] = useState(0);
    const [practiceTests, setPracticeTests] = useState([
        { id: 1, name: "Practice Test 1", completed: false, score: null },
        { id: 2, name: "Practice Test 2", completed: false, score: null }
    ]);
    const navigate = useNavigate();
    const userName = localStorage.getItem("user_name") || "Student";

    const startPracticeTest = (testId) => {
        navigate("/practice-test", { state: { testId, isBaseline: true } });
    };

    const completedTests = practiceTests.filter(t => t.completed).length;
    const progress = (completedTests / practiceTests.length) * 100;

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName={userName} userRole="student" />

            <main className="container py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl mx-auto mb-6 animate-float">
                            🎯
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Create Your Behavioral Baseline
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Complete 2 practice tests so we can learn your normal behavior patterns.
                            This helps us accurately detect unusual activity during actual exams.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="card-gradient mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Setup Progress</h2>
                            <span className="text-purple-400 font-bold">{completedTests}/2 Complete</span>
                        </div>
                        <div className="progress-bar mb-2">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-400">
                            {completedTests === 0 && "Let's get started with your first practice test"}
                            {completedTests === 1 && "Great! One more practice test to go"}
                            {completedTests === 2 && "Baseline complete! You're ready for actual exams"}
                        </p>
                    </div>

                    {/* What We Track */}
                    <div className="card-gradient mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">📊 What We Track</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">⌨️</div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Typing Patterns</h4>
                                    <p className="text-sm text-gray-400">Your natural typing speed and rhythm</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🖱️</div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Mouse Movement</h4>
                                    <p className="text-sm text-gray-400">How you navigate and interact</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">⏱️</div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Answer Timing</h4>
                                    <p className="text-sm text-gray-400">Time you spend on questions</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🎯</div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Focus Patterns</h4>
                                    <p className="text-sm text-gray-400">Your concentration behavior</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Practice Tests */}
                    <div className="space-y-4 mb-8">
                        {practiceTests.map((test, index) => (
                            <div key={test.id} className="card-gradient">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${test.completed
                                                ? 'bg-green-900 text-green-200'
                                                : 'bg-purple-900 text-purple-200'
                                            }`}>
                                            {test.completed ? '✓' : index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {test.name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span>⏱️ 15 minutes</span>
                                                <span>📝 20 questions</span>
                                                {test.completed && test.score && (
                                                    <span className="text-green-400">Score: {test.score}%</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {test.completed ? (
                                        <span className="badge badge-success">✓ Completed</span>
                                    ) : (
                                        <button
                                            onClick={() => startPracticeTest(test.id)}
                                            className="btn btn-primary"
                                            disabled={index > 0 && !practiceTests[index - 1].completed}
                                        >
                                            Start Test →
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Alert */}
                    <div className="alert alert-info">
                        <span>ℹ️</span>
                        <div>
                            <p className="font-medium mb-1">Privacy First</p>
                            <p className="text-sm">
                                We only track behavioral patterns, not content. No video recording,
                                no screenshots. Your privacy is our priority.
                            </p>
                        </div>
                    </div>

                    {/* Complete Button */}
                    {completedTests === 2 && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("needs_baseline");
                                    navigate("/");
                                }}
                                className="btn btn-success btn-lg"
                            >
                                ✓ Complete Setup & Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
