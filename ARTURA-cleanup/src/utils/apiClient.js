import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const API_TOKEN_LS_KEY = "token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Memuat token secara realtime setiap kali ada request tanpa hardcode
apiClient.interceptors.request.use(async (config) => {
  const token =
    localStorage.getItem(API_TOKEN_LS_KEY) ||
    localStorage.getItem("artura.sanctum.token.v2");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;