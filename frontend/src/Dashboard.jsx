import React, { useEffect, useState } from "react";
import { socket } from "./websocket";

function Dashboard() {
  const [risk, setRisk] = useState(0);

  useEffect(() => {
    socket.on("risk_update", (data) => {
      setRisk(data.risk);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <h2>Live Risk Score: {risk}</h2>
    </div>
  );
}

export default Dashboard;
