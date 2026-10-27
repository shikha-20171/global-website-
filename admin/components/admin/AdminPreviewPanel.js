"use client";

import { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RotateCcw,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function AdminPreviewPanel({
  title = "Live Preview",
  previewUrl = "http://localhost:3000",
  children,
  device = "desktop",
  onDeviceChange,
}) {
  const [currentDevice, setCurrentDevice] = useState(device);
  const [key, setKey] = useState(0);

  const handleDevice = (d) => {
    setCurrentDevice(d);
    if (onDeviceChange) onDeviceChange(d);
  };

  const getDeviceWidth = () => {
    switch (currentDevice) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  return (
    <div className="rounded-xl border border-line bg-graphite/40 overflow-hidden flex flex-col">
      {/* Panel Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-midnight/80">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-electric" />
          <span className="text-xs font-semibold text-white">{title}</span>
          <span className="text-[10px] text-cool bg-white/[0.04] px-2 py-0.5 rounded-full border border-line">
            Frontend Mock Sandbox
          </span>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 bg-ink/60 border border-line rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => handleDevice("desktop")}
            className={`p-1.5 rounded transition ${
              currentDevice === "desktop"
                ? "bg-electric text-white"
                : "text-cool hover:text-white"
            }`}
            title="Desktop (1440px)"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDevice("tablet")}
            className={`p-1.5 rounded transition ${
              currentDevice === "tablet"
                ? "bg-electric text-white"
                : "text-cool hover:text-white"
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDevice("mobile")}
            className={`p-1.5 rounded transition ${
              currentDevice === "mobile"
                ? "bg-electric text-white"
                : "text-cool hover:text-white"
            }`}
            title="Mobile (390px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg border border-line text-cool hover:text-white hover:bg-white/[0.04] transition"
            title="Refresh preview"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-line text-[11px] text-cool hover:text-white hover:bg-white/[0.04] transition"
          >
            <span>Open Public Site</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Frame content */}
      <div className="p-4 sm:p-6 bg-ink/90 flex justify-center min-h-[420px] overflow-auto [scrollbar-width:thin]">
        <div
          key={key}
          className={`${getDeviceWidth()} w-full transition-all duration-300 rounded-xl border border-line bg-midnight shadow-2xl overflow-hidden`}
        >
          {children || (
            <div className="p-8 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-electric/10 text-electric mx-auto flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                Viewport Preview Container
              </h4>
              <p className="text-xs text-cool max-w-sm mx-auto">
                Content is displayed within the selected breakpoint simulating
                responsive public site presentation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
