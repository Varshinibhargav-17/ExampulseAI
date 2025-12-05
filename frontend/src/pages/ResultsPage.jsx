// src/pages/ResultsPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator";
import Modal from "../components/Modal";

export default function ResultsPage() {
    const [results, setResults] = useState([
        {
            id: 1,
            examName: "Data Structures Final",
            date: "2024-01-10",
            score: 84,
            totalQuestions: 50,
            correctAnswers: 42,
            timeTaken: "55 min",
            integrityScore: 0.95,
            flaggedIncidents: 0,
            status: "passed"
        },
        {
            id: 2,
            examName: "Algorithms Midterm",
            date: "2024-01-05",
            score: 78,
            totalQuestions: 40,
            correctAnswers: 31,
            timeTaken: "48 min",
            integrityScore: 0.88,
            flaggedIncidents: 2,
            status: "passed"
        },
        {
            id: 3,
            examName: "Database Systems Quiz",
            date: "2024-01-02",
            score: 92,
            totalQuestions: 30,
            correctAnswers: 28,
            timeTaken: "25 min",
            integrityScore: 0.98,
            flaggedIncidents: 0,
            status: "passed"
        }
    ]);

    const [selectedResult, setSelectedResult] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const userName = localStorage.getItem("user_name") || "Student";

    const viewDetails = (result) => {
        setSelectedResult(result);
        setShowDetailModal(true);
    };

    const averageScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
    const averageIntegrity = (results.reduce((sum, r) => sum + r.integrityScore, 0) / results.length);

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
            <Header userName={userName} userRole="student" />

            <main className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Exam Results 📊</h1>
                    <p className="text-gray-400">View your exam performance and integrity scores</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-gradient">
                        <div className="text-sm text-gray-400 mb-2">Total Exams</div>
                        <div className="text-4xl font-bold text-white mb-2">{results.length}</div>
                        <div className="text-sm text-green-400">All completed</div>
                    </div>
                    <div className="card-gradient">
                        <div className="text-sm text-gray-400 mb-2">Average Score</div>
                        <div className="text-4xl font-bold text-white mb-2">{averageScore}%</div>
                        <div className="text-sm text-green-400">+5% from last month</div>
                    </div>
                    <div className="card-gradient">
                        <div className="text-sm text-gray-400 mb-2">Integrity Score</div>
                        <div className="flex items-center gap-4">
                            <RiskScoreIndicator score={1 - averageIntegrity} size="md" showLabel={false} />
                            <div>
                                <div className="text-3xl font-bold text-green-400">
                                    {Math.round(averageIntegrity * 100)}%
                                </div>
                                <div className="text-sm text-gray-400">Excellent</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="card-gradient">
                    <h2 className="text-2xl font-bold text-white mb-6">Exam History</h2>

                    <div className="space-y-4">
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="card hover:border-purple-500 cursor-pointer transition-all"
                                onClick={() => viewDetails(result)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {result.examName}
                                            </h3>
                                            <span className={`badge ${result.score >= 80 ? 'badge-success' :
                                                    result.score >= 60 ? 'badge-warning' : 'badge-danger'
                                                }`}>
                                                {result.score}%
                                            </span>
                                            {result.integrityScore >= 0.9 && (
                                                <span className="badge badge-success">✓ Clean</span>
                                            )}
                                            {result.flaggedIncidents > 0 && (
                                                <span className="badge badge-warning">
                                                    {result.flaggedIncidents} incidents
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span>📅 {result.date}</span>
                                            <span>✓ {result.correctAnswers}/{result.totalQuestions} correct</span>
                                            <span>⏱️ {result.timeTaken}</span>
                                            <span>🔒 Integrity: {Math.round(result.integrityScore * 100)}%</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm ml-4">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {results.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-400">No exam results yet</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {selectedResult && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title={selectedResult.examName}
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Score Overview */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="card text-center">
                                <div className="text-sm text-gray-400 mb-2">Your Score</div>
                                <div className="text-4xl font-bold text-white mb-1">
                                    {selectedResult.score}%
                                </div>
                                <div className="text-sm text-gray-400">
                                    {selectedResult.correctAnswers}/{selectedResult.totalQuestions} correct
                                </div>
                            </div>
                            <div className="card text-center">
                                <div className="text-sm text-gray-400 mb-2">Integrity Score</div>
                                <div className="flex justify-center mb-2">
                                    <RiskScoreIndicator
                                        score={1 - selectedResult.integrityScore}
                                        size="sm"
                                        showLabel={false}
                                    />
                                </div>
                                <div className="text-sm text-green-400">
                                    {Math.round(selectedResult.integrityScore * 100)}% - Excellent
                                </div>
                            </div>
                        </div>

                        {/* Performance Breakdown */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">📊 Performance Breakdown</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Correct Answers</span>
                                        <span className="text-white font-medium">
                                            {selectedResult.correctAnswers}/{selectedResult.totalQuestions}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(selectedResult.correctAnswers / selectedResult.totalQuestions) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Time Taken:</span>
                                        <span className="text-white">{selectedResult.timeTaken}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="text-white">{selectedResult.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Integrity Report */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">🔒 Integrity Report</h3>
                            {selectedResult.flaggedIncidents === 0 ? (
                                <div className="alert alert-success">
                                    <span>✓</span>
                                    <div>
                                        <p className="font-medium">No Issues Detected</p>
                                        <p className="text-sm">
                                            Your behavior was consistent with your baseline profile throughout the exam.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-warning">
                                    <span>⚠️</span>
                                    <div>
                                        <p className="font-medium">{selectedResult.flaggedIncidents} Minor Incidents</p>
                                        <p className="text-sm">
                                            Some minor deviations were detected but did not affect your overall integrity score.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="btn btn-secondary flex-1">
                                📄 Download Report
                            </button>
                            <button className="btn btn-primary flex-1">
                                📧 Email Results
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
