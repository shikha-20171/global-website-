"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Database, Cloud, Star, Sparkles, Cpu, Layers } from "lucide-react";

const ICON_MAP = {
  Code2,
  Database,
  Cloud,
  Star,
};

const THEMES = [
  {
    // Frontend & Client
    label: "01 // CLIENT ENGINE",
    status: "Active Runtime",
    statusDot: "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
    laserGradient: "from-transparent via-cyan-400 via-blue-500 to-transparent",
    laserShadow: "shadow-[0_0_15px_#38bdf8]",
    cardBorder: "border-cyan-500/30 hover:border-cyan-400/80",
    glowColor: "rgba(56, 189, 248, 0.25)",
    ambientAura: "bg-gradient-to-br from-cyan-500/25 to-blue-600/20",
    iconContainer: "border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]",
    watermark: "text-cyan-500/10",
    titleGlow: "group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]",
    chipHover: "hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-100 hover:shadow-[0_0_12px_rgba(56,189,248,0.3)]",
  },
  {
    // Backend & Database
    label: "02 // DISTRIBUTED BACKBONE",
    status: "High-Throughput",
    statusDot: "bg-violet-400 shadow-[0_0_8px_#a78bfa]",
    laserGradient: "from-transparent via-violet-400 via-indigo-500 to-transparent",
    laserShadow: "shadow-[0_0_15px_#818cf8]",
    cardBorder: "border-violet-500/30 hover:border-violet-400/80",
    glowColor: "rgba(139, 92, 246, 0.25)",
    ambientAura: "bg-gradient-to-br from-violet-500/25 to-indigo-600/20",
    iconContainer: "border-violet-400/40 bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-transparent text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    watermark: "text-violet-500/10",
    titleGlow: "group-hover:text-violet-200 group-hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]",
    chipHover: "hover:border-violet-400/60 hover:bg-violet-500/15 hover:text-violet-100 hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]",
  },
  {
    // Cloud Platforms
    label: "03 // CLOUD INFRASTRUCTURE",
    status: "Multi-Region HA",
    statusDot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
    laserGradient: "from-transparent via-emerald-400 via-teal-500 to-transparent",
    laserShadow: "shadow-[0_0_15px_#34d399]",
    cardBorder: "border-emerald-500/30 hover:border-emerald-400/80",
    glowColor: "rgba(52, 211, 153, 0.25)",
    ambientAura: "bg-gradient-to-br from-emerald-500/25 to-teal-600/20",
    iconContainer: "border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    watermark: "text-emerald-500/10",
    titleGlow: "group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]",
    chipHover: "hover:border-emerald-400/60 hover:bg-emerald-500/15 hover:text-emerald-100 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)]",
  },
  {
    // AI & DevOps
    label: "04 // COGNITIVE & DEVOPS",
    status: "Autonomous AI",
    statusDot: "bg-pink-400 shadow-[0_0_8px_#f472b6]",
    laserGradient: "from-transparent via-pink-400 via-purple-500 to-transparent",
    laserShadow: "shadow-[0_0_15px_#ec4899]",
    cardBorder: "border-pink-500/30 hover:border-pink-400/80",
    glowColor: "rgba(236, 72, 153, 0.25)",
    ambientAura: "bg-gradient-to-br from-pink-500/25 to-purple-600/20",
    iconContainer: "border-pink-400/40 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-transparent text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    watermark: "text-pink-500/10",
    titleGlow: "group-hover:text-pink-200 group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]",
    chipHover: "hover:border-pink-400/60 hover:bg-pink-500/15 hover:text-pink-100 hover:shadow-[0_0_12px_rgba(236,72,153,0.3)]",
  },
];

export default function CompanyTechStackCards({ items = [] }) {
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
      className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      onMouseLeave={() => {
        setHoveredIdx(null);
        setMousePositions({});
      }}
    >
      {items.map((stack, idx) => {
        const theme = THEMES[idx % THEMES.length];
        const IconComponent = ICON_MAP[stack.icon] || Code2;
        const isHovered = hoveredIdx === idx;
        const pos = mousePositions[idx] || { x: 150, y: 150 };

        return (
          <motion.div
            key={stack.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="h-full"
          >
            <div
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#070b16]/95 p-7 backdrop-blur-md transition-all duration-500 ${theme.cardBorder} ${
                isHovered
                  ? "z-20 -translate-y-3.5 scale-[1.02] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
                  : "z-10 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.6)]"
              }`}
              style={{
                boxShadow: isHovered
                  ? `0 25px 60px -15px ${theme.glowColor}, 0 0 25px ${theme.glowColor}`
                  : `0 8px 30px -10px ${theme.glowColor}`,
              }}
            >
              {/* Permanent Ambient Breathing Aura (Keeps card highlighted all the time) */}
              <div
                className={`pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full ${theme.ambientAura} blur-3xl transition-all duration-700 ${
                  isHovered ? "opacity-100 scale-125" : "opacity-60 scale-100 animate-pulse"
                }`}
              />

              {/* Dynamic Mouse Spotlight Gradient */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${theme.glowColor}, transparent 70%)`,
                }}
              />

              {/* Continuous Top Neon Laser Beam */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r ${theme.laserGradient} ${theme.laserShadow} transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-x-100" : "opacity-75 scale-x-90"
                }`}
              />

              {/* Subtle Scanning Light Sheen across Card */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              {/* Floating Luminous Watermark Number in Background */}
              <div
                className={`pointer-events-none absolute right-3 -bottom-2 text-7xl font-mono font-black select-none transition-all duration-500 ${theme.watermark} ${
                  isHovered ? "scale-115 -translate-y-1 opacity-100" : "opacity-70"
                }`}
              >
                0{idx + 1}
              </div>

              {/* Main Card Content */}
              <div className="relative z-10">
                {/* Header Metadata Pill */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    {theme.label}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10 bg-white/[0.03] text-slate-300">
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.statusDot} animate-pulse`} />
                    <span>{theme.status}</span>
                  </span>
                </div>

                {/* Squircle Animated Icon Container */}
                <div className="mb-5 flex items-center justify-between">
                  <motion.div
                    animate={isHovered ? { scale: [1, 1.1, 1.05] } : { y: [0, -3, 0] }}
                    transition={{
                      duration: isHovered ? 0.4 : 3,
                      repeat: isHovered ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                    className={`inline-flex h-13 w-13 items-center justify-center rounded-2xl border p-3 transition-transform duration-300 ${theme.iconContainer}`}
                  >
                    <IconComponent size={24} />
                  </motion.div>

                  <span className="text-xs font-mono text-slate-400/80">
                    {stack.tags.length} Stacks
                  </span>
                </div>

                {/* Category Title */}
                <h3
                  className={`text-xl font-bold text-white tracking-tight mb-4 transition-all duration-300 font-exo ${theme.titleGlow}`}
                >
                  {stack.category}
                </h3>

                {/* Technology Chips / Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {stack.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/[0.04] border border-white/10 transition-all duration-200 cursor-default shadow-xs ${theme.chipHover}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Luminous Micro Status Bar */}
              <div className="relative z-10 mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-electric animate-ping" />
                  <span className="text-slate-300">Production Verified</span>
                </span>
                <span className="text-electric/90 group-hover:translate-x-1 transition-transform duration-200 font-semibold">
                  v2026 // Stack →
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
