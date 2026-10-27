"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full ${maxWidth} rounded-2xl border border-slate-200 bg-white shadow-2xl relative max-h-[92vh] flex flex-col text-left`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-slate-900 font-exo">
              {title}
            </h3>
            {subtitle && (
              typeof subtitle === "string" ? (
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
              ) : (
                <div className="mt-1">{subtitle}</div>
              )
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition shrink-0"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1 [scrollbar-width:thin]">
          {children}
        </div>

        {footer && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 rounded-b-2xl shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
