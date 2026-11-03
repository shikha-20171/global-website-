import axios from "axios";

/**
 * Resolves the active Backend Base URL:
 * 1. URL search params in browser (?api_url=... or ?backend=...)
 * 2. localStorage custom override ("dezoryn_backend_url")
 * 3. Environment variables (NEXT_PUBLIC_API_URL, RENDER_URL, etc.)
 * 4. Local development server fallback (http://127.0.0.1:5001)
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramUrl = params.get("api_url") || params.get("backend");
      if (paramUrl && !paramUrl.includes(":5001")) {
        localStorage.setItem("dezoryn_backend_url", paramUrl);
        return paramUrl.replace(/\/+$/, "");
      }
      const custom = localStorage.getItem("dezoryn_backend_url");
      if (custom && !custom.includes(":5001")) return custom.replace(/\/+$/, "");
    } catch (_) {}
  }

  const envUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_RENDER_URL ||
    process.env.BACKEND_URL ||
    process.env.RENDER_URL ||
    process.env.RENDER_BACKEND_URL ||
    process.env.API_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    ""
  ).trim();

  if (envUrl && !envUrl.includes(":5001")) {
    return envUrl.replace(/\/+$/, "");
  }

  // In browser and server, relative URL / direct route
  return "";
}

/**
 * Central Axios Instance for all frontend pages and components
 */
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Dynamic interceptor to ensure requests always use current base URL
api.interceptors.request.use((config) => {
  const currentBase = getBaseUrl();
  if (currentBase && (!config.baseURL || config.baseURL === "")) {
    config.baseURL = currentBase;
  }
  return config;
});

export default api;

