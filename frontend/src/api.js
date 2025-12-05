// src/api.js
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * POST wrapper that returns response.data
 */
async function postJson(path, body) {
  const res = await axios.post(`${API}${path}`, body, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data;
}

/* -------------------------
   Event fallback helpers
   ------------------------- */
/**
 * Fallback HTTP POST for events if socket is unavailable.
 * Backend should accept POST /api/events as a generic event ingestion endpoint.
 */
export async function sendEventFallback(message) {
  return postJson("/api/events", message);
}

/* -------------------------
   Typing / keystroke helper
   ------------------------- */
export async function sendKey(data) {
  // data: { user_id, exam_id, wpm, ts, ... }
  // Try to post to a dedicated endpoint; change if your backend uses a different path
  return postJson("/api/events", {
    user_id: data.user_id,
    exam_id: data.exam_id,
    event_type: "typing",
    payload: {
      wpm: data.wpm,
      ts: data.ts
    }
  });
}

/* -------------------------
   Baseline helpers
   ------------------------- */
export async function createBaseline(userId, features) {
  return postJson("/api/baselines/create", { user_id: userId, features });
}

export async function mergeBaseline(userId, features) {
  return postJson(`/api/baselines/${userId}/merge`, { features });
}

export async function getBaseline(userId) {
  const res = await axios.get(`${API}/api/baselines/${userId}`);
  return res.data;
}

export async function listBaselines() {
  const res = await axios.get(`${API}/api/baselines/`);
  return res.data;
}

/* default export for convenience */
export default {
  sendEventFallback,
  sendKey,
  createBaseline,
  mergeBaseline,
  getBaseline,
  listBaselines
};
