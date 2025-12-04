// src/api.js
import axios from "axios";
import { socket } from "./socket"; // shared socket instance
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Helper: emit a behavior_event over socket and wait for ack (event_received).
 * Expects `payload` to already include user_id and exam_id (or they are passed separately).
 * Returns a Promise that resolves with the ack object or rejects on timeout/error.
 */
function emitBehaviorEvent(eventType, payload = {}, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    try {
      const message = {
        user_id: payload.user_id,
        exam_id: payload.exam_id,
        event_type: eventType,
        payload
      };

      if (socket && socket.connected) {
        // create a one-time ack listener
        const onAck = (ack) => {
          // ack could be for any event; we resolve on first ack received
          cleanup();
          resolve(ack);
        };

        const onDisconnect = () => {
          cleanup();
          // fallback to REST if socket disconnected
          fallbackPost(message).then(resolve).catch(reject);
        };

        const cleanup = () => {
          socket.off("event_received", onAck);
          socket.off("disconnect", onDisconnect);
          clearTimeout(timer);
        };

        socket.on("event_received", onAck);
        socket.on("disconnect", onDisconnect);
        socket.emit("behavior_event", message);

        const timer = setTimeout(() => {
          cleanup();
          // timeout: fallback to REST
          fallbackPost(message).then(resolve).catch(reject);
        }, timeoutMs);
        return;
      } else {
        // no socket: fallback to REST immediately
        fallbackPost(message).then(resolve).catch(reject);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fallback HTTP POST to /api/events (generic). The backend may not have this endpoint;
 * adjust if your backend exposes a different REST route for events.
 */
function fallbackPost(message) {
  // Backend REST shape: POST /api/events with body { user_id, exam_id, event_type, payload }
  return axios
    .post(`${API_URL}/api/events`, message)
    .then((r) => r.data)
    .catch((err) => {
      // Re-throw so callers can handle it
      throw err;
    });
}

/**
 * Existing functions (mouse, keystroke, window). Each expects `data` to include:
 * { user_id, exam_id, ...payload fields... }
 *
 * They will attempt to send via socket (event_type: mouse_move / keystroke / window_blur etc.)
 * and fallback to REST POST if socket not connected.
 */

// Example: send mouse movement / aggregated mouse event
export const sendMouse = (data) => {
  // define event_type and payload structure
  const payload = {
    x: data.x,
    y: data.y,
    ts: data.ts || Date.now(),
    // include any additional fields the frontend collects
    ...(data.extra || {})
  };
  // include user_id and exam_id at top-level for our socket contract
  payload.user_id = data.user_id;
  payload.exam_id = data.exam_id;

  return emitBehaviorEvent("mouse_move", payload);
};

// Example: send keystroke event / typing sample
export const sendKey = (data) => {
  // data should include typing summary or single keystroke info
  const payload = {
    key: data.key,            // optional
    typing_chunk: data.chunk, // optional aggregated chunk
    wpm: data.wpm,            // if available (useful)
    ts: data.ts || Date.now(),
    ...(data.extra || {})
  };
  payload.user_id = data.user_id;
  payload.exam_id = data.exam_id;

  // If sending raw keystrokes frequently, consider batching on frontend.
  return emitBehaviorEvent("typing", payload);
};

// Example: send window events (blur/focus)
export const sendWindowEvent = (data) => {
  // data: { user_id, exam_id, event: "blur"|"focus", duration_seconds }
  const payload = {
    event: data.event,
    duration_seconds: data.duration_seconds || 0,
    ts: data.ts || Date.now(),
    ...(data.extra || {})
  };
  payload.user_id = data.user_id;
  payload.exam_id = data.exam_id;

  // Use event type 'window_blur' for blur with duration; 'window_focus' for focus if desired
  const eventType = data.event === "blur" ? "window_blur" : "window_focus";
  return emitBehaviorEvent(eventType, payload);
};

/* ------------------------------------------------------------------
   Baseline REST helpers
   These use axios against the backend baseline endpoints we defined:
   POST /api/baselines/create
   POST /api/baselines/:user_id/merge
   GET  /api/baselines/:user_id
   GET  /api/baselines/
   ------------------------------------------------------------------ */

export const createBaseline = (userId, features) => {
  return axios
    .post(`${API_URL}/api/baselines/create`, { user_id: userId, features })
    .then((r) => r.data);
};

export const mergeBaseline = (userId, features) => {
  return axios
    .post(`${API_URL}/api/baselines/${userId}/merge`, { features })
    .then((r) => r.data);
};

export const getBaseline = (userId) => {
  return axios.get(`${API_URL}/api/baselines/${userId}`).then((r) => r.data);
};

export const listBaselines = () => {
  return axios.get(`${API_URL}/api/baselines/`).then((r) => r.data);
};

/* ------------------------------------------------------------------
  Convenience export default (optional)
  ------------------------------------------------------------------ */

const api = {
  sendMouse,
  sendKey,
  sendWindowEvent,
  createBaseline,
  mergeBaseline,
  getBaseline,
  listBaselines
};

export default api;


