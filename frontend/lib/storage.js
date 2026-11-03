/**
 * Client-Side Persistent Storage Helper for Website
 * Reflects live content overrides from Admin Console in browser
 * and receives real-time live sync broadcasts from the Admin Console.
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
