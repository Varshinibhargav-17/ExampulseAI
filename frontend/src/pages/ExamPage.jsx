// src/pages/ExamPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startTypingTracker, stopTypingTracker } from "../behavior/typing";
import { socket } from "../socket";
import Modal from "../components/Modal";

export default function ExamPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user_id = (location.state && location.state.user_id) || Number(localStorage.getItem("user_id")) || 1;
  const exam_id = (location.state && location.state.exam_id) || Number(localStorage.getItem("exam_id")) || 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Mock questions - in production, fetch from API
  const questions = [
    {
      id: 1,
      text: "What is the time complexity of Binary Search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    },
    {
      id: 2,
      text: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Tree", "Graph"],
    },
    {
      id: 3,
      text: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    },
    // Add more questions as needed
  ];

  useEffect(() => {
    // Join exam room via socket
    if (socket && socket.connected) {
      socket.emit("join_exam", { user_id, exam_id, role: "student" });
    }

    // Start typing tracker
    startTypingTracker({ user_id, exam_id });

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Track window blur (tab switching)
    const handleBlur = () => {
      setTabSwitches((prev) => prev + 1);
      if (tabSwitches >= 2) {
        setWarningMessage("⚠️ Multiple tab switches detected. Please remain on this page.");
        setShowWarning(true);

        // Emit warning to backend
        socket.emit("suspicious_activity", {
          user_id,
          exam_id,
          type: "tab_switch",
          count: tabSwitches + 1
        });
      }
    };

    // Track copy-paste attempts
    const handleCopy = (e) => {
      e.preventDefault();
      setWarningMessage("⚠️ Copy action detected. This incident has been logged.");
      setShowWarning(true);
      socket.emit("suspicious_activity", {
        user_id,
        exam_id,
        type: "copy_attempt"
      });
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setWarningMessage("⚠️ Paste action detected. This incident has been logged.");
      setShowWarning(true);
      socket.emit("suspicious_activity", {
        user_id,
        exam_id,
        type: "paste_attempt"
      });
    };

    // Prevent right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      clearInterval(timer);
      stopTypingTracker();
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [user_id, exam_id, tabSwitches]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleFlagQuestion = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlagged(newFlagged);
  };

  const handleSubmitExam = () => {
    // Submit exam to backend
    socket.emit("submit_exam", {
      user_id,
      exam_id,
      answers,
      time_taken: 3600 - timeRemaining
    });

    stopTypingTracker();
    navigate("/exam-submitted", { state: { exam_id } });
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(240, 10%, 3.9%) 0%, hsl(250, 20%, 8%) 100%)' }}>
      {/* Exam Header */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-opacity-90" style={{ background: 'rgba(15, 15, 20, 0.9)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl">
                📝
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Data Structures Final</h1>
                <p className="text-xs text-gray-400">Exam ID: {exam_id}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Progress */}
              <div className="hidden md:block">
                <div className="text-sm text-gray-400 mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {answeredCount}/{questions.length}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold ${timeRemaining < 300 ? 'bg-red-900 text-red-200' : 'bg-gray-800 text-white'
                }`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="card-gradient mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="badge badge-primary">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                {flagged.has(currentQuestion) && (
                  <span className="badge badge-warning">🚩 Flagged</span>
                )}
              </div>
              <button
                onClick={handleFlagQuestion}
                className={`btn btn-sm ${flagged.has(currentQuestion) ? 'btn-warning' : 'btn-ghost'}`}
              >
                {flagged.has(currentQuestion) ? '🚩 Unflag' : '🚩 Flag'}
              </button>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-6">
              {questions[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`option-button ${answers[currentQuestion] === index ? 'selected' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                    }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${index === currentQuestion
                      ? 'bg-purple-600 text-white'
                      : answers[index] !== undefined
                        ? 'bg-green-900 text-green-200'
                        : 'bg-gray-800 text-gray-400'
                    } ${flagged.has(index) ? 'ring-2 ring-yellow-500' : ''}`}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-success"
              >
                Submit Exam ✓
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                className="btn btn-primary"
              >
                Next →
              </button>
            )}
          </div>

          {/* Status Bar */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="card text-center">
              <div className="text-sm text-gray-400 mb-1">Answered</div>
              <div className="text-2xl font-bold text-green-400">{answeredCount}</div>
            </div>
            <div className="card text-center">
              <div className="text-sm text-gray-400 mb-1">Flagged</div>
              <div className="text-2xl font-bold text-yellow-400">{flagged.size}</div>
            </div>
            <div className="card text-center">
              <div className="text-sm text-gray-400 mb-1">Remaining</div>
              <div className="text-2xl font-bold text-gray-400">
                {questions.length - answeredCount}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Warning Modal */}
      {showWarning && (
        <Modal
          isOpen={showWarning}
          onClose={() => setShowWarning(false)}
          title="⚠️ Warning"
          size="sm"
        >
          <div className="alert alert-warning mb-4">
            <span>⚠️</span>
            <p>{warningMessage}</p>
          </div>
          <p className="text-gray-300 mb-4">
            This incident has been logged and will be reviewed by the proctor.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="btn btn-primary w-full"
          >
            I Understand
          </button>
        </Modal>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit Exam"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to submit your exam?
            </p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Answered</div>
                <div className="text-xl font-bold text-white">{answeredCount}/{questions.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Flagged</div>
                <div className="text-xl font-bold text-yellow-400">{flagged.size}</div>
              </div>
            </div>
            {answeredCount < questions.length && (
              <div className="alert alert-warning">
                <span>⚠️</span>
                <p>You have {questions.length - answeredCount} unanswered questions.</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary flex-1"
              >
                Review
              </button>
              <button
                onClick={handleSubmitExam}
                className="btn btn-success flex-1"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
