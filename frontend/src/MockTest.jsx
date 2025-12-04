import React, { useEffect, useState } from "react";
import startEventCapture from "./EventCapture";

export default function MockTest() {
  const [mouseData, setMouseData] = useState({});
  const [keyData, setKeyData] = useState("");
  const [windowStatus, setWindowStatus] = useState("");

  useEffect(() => {
    // Track local UI logs instead of sending to backend
    document.addEventListener("mousemove", (e) => {
      setMouseData({ x: e.clientX, y: e.clientY });
    });

    document.addEventListener("keydown", (e) => {
      setKeyData(e.key);
    });

    window.addEventListener("blur", () => {
      setWindowStatus("🔴 Window Inactive");
    });

    window.addEventListener("focus", () => {
      setWindowStatus("🟢 Window Active");
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mock Test — Behavior Tracking</h1>

      <h3>Mouse Position:</h3>
      <p>X: {mouseData.x} | Y: {mouseData.y}</p>

      <h3>Last Key Pressed:</h3>
      <p>{keyData}</p>

      <h3>Window Status:</h3>
      <p>{windowStatus}</p>

      <p style={{ marginTop: 30, opacity: 0.6 }}>
        Move your mouse, type keys, or switch tabs…
      </p>
    </div>
  );
}
