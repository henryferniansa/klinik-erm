import axios from "axios";

const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

const api = axios.create({
  baseURL: isDemoMode
    ? "/mock"
    : (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { isDemoMode };
export default api;
// Tambah di akhir api.ts
import { mockApi } from "./mockApi";

export const getApi = () => (isDemoMode ? mockApi : api);
