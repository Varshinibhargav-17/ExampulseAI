import React, { useEffect, useState } from "react";
import startEventCapture, { nextQuestion } from "./EventCapture";

const questions = [
  "What is the capital of France?",
  "Who wrote Romeo and Juliet?",
  "What is the chemical symbol for Gold?",
  "In what year did World War II end?",
  "What is the largest planet in our solar system?"
];

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    startEventCapture();
  }, []);

  const handleNextQuestion = () => {
    // Call the EventCapture function to log the time spent on this question
    nextQuestion();
    
    console.log(`Question ${currentQuestionIndex + 1} Answer: ${answer}`);
    
    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Assessment Complete!</h1>
        <p>All {questions.length} questions answered.</p>
        <p>Your behavioral data has been captured and sent to the server.</p>
        <button 
          onClick={() => {
            setCurrentQuestionIndex(0);
            setAnswer("");
            setShowResults(false);
          }}
          style={{ padding: "10px 20px", marginTop: 20 }}
        >
          Restart Assessment
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: "800px", margin: "0 auto" }}>
      <h1>Assessment Page</h1>
      <div style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "15px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <p style={{ margin: "0 0 10px 0", color: "#666" }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 style={{ margin: 0 }}>{questions[currentQuestionIndex]}</h2>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ 
          width: "100%", 
          height: "200px",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box"
        }}
        placeholder="Type your answer here..."
      />

      <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
        <button
          onClick={handleNextQuestion}
          style={{ 
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit Assessment" : "Next Question"}
        </button>
        <p style={{ margin: "10px 0 0 10px", color: "#666" }}>
          ✓ Behavioral data is being tracked and will be sent to server
        </p>
      </div>
    </div>
  );
}
