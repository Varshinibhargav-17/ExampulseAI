// src/socket.js
import { io } from "socket.io-client";

const WS_BASE = import.meta.env.VITE_WS_URL || "http://localhost:5000";

// single shared socket instance for the whole app
export const socket = io(WS_BASE, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnectionAttempts: 3
});

socket.on("connect", () => console.log("[socket] connected", socket.id));
socket.on("disconnect", (r) => console.log("[socket] disconnected", r));
socket.on("event_received", (d) => console.log("[socket] event_received:", d));
socket.on("alert", (a) => console.log("[socket] alert:", a));
