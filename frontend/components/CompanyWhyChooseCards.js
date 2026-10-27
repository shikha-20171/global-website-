"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompanyWhyChooseCards({ items }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mousePositions, setMousePositions] = useState({});

  const handleMouseMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePositions((prev) => ({
      ...prev,
      [idx]: { x, y },
    }));
  };

  return (
    <div
      className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      onMouseLeave={() => {
        setHoveredIdx(null);
        setMousePositions({});
      }}
    >
      {items.map((w, idx) => {
        const isHovered = hoveredIdx === idx;
        const isOtherHovered = hoveredIdx !== null && !isHovered;
        const pos = mousePositions[idx] || { x: 150, y: 150 };

        return (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="h-full"
          >
            <div
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-all duration-300 ${
                isHovered
                  ? "z-20 -translate-y-3 scale-[1.03] border-[#60a5fa] bg-[#081226] shadow-[0_25px_60px_-10px_rgba(37,99,235,0.7),0_0_40px_rgba(59,130,246,0.55),inset_0_0_25px_rgba(59,130,246,0.25)] ring-1 ring-[#93c5fd]/50"
                  : isOtherHovered
                  ? "z-10 border-white/5 bg-[#060a14]/60 opacity-40 scale-[0.98]"
                  : "z-10 border-white/10 bg-[#070b16] shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-white/20"
              }`}
            >
              {/* Dynamic Real-Time Cursor Spotlight Following Mouse */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(96, 165, 250, 0.35), rgba(37, 99, 235, 0.18) 45%, transparent 75%)`,
                }}
              />

              {/* Ambient Background Aura */}
              <div
                className={`pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-[#2563eb]/30 blur-3xl transition-all duration-500 ${
                  isHovered ? "opacity-100 scale-125" : "opacity-0 scale-75"
                }`}
              />

              {/* Top Bright Laser Neon Beam */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#93c5fd] via-[#60a5fa] to-transparent shadow-[0_0_18px_#60a5fa] transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Left Edge Vertical Neon Accent */}
              <div
                className={`pointer-events-none absolute left-0 inset-y-0 w-[2.5px] bg-gradient-to-b from-transparent via-[#60a5fa] to-transparent shadow-[0_0_14px_#3b82f6] transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Floating Luminous Watermark Number */}
              <div
                className={`pointer-events-none absolute right-3 -bottom-2 text-7xl font-mono font-black transition-all duration-500 select-none ${
                  isHovered
                    ? "text-[#3b82f6]/25 scale-125 translate-x-1 -translate-y-1 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    : "text-white/[0.03] scale-100"
                }`}
              >
                0{idx + 1}
              </div>

              {/* Card Body */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono font-bold text-sm transition-all duration-300 ${
                      isHovered
                        ? "bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] text-white shadow-[0_0_25px_rgba(59,130,246,0.95)] scale-110 border border-[#93c5fd]"
                        : "border border-electric/30 bg-electric/15 text-electric"
                    }`}
                  >
                    0{idx + 1}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-mono transition-all duration-300 ${
                      isHovered
                        ? "border border-[#60a5fa]/60 bg-[#1d4ed8]/40 text-[#93c5fd] shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                        : "border border-white/5 bg-white/[0.03] text-cool/60"
                    }`}
                  >
                    Pillar 0{idx + 1}
                  </span>
                </div>

                <h3
                  className={`font-bold text-lg leading-snug transition-all duration-300 ${
                    isHovered
                      ? "text-white drop-shadow-[0_0_18px_rgba(96,165,250,0.8)]"
                      : "text-white/95"
                  }`}
                >
                  {w.title}
                </h3>

                <p
                  className={`mt-3 text-xs leading-relaxed transition-colors duration-300 ${
                    isHovered ? "text-[#e2e8f0]" : "text-cool"
                  }`}
                >
                  {w.desc}
                </p>
              </div>

              {/* Bottom Interactive Link Accent */}
              <div
                className={`relative z-10 mt-8 pt-4 border-t flex items-center justify-between text-xs font-semibold transition-all duration-300 ${
                  isHovered
                    ? "border-[#60a5fa]/40 text-[#93c5fd]"
                    : "border-white/5 text-cool/50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      isHovered
                        ? "bg-[#60a5fa] shadow-[0_0_8px_#60a5fa] scale-125"
                        : "bg-cool/40"
                    }`}
                  />
                  <span>Enterprise Grade</span>
                </span>
                <ArrowRight
                  size={14}
                  className={`transition-all duration-300 ${
                    isHovered
                      ? "translate-x-1.5 text-white"
                      : "text-cool/40"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
