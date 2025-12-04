import React, { useEffect } from "react";
import startEventCapture from "./EventCapture";

function AssessmentPage() {
  useEffect(() => {
    startEventCapture();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Assessment Page</h1>
      <textarea
        style={{ width: "100%", height: "200px" }}
        placeholder="Start typing..."
      ></textarea>
    </div>
  );
}

export default AssessmentPage;

