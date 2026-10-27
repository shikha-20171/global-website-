"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  info: "border-electric/30 bg-electric/10 text-electric",
};

export default function AdminToast({
  show = true,
  type = "success", // 'success' | 'warning' | 'error' | 'info'
  message = "",
  description = "",
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (!show) return;

    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!visible || !message) return null;

  const Icon = ICONS[type] || ICONS.info;
  const style = STYLES[type] || STYLES.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md bg-graphite/95 shadow-xl ${style}`}
      >
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white leading-tight">
            {message}
          </p>
          {description && (
            <p className="text-[11px] text-cool/90 mt-1 leading-normal">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-cool hover:text-white transition p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
