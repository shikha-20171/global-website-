"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

export default function LiveSyncManager() {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let lastHandledTimestamp = 0;

    const handleLiveEvent = (eventData) => {
      if (!eventData || !eventData.timestamp) return;
      if (eventData.timestamp <= lastHandledTimestamp) return;
      lastHandledTimestamp = eventData.timestamp;

      // 1. Dispatch custom DOM event for client components to immediately update state
      window.dispatchEvent(
        new CustomEvent("dezoryn_live_update", { detail: eventData })
      );

      // 2. Silently revalidate all Next.js Server Components without full page reload
      router.refresh();

      // 3. Show non-intrusive notification indicator
      const domainLabel = eventData.domain ? String(eventData.domain).replace(/_/g, " ") : "Website";
      setToast({
        title: "Live Update Applied",
        message: `${domainLabel.charAt(0).toUpperCase() + domainLabel.slice(1)} synced from Admin Console.`,
      });

      setTimeout(() => {
        setToast(null);
      }, 3500);
    };

    // 1. BroadcastChannel Listener (across same-origin tabs)
    let bc = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("dezoryn_live_sync");
        bc.onmessage = (msg) => {
          if (msg?.data) handleLiveEvent(msg.data);
        };
      }
    } catch (_) {}

    // 2. Storage Event Listener (cross-tab and cross-window trigger)
    const handleStorage = (e) => {
      if (e.key === "dezoryn_live_sync_event" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          handleLiveEvent(data);
        } catch (_) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Periodic fast poll when tab is active (every 10 seconds) to ensure Neon updates reflect
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        router.refresh();
      }
    }, 12000);

    return () => {
      if (bc) {
        try {
          bc.close();
        } catch (_) {}
      }
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 z-[9999] flex items-center gap-2.5 rounded-xl border border-sky-400/30 bg-[#070e24]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-white"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
            <RefreshCw size={14} className="animate-spin text-sky-400" />
          </div>
          <div className="flex flex-col text-xs leading-tight">
            <span className="font-semibold text-white/95">{toast.title}</span>
            <span className="text-[11px] text-slate-300 mt-0.5">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

