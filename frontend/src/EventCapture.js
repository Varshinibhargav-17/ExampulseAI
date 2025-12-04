import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function startEventcapture() {
  document.addEventListener("mousemove", (e) => {
    axios.post(`${API_URL}/mouse`, {
      x: e.clientX,
      y: e.clientY,
      t: Date.now()
    });
  });

  document.addEventListener("keydown", (e) => {
    axios.post(`${API_URL}/keystroke`, {
      key: e.key,
      t: Date.now()
    });
  });

  window.addEventListener("blur", () => {
    axios.post(`${API_URL}/window`, {
      status: "blur",
      t: Date.now()
    });
  });

  window.addEventListener("focus", () => {
    axios.post(`${API_URL}/window`, {
      status: "focus",
      t: Date.now()
    });
  });
}
