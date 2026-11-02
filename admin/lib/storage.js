/**
 * Client-Side Persistent Storage Helper
 * Ensures all content edited in the Admin Panel persists across page refreshes
 * even when the backend server is offline or reconnecting.
 */

export function getLocalItem(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function saveLocalItem(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_) {}
}

export function removeLocalItem(key) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (_) {}
}
