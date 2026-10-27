"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Cpu,
  Globe2,
  ShieldCheck,
  Sparkles,
  Server,
  Layers,
  Activity,
  Zap,
} from "lucide-react";

const nodes = [
  {
    title: "SaaS Catalog",
    sub: "20 Scalable Products",
    icon: Cpu,
    color: "from-blue-500 to-cyan-400",
    glow: "rgba(59, 130, 246, 0.4)",
    pos: "top-2 left-1/2 -translate-x-1/2",
  },
  {
    title: "Global Edge",
    sub: "Multi-Region CDN",
    icon: Globe2,
    color: "from-violet-500 to-indigo-400",
    glow: "rgba(124, 92, 255, 0.4)",
    pos: "top-1/2 -right-4 -translate-y-1/2",
  },
  {
    title: "Zero-Trust RBAC",
    sub: "Enterprise Security",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-400",
    glow: "rgba(16, 185, 129, 0.4)",
    pos: "-bottom-3 left-1/2 -translate-x-1/2",
  },
  {
    title: "Modular AI",
    sub: "Autonomous Workflows",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-400",
    glow: "rgba(236, 72, 153, 0.4)",
    pos: "top-1/2 -left-4 -translate-y-1/2",
  },
];

export default function CompanyHeroVisual() {
  const containerRef = useRef(null);

  // Smooth mouse-follow 3D tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 75, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 75, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-[500px] aspect-square flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Ambient background aura */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[360px] w-[360px] rounded-full bg-electric/15 blur-[90px] animate-pulse" />
        <div className="h-[280px] w-[280px] rounded-full bg-violet/15 blur-[80px]" />
      </div>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Outermost Orbit Ring (Spinning Clockwise) */}
        <div className="pointer-events-none absolute h-[380px] w-[380px] rounded-full border border-dashed border-white/10 animate-spin-slower" />

        {/* Middle Orbit Track (Spinning Counter-Clockwise) */}
        <div className="pointer-events-none absolute h-[290px] w-[290px] rounded-full border border-white/[0.08] animate-spinrev-slow">
          {/* Orbiting beam dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-electric shadow-[0_0_12px_#3b82f6]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-violet shadow-[0_0_12px_#8b5cf6]" />
        </div>

        {/* Inner Laser Ring */}
        <div className="pointer-events-none absolute h-[200px] w-[200px] rounded-full border border-electric/25 shadow-[0_0_25px_rgba(47,107,255,0.2)] animate-pulse" />

        {/* Central Hexagon Core */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(40px)" }}
          className="relative z-20 flex flex-col items-center justify-center h-32 w-32 rounded-3xl border border-electric/50 bg-[#070e24]/90 p-4 shadow-[0_0_40px_rgba(47,107,255,0.4)] backdrop-blur-xl"
        >
          <div className="relative mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-electric via-violet to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#030717]">
              <Zap size={22} className="text-electric animate-pulse" />
            </div>
          </div>
          <span className="font-exo text-xs font-bold text-white tracking-wider">
            DEZORYN
          </span>
          <span className="text-[9px] font-mono text-electric/90 tracking-widest uppercase">
            CORE OS
          </span>
        </motion.div>

        {/* 4 Orbiting Satellite Cards */}
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.title}
              style={{ transform: "translateZ(30px)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`absolute ${node.pos} z-20 group`}
            >
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b1a]/95 px-3.5 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30"
                style={{
                  boxShadow: `0 10px 30px -10px ${node.glow}`,
                }}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${node.color} p-0.5 text-white`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#05091a]">
                    <Icon size={17} className="text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white tracking-tight leading-none whitespace-nowrap">
                    {node.title}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-cool/90 whitespace-nowrap">
                    {node.sub}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Floating Telemetry Badge 1 */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(50px)" }}
          className="absolute -top-6 -right-2 z-30 hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#05111c]/90 px-3 py-1 shadow-lg backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono text-emerald-300 font-medium tracking-wide">
            99.99% SYSTEM SLA
          </span>
        </motion.div>

        {/* Floating Telemetry Badge 2 */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ transform: "translateZ(50px)" }}
          className="absolute -bottom-6 -left-2 z-30 hidden sm:flex items-center gap-2 rounded-full border border-electric/30 bg-[#050c24]/90 px-3 py-1 shadow-lg backdrop-blur-md"
        >
          <Activity size={12} className="text-electric animate-pulse" />
          <span className="text-[10px] font-mono text-[#9db8ff] font-medium tracking-wide">
            GLOBAL OPERATIONS ACTIVE
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
