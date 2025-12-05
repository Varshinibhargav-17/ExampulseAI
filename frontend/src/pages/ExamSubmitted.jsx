// src/pages/ExamSubmitted.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExamSubmitted() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Exam Submitted Successfully!</h1>
                    <p className="text-slate-600">
                        Your answers have been recorded and will be evaluated shortly.
                    </p>
                </div>

                {/* Summary Card */}
                <div className="card-glass mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Exam Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 mb-1">Exam</p>
                            <p className="font-semibold text-blue-700">Data Structures Midterm</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-900 mb-1">Questions Answered</p>
                            <p className="font-semibold text-green-700">5 / 5</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-900 mb-1">Time Taken</p>
                            <p className="font-semibold text-purple-700">12:34</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-900 mb-1">Submission Time</p>
                            <p className="font-semibold text-orange-700">{new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="card mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="font-medium text-slate-900">Results will be available within 24 hours</p>
                                <p className="text-sm text-slate-600">Check your dashboard for updates</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="font-medium text-slate-900">Email notification will be sent</p>
                                <p className="text-sm text-slate-600">You'll receive a detailed report</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <p className="font-medium text-slate-900">Download certificate upon passing</p>
                                <p className="text-sm text-slate-600">Available after results are published</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-primary flex-1"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/results")}
                        className="btn btn-secondary flex-1"
                    >
                        View Past Results
                    </button>
                </div>

                {/* Auto-redirect */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Redirecting to dashboard in {countdown} seconds...
                </p>
            </div>
        </div>
    );
}