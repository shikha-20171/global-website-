"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Star } from "lucide-react";

const ICON_MAP = {
  Code2,
  Database,
  Cloud,
  Star,
};

const THEMES = [
  {
    // Frontend & Client
    beamColor: "#0ea5e9", // Sky blue
    beamHighlight: "#38bdf8", // Bright cyan
    glowColor: "rgba(56, 189, 248, 0.35)",
    ambientAura: "bg-cyan-500/20",
    iconGradient: "from-cyan-500/20 via-blue-500/15 to-transparent",
    iconBorder: "border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    titleColor: "text-white group-hover:text-cyan-200 transition-colors",
    chipBg: "bg-white/[0.04] border-white/10 text-slate-300 hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-100 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]",
    spinDuration: "6s",
    spinDelay: "0s",
  },
  {
    // Backend & Database
    beamColor: "#6366f1", // Indigo
    beamHighlight: "#a855f7", // Bright violet
    glowColor: "rgba(168, 85, 247, 0.35)",
    ambientAura: "bg-violet-500/20",
    iconGradient: "from-indigo-500/20 via-purple-500/15 to-transparent",
    iconBorder: "border-violet-400/40 text-violet-300 shadow-[0_0_20px_rgba(168,85,247,0.35)]",
    titleColor: "text-white group-hover:text-violet-200 transition-colors",
    chipBg: "bg-white/[0.04] border-white/10 text-slate-300 hover:border-violet-400/60 hover:bg-violet-500/15 hover:text-violet-100 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    spinDuration: "6s",
    spinDelay: "-1.5s",
  },
  {
    // Cloud Platforms
    beamColor: "#0284c7", // Ocean blue
    beamHighlight: "#34d399", // Emerald
    glowColor: "rgba(52, 211, 153, 0.35)",
    ambientAura: "bg-emerald-500/20",
    iconGradient: "from-teal-500/20 via-emerald-500/15 to-transparent",
    iconBorder: "border-emerald-400/40 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)]",
    titleColor: "text-white group-hover:text-emerald-200 transition-colors",
    chipBg: "bg-white/[0.04] border-white/10 text-slate-300 hover:border-emerald-400/60 hover:bg-emerald-500/15 hover:text-emerald-100 hover:shadow-[0_0_12px_rgba(52,211,153,0.25)]",
    spinDuration: "6s",
    spinDelay: "-3s",
  },
  {
    // AI & DevOps
    beamColor: "#ec4899", // Pink
    beamHighlight: "#f43f5e", // Rose/Gold
    glowColor: "rgba(236, 72, 153, 0.35)",
    ambientAura: "bg-pink-500/20",
    iconGradient: "from-purple-500/20 via-pink-500/15 to-transparent",
    iconBorder: "border-pink-400/40 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.35)]",
    titleColor: "text-white group-hover:text-pink-200 transition-colors",
    chipBg: "bg-white/[0.04] border-white/10 text-slate-300 hover:border-pink-400/60 hover:bg-pink-500/15 hover:text-pink-100 hover:shadow-[0_0_12px_rgba(236,72,153,0.25)]",
    spinDuration: "6s",
    spinDelay: "-4.5s",
  },
];

export default function CompanyTechStackCards({ items = [] }) {
  return (
    <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {items.map((stack, idx) => {
        const theme = THEMES[idx % THEMES.length];
        const IconComponent = ICON_MAP[stack.icon] || Code2;

        return (
          <motion.div
            key={stack.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="group relative h-full flex flex-col w-full"
          >
            {/* Ambient diffuse colored glow behind the card (breathing animation) */}
            <div
              className={`pointer-events-none absolute -inset-1 rounded-3xl ${theme.ambientAura} blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse`}
              style={{ animationDuration: "3.5s" }}
            />

            {/* Rotating border-beam container with iOS WebKit isolation */}
            <div className="relative h-full p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] flex flex-col isolate">
              {/* Spinning continuous gradient beam around card perimeter */}
              <div
                className="pointer-events-none absolute -inset-[100%] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${theme.beamColor} 320deg, ${theme.beamHighlight} 360deg)`,
                  animation: `spin ${theme.spinDuration} linear infinite`,
                  animationDelay: theme.spinDelay,
                }}
              />

              {/* Inner card surface */}
              <div className="relative flex-1 rounded-[15px] bg-[#070b16]/95 p-5 sm:p-6 lg:p-7 backdrop-blur-xl flex flex-col justify-start border border-white/5">
                {/* Diagonal light sheen scan across card on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                {/* Squircle Animated Icon Container */}
                <div
                  className={`mb-5 sm:mb-6 inline-flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md bg-gradient-to-br ${theme.iconGradient} ${theme.iconBorder}`}
                >
                  <IconComponent size={22} />
                </div>

                {/* Category Title */}
                <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-4 sm:mb-5 font-exo ${theme.titleColor}`}>
                  {stack.category}
                </h3>

                {/* Technology Chips / Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {stack.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-all duration-200 cursor-default shadow-xs break-words ${theme.chipBg}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
