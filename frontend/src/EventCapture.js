import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// =========================
// Data Stores
// =========================
let mousePositions = [];
let mouseSpeeds = [];
let lastMouse = null;

let idleStart = null;
let totalIdleTime = 0;

let keyCount = 0;
let backspaceCount = 0;
let copyCount = 0;
let pasteCount = 0;

let lastKeyTime = null;
let ikiList = []; // Inter-key intervals

let focusLossCount = 0;
let totalFocusLostTime = 0;
let lastFocusLostAt = null;

let questionStartTime = Date.now();
let questionTimes = [];
let answerChangeCount = 0;

let currentAnswer = "";
let questionIndex = 0;

// Emit every 3 seconds
setInterval(() => sendFeatures(), 3000);

// =========================
// 🖱 Mouse Tracking
// =========================
document.addEventListener("mousemove", (e) => {
  const now = Date.now();

  if (lastMouse) {
    const dt = (now - lastMouse.t) / 1000;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    mouseSpeeds.push(speed);
    mousePositions.push({ dx, dy });
  }

  lastMouse = { x: e.clientX, y: e.clientY, t: now };
});

// =========================
// ⌨ Keystroke Tracking
// =========================
document.addEventListener("keydown", (e) => {
  const now = Date.now();
  keyCount++;

  // inter-key interval
  if (lastKeyTime) ikiList.push(now - lastKeyTime);
  lastKeyTime = now;

  // detect copy/paste
  if (e.ctrlKey && e.key === "c") copyCount++;
  if (e.ctrlKey && e.key === "v") pasteCount++;

  // detect backspace usage
  if (e.key === "Backspace") backspaceCount++;

  // detect answer changes in textarea
  const input = document.querySelector("textarea");
  if (input) {
    if (input.value !== currentAnswer) {
      currentAnswer = input.value;
      answerChangeCount++;
    }
  }
});

// =========================
// 🔄 Window Focus Tracking
// =========================
window.addEventListener("blur", () => {
  focusLossCount++;
  lastFocusLostAt = Date.now();
});

window.addEventListener("focus", () => {
  if (lastFocusLostAt) {
    totalFocusLostTime += Date.now() - lastFocusLostAt;
    lastFocusLostAt = null;
  }
});

// =========================
// ⏱ Question Timing
// =========================
export function nextQuestion() {
  const now = Date.now();
  const timeSpent = now - questionStartTime;

  questionTimes.push(timeSpent);
  questionStartTime = now;
  questionIndex++;
}

// =========================
// 📤 Feature Computation
// =========================
function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0;
}

function std(arr) {
  if (!arr.length) return 0;
  const m = mean(arr);
  return Math.sqrt(mean(arr.map((v) => (v - m) ** 2)));
}

function totalDistanceTraveled() {
  return mousePositions.reduce((sum, p) => sum + Math.sqrt(p.dx ** 2 + p.dy ** 2), 0);
}

// =========================
// 🚀 Send Feature Packet
// =========================
function sendFeatures() {
  const now = Date.now();

  const features = {
    // --------------------------
    // 🖱 Mouse Features
    // --------------------------
    mouse_mean_speed: mean(mouseSpeeds),
    mouse_std_speed: std(mouseSpeeds),
    mouse_jerk: std(mouseSpeeds.map((v, i) => v - (mouseSpeeds[i - 1] || v))),
    mouse_idle_ratio: (now - (lastMouse?.t || now)) / (now - questionStartTime),
    mouse_total_distance: totalDistanceTraveled(),

    // --------------------------
    // ⌨ Keyboard Features
    // --------------------------
    typing_speed_wpm: keyCount / 5 / ((now - questionStartTime) / 60000),
    key_mean_iki: mean(ikiList),
    key_std_iki: std(ikiList),
    copy_frequency: copyCount,
    paste_frequency: pasteCount,
    backspace_frequency: backspaceCount,

    typing_burstiness: mean(ikiList) > 0 ? std(ikiList) / mean(ikiList) : 0,

    // --------------------------
    // 🔄 Window Activity
    // --------------------------
    tab_switches: focusLossCount,
    time_outside_window: totalFocusLostTime,

    // --------------------------
    // 📝 Answer Patterns
    // --------------------------
    time_per_question: mean(questionTimes),
    fast_answers: questionTimes.filter((t) => t < 2000).length,
    slow_answers: questionTimes.filter((t) => t > 20000).length,
    answer_change_frequency: answerChangeCount,
    skipping_patterns: questionTimes.filter((t) => t === 0).length,

    timestamp: now,
  };

  console.log("FEATURE PACKET:", features);

  axios.post(`${API_URL}/api/features`, features)
    .then(response => {
      console.log("✅ Features sent successfully:", response.data);
    })
    .catch(error => {
      console.error("❌ Error sending features:", error.message);
    });
}

// export for use in AssessmentPage
export default function startEventCapture() {
  console.log("Tracking Started...");
}
