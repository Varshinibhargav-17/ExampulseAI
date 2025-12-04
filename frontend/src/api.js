import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const sendMouse = (data) => axios.post(`${API_URL}/mouse`, data);
export const sendKey = (data) => axios.post(`${API_URL}/keystroke`, data);
export const sendWindowEvent = (data) => axios.post(`${API_URL}/window`, data);

