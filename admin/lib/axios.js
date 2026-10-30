import axios from "axios";

/**
 * Resolves the active Backend Base URL for the Admin Console:
 * 1. URL search params in browser (?api_url=... or ?backend=...)
 * 2. localStorage custom override ("dezoryn_backend_url")
 * 3. Environment variables (NEXT_PUBLIC_API_URL, RENDER_URL, etc.)
 * 4. Local development server fallback (http://localhost:5001)
 */
export function getAdminApiBase() {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramUrl = params.get("api_url") || params.get("backend");
      if (paramUrl) {
        localStorage.setItem("dezoryn_backend_url", paramUrl);
        return paramUrl.replace(/\/+$/, "");
      }
      const custom = localStorage.getItem("dezoryn_backend_url");
      if (custom) return custom.replace(/\/+$/, "");
    } catch (_) {}
  }

  const envUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_RENDER_URL ||
    process.env.BACKEND_URL ||
    process.env.RENDER_URL ||
    process.env.API_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    ""
  ).trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "";
    }
  }

  if (typeof window === "undefined" && (process.env.VERCEL || process.env.NODE_ENV === "production")) {
    return "";
  }

  return "http://localhost:5001";
}

// Centralized Axios instance for DEZORYN TECHNOLOGY Admin Console
export const api = axios.create({
  baseURL: getAdminApiBase() || undefined,
  timeout: 55000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to dynamically update baseURL and attach Bearer token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const activeBase = getAdminApiBase();
    if (activeBase && !config.url?.startsWith("http")) {
      config.baseURL = activeBase;
    } else if (!activeBase && !config.url?.startsWith("http")) {
      config.baseURL = "";
    }
    const token = sessionStorage.getItem("dezoryn_admin_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for consistent error extraction and 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Admin API network error";
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      if (!window.location.pathname.includes("/login")) {
        sessionStorage.removeItem("dezoryn_admin_token");
        sessionStorage.removeItem("dezoryn_admin_user");
        window.location.href = "/login";
      }
    }

    const customError = new Error(message);
    customError.status = status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const adminApiClient = api;
export default api;
