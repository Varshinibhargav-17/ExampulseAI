// src/behavior/typing.js
// Plain JS typing tracker (copy exactly)

import { socket } from "../socket";
import api from "../api";

const SEND_INTERVAL_MS = 3000;
const IDLE_TIMEOUT_MS = 2000;
const WINDOW_MS = 15000;
const CHAR_TO_WORD = 5;

let charBuffer = [];
let lastKeystroke = 0;
let timerId = null;
let running = false;
let currentUserId = null;
let currentExamId = null;

function now(){ return Date.now(); }

function recordKeystroke(count = 1){
  charBuffer.push({ ts: now(), c: count });
  lastKeystroke = now();
  if (!timerId) startTimer();
}

function pruneBuffer(){
  const cutoff = now() - Math.max(WINDOW_MS, 60000);
  charBuffer = charBuffer.filter(e => e.ts >= cutoff);
}

function computeWPM(windowMs = WINDOW_MS){
  const cutoff = now() - windowMs;
  let totalChars = 0;
  for (let i = charBuffer.length - 1; i >= 0; --i){
    if (charBuffer[i].ts < cutoff) break;
    totalChars += charBuffer[i].c;
  }
  const minutes = windowMs / 60000;
  const words = totalChars / CHAR_TO_WORD;
  const wpm = minutes > 0 ? words / minutes : 0;
  return Math.round(wpm * 100) / 100;
}

async function sendTypingSample(){
  if (!currentUserId || !currentExamId) return;
  pruneBuffer();
  const idle = now() - lastKeystroke > IDLE_TIMEOUT_MS;
  if (!running && idle) return;

  const wpm = computeWPM(WINDOW_MS);
  const payload = {
    user_id: currentUserId,
    exam_id: currentExamId,
    wpm,
    ts: now(),
    sample_window_ms: WINDOW_MS,
    buffer_size: charBuffer.length
  };

  try {
    if (socket && socket.connected) {
      socket.emit("behavior_event", {
        user_id: currentUserId,
        exam_id: currentExamId,
        event_type: "typing",
        payload,
        ts: payload.ts
      });
    } else if (api && typeof api.sendKey === "function"){
      await api.sendKey({ user_id: currentUserId, exam_id: currentExamId, wpm, ts: payload.ts });
    }
  } catch (err) {
    console.warn("typing send failed", err);
  }

  if (idle) running = false;
}

function startTimer(){
  if (timerId) return;
  timerId = setInterval(() => {
    if (now() - lastKeystroke > IDLE_TIMEOUT_MS) {
      sendTypingSample().finally(() => stopTimer());
    } else {
      sendTypingSample();
    }
  }, SEND_INTERVAL_MS);
}

function stopTimer(){
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
}

function onKeydown(e){
  if (e.key.length > 1 && e.key !== " " && e.key !== "Enter") {
    if (!["Enter"," "].includes(e.key)) return;
  }
  recordKeystroke(1);
  running = true;
}

export function startTypingTracker({ user_id, exam_id }){
  currentUserId = user_id;
  currentExamId = exam_id;
  lastKeystroke = 0;
  charBuffer = [];
  running = true;
  window.addEventListener("keydown", onKeydown, { passive: true });
  startTimer();
  console.log("[typing] started for", user_id, "exam", exam_id);
}

export function stopTypingTracker(){
  window.removeEventListener("keydown", onKeydown);
  stopTimer();
  charBuffer = [];
  running = false;
  currentUserId = null;
  currentExamId = null;
  lastKeystroke = 0;
  console.log("[typing] stopped");
}
