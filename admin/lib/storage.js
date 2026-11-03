/**
 * Client-Side Persistent Storage Helper
 * Ensures all content edited in the Admin Panel persists across page refreshes
 * and broadcasts live updates to the public website without page reload.
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
    notifyWebsiteLiveUpdate(key, data);
  } catch (_) {}
}

export function removeLocalItem(key) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (_) {}
}

/**
 * Broadcasts changes made in the Admin Console to the Website in real-time
 * using modern Web BroadcastChannel and localStorage events.
 */
export function notifyWebsiteLiveUpdate(domain, payload = null) {
  if (typeof window === "undefined") return;
  const eventData = { domain, payload, timestamp: Date.now() };

  // 1. BroadcastChannel across all browser tabs of same origin
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("dezoryn_live_sync");
      bc.postMessage(eventData);
      setTimeout(() => {
        try {
          bc.close();
        } catch (_) {}
      }, 500);
    }
  } catch (_) {}

  // 2. LocalStorage trigger (fires native window "storage" event across all tabs/windows)
  try {
    localStorage.setItem("dezoryn_live_sync_event", JSON.stringify(eventData));
  } catch (_) {}
}
