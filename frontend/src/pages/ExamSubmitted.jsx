// src/pages/ExamSubmitted.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ExamSubmitted() {
    const navigate = useNavigate();
    const location = useLocation();
    const examId = location.state?.exam_id || 1;
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <div className="max-w-2xl w-full text-center">
                {/* Success Animation */}
                <div className="mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-6xl mx-auto mb-6 animate-float">
                        ✓
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Exam Submitted Successfully! 🎉
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your answers have been recorded and are being processed.
                    </p>
                </div>

                {/* Info Card */}
                <div className="card-glass mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Exam ID</div>
                            <div className="text-2xl font-bold text-white">{examId}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Status</div>
                            <div className="text-2xl font-bold text-green-400">Submitted</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Results</div>
                            <div className="text-2xl font-bold text-white">48 hours</div>
                        </div>
                    </div>

                    <div className="alert alert-success">
                        <span>✓</span>
                        <div>
                            <p className="font-medium mb-1">What happens next?</p>
                            <p className="text-sm">
                                Your exam will be graded and your behavioral data will be analyzed.
                                Results will be available within 48 hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="card-gradient mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">📋 Next Steps</h3>
                    <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-900 text-purple-200 flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">Check Your Email</h4>
                                <p className="text-sm text-gray-400">
                                    You'll receive a confirmation email shortly
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-900 text-purple-200 flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">Wait for Results</h4>
                                <p className="text-sm text-gray-400">
                                    Results will be available in your dashboard within 48 hours
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-900 text-purple-200 flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">Review Performance</h4>
                                <p className="text-sm text-gray-400">
                                    View detailed analytics and integrity score
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-primary btn-lg"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/results")}
                        className="btn btn-secondary btn-lg"
                    >
                        View Past Results
                    </button>
                </div>

                <p className="text-gray-500 text-sm mt-6">
                    Redirecting to dashboard in {countdown} seconds...
                </p>
            </div>
        </div>
    );
}
