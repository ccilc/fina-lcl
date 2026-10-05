import axios from "axios";

const baseURL = process.env.VUE_APP_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attache automatiquement le token admin s'il existe (espace back-office)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cfc_admin_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
