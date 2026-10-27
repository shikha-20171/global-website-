"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

const PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "This Year", value: "ytd" },
  { label: "All Time", value: "all" },
];

export default function AdminDateRangePicker({
  value = "30d",
  onChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const activePreset =
    PRESETS.find((p) => p.value === selected) || PRESETS[2];

  const handleSelect = (val) => {
    setSelected(val);
    setIsOpen(false);
    if (onChange) onChange(val);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
      >
        <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
        <span>{activePreset.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Select Timeframe
            </div>
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleSelect(preset.value)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                  selected === preset.value
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{preset.label}</span>
                {selected === preset.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
