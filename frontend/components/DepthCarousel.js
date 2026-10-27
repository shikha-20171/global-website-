"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  CheckCircle2,
  Cpu,
  Network,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";

const ICON_MAP = {
  Cpu: Cpu,
  Network: Network,
  Layers: Layers,
};

function ArchitectureCard({ item, index, isCenter, onSelect }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = ICON_MAP[item.icon] || Cpu;

  const handleMouseMove = (e) => {
    if (!isCenter || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;
    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className="relative w-full max-w-[315px] sm:max-w-[370px] lg:max-w-[390px] mx-auto flex flex-col cursor-pointer select-none transition-shadow duration-500"
    >
      <motion.div
        animate={{
          rotateX: isCenter ? rotateX : 0,
          rotateY: isCenter ? rotateY : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className={`relative flex flex-col justify-between h-[490px] sm:h-[530px] rounded-3xl overflow-hidden border transition-all duration-500 bg-[#060a19]/95 backdrop-blur-xl ${
          isCenter
            ? "border-sky-400 ring-2 ring-sky-400/50 shadow-[0_25px_65px_rgba(14,165,233,0.45)]"
            : "border-white/10 hover:border-sky-400/50 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Top Glowing Laser Border Beam */}
        <div
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${item.accent.topLine} transition-all duration-300 ${
            isCenter ? "opacity-100 shadow-[0_0_20px_#38bdf8]" : "opacity-40"
          }`}
        />

        {/* Dynamic Glass Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 75%)`,
          }}
        />

        {/* Ambient Corner Radial Glow */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full opacity-35 blur-3xl transition-opacity duration-500"
          style={{ backgroundColor: item.accent.color }}
        />

        {/* ─── IMAGE BANNER WITH KEN-BURNS & CYBER SCANLINE ─── */}
        <div className="relative w-full h-[150px] sm:h-[165px] overflow-hidden bg-black/95 border-b border-white/10 shrink-0">
          <div className="relative w-full h-full animate-ken-burns">
            <Image
              src={item.image}
              alt={item.headline}
              fill
              className="object-cover object-center opacity-85 transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 340px, 420px"
              priority={index === 0}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#060a19] via-black/30 to-transparent" />

          {/* Continuous Cyber Radar Scanline */}
          <div className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-cyber-scan shadow-[0_0_15px_rgba(6,182,212,0.35)]" />

          {/* Category Pill Tag */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-mono font-medium backdrop-blur-md shadow-sm ${item.accent.badgeBg}`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: item.accent.color }}
              />
              {item.badge}
            </span>
          </div>

          {/* Live Benchmark Stat Badge */}
          <div className="absolute top-3.5 right-3.5 z-10 text-right">
            <div className="text-xs font-mono font-bold text-white bg-black/80 border border-white/20 px-3 py-1 rounded-lg backdrop-blur-md shadow-md flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{item.metricValue}</span>
            </div>
          </div>
        </div>

        {/* ─── CARD BODY ─── */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            {/* Header: Icon + Headline */}
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{
                  rotate: isHovered && isCenter ? [0, -8, 8, 0] : 0,
                  scale: isHovered && isCenter ? 1.1 : 1,
                }}
                transition={{ duration: 0.5 }}
                className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${item.accent.iconBg} shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
              >
                <IconComponent size={18} />
              </motion.div>
              <h4 className="font-exo text-lg sm:text-[1.18rem] font-bold text-white tracking-tight leading-snug">
                {item.headline}
              </h4>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[12.5px] text-slate-300 leading-relaxed mt-2 line-clamp-2">
              {item.desc}
            </p>

            {/* Core Capability Bullets */}
            <div className="mt-4 space-y-2.5 border-t border-white/10 pt-3">
              {item.bullets.slice(0, 3).map((b) => (
                <div key={b.title} className="flex items-start gap-2 text-xs leading-snug">
                  <CheckCircle2
                    size={14}
                    style={{ color: item.accent.color }}
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-white font-semibold">{b.title}: </span>
                    <span className="text-slate-400">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer: Status + Explore Link */}
          <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Activity size={13} className="text-emerald-400 animate-pulse" />
              <span className="truncate">{item.statusText}</span>
            </span>

            {isCenter ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 text-sky-400 hover:text-white transition-all font-semibold group-hover:translate-x-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{item.cta}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-sky-400/80 font-mono">
                <span>Click to view</span>
                <RotateCw size={12} className="animate-spin-slow" />
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DepthCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Responsive width tracking for 3D orbital spacing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous auto-rotation timer: cycles through the 3 cards every 3.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Determine responsive 3D orbital spacing
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const xOffset = isDesktop ? 370 : isTablet ? 240 : 75;

  return (
    <div
      className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none overflow-hidden sm:overflow-visible px-2 sm:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── TOP STATUS BADGE & ROTATION CONTROLS ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 z-20">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono transition-all duration-300 ${
                isActive
                  ? "border border-sky-400 bg-sky-500/20 text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-105"
                  : "border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:border-white/25"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  isActive ? "animate-ping" : "opacity-50"
                }`}
                style={{ backgroundColor: item.accent.color }}
              />
              <span className="font-semibold tracking-wide">{item.badge}</span>
            </button>
          );
        })}
      </div>

      {/* ─── 3D ORBITAL ROTATION STAGE (All 3 cards continuously cycle in 3D) ─── */}
      <div
        className="relative w-full h-[510px] sm:h-[560px] flex items-center justify-center overflow-visible"
        style={{
          perspective: 1400,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {items.map((item, index) => {
          // Relative position in the 3-card orbital ring: 0 = center, 1 = right, 2 = left
          const slot = (index - activeIndex + items.length) % items.length;
          const isCenter = slot === 0;
          const isRight = slot === 1;
          const isLeft = slot === 2;

          let targetX = 0;
          let targetZ = 50;
          let targetRotateY = 0;
          let targetScale = 1.02;
          let targetOpacity = 1;
          let targetZIndex = 30;

          if (isRight) {
            targetX = xOffset;
            targetZ = -80;
            targetRotateY = isDesktop ? -16 : -8;
            targetScale = isDesktop ? 0.88 : 0.8;
            targetOpacity = isDesktop ? 0.78 : 0.45;
            targetZIndex = 15;
          } else if (isLeft) {
            targetX = -xOffset;
            targetZ = -80;
            targetRotateY = isDesktop ? 16 : 8;
            targetScale = isDesktop ? 0.88 : 0.8;
            targetOpacity = isDesktop ? 0.78 : 0.45;
            targetZIndex = 15;
          }

          return (
            <motion.div
              key={item.id}
              className="absolute w-full max-w-[315px] sm:max-w-[370px] lg:max-w-[390px] will-change-transform"
              initial={false}
              animate={{
                x: targetX,
                z: targetZ,
                rotateY: targetRotateY,
                scale: targetScale,
                opacity: targetOpacity,
                zIndex: targetZIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 170,
                damping: 24,
                mass: 0.85,
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <ArchitectureCard
                item={item}
                index={index}
                isCenter={isCenter}
                onSelect={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
              />
            </motion.div>
          );
        })}

        {/* ─── MANUAL NAVIGATION ARROWS (Hoverable on Desktop, accessible on Mobile) ─── */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Rotate Previous Architecture Card"
          className="absolute left-2 sm:left-4 lg:left-12 z-40 h-11 w-11 rounded-2xl border border-white/15 bg-black/70 hover:bg-sky-600/30 text-white hover:border-sky-400 flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          <ChevronLeft size={22} className="text-slate-200" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Rotate Next Architecture Card"
          className="absolute right-2 sm:right-4 lg:right-12 z-40 h-11 w-11 rounded-2xl border border-white/15 bg-black/70 hover:bg-sky-600/30 text-white hover:border-sky-400 flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          <ChevronRight size={22} className="text-slate-200" />
        </button>
      </div>

      {/* ─── BOTTOM DOT INDICATORS & ROTATION PROGRESS ─── */}
      <div className="flex flex-col items-center gap-3 mt-4 z-20">
        <div className="flex items-center gap-2.5">
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-8 bg-sky-400 shadow-[0_0_12px_#38bdf8]"
                  : "w-2 bg-white/25 hover:bg-white/50"
              }`}
              aria-label={`Jump to architecture card ${idx + 1}: ${it.badge}`}
            />
          ))}
        </div>

        <p className="text-[11.5px] font-mono text-slate-400">
          Continuous 3D Orbit • Hover to inspect • Click any side card to rotate front
        </p>
      </div>
    </div>
  );
}

