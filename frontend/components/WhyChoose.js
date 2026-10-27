"use client";
import { useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Network, Smartphone, ArrowRight } from "lucide-react";
import Heading from "./Heading";
import Button from "./Button";
import Reveal from "./Reveal";

const capabilities = [
  {
    icon: Layers,
    title: "Built to Grow With You",
    desc: "Clean, reliable software that handles more users and data smoothly as your company expands, without slowing down.",
    tag: "Scalability",
    href: "/solutions",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Data Security",
    desc: "Protected logins, employee access controls, and encrypted backups keep all your customer and company records safe.",
    tag: "Security",
    href: "/solutions",
  },
  {
    icon: Network,
    title: "Connects With Your Tools",
    desc: "Seamlessly links with your current accounting tools, payment gateways, and everyday software with zero headaches.",
    tag: "Integrations",
    href: "/solutions",
  },
  {
    icon: Smartphone,
    title: "Fast on Every Screen",
    desc: "Lightning fast on phones, tablets, and computers. Easy to navigate with no lag, so your team can work from anywhere.",
    tag: "Every Device",
    href: "/solutions",
  },
];

export default function WhyChoose() {
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
    <section className="section border-t border-line bg-midnight/60 relative overflow-hidden py-16 sm:py-20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="container-x relative z-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#1e40af]/30 px-3 py-1 text-[11px] font-mono text-[#bfdbfe] shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_#60a5fa] animate-pulse" />
              <span>WHY CHOOSE DEZORYN</span>
            </div>
            <h2 className="h-section max-w-2xl">
              Why Choose <span className="text-gradient-blue">DEZORYN</span>
            </h2>
            <Reveal delay={0.1}>
              <p className="lead mt-3 text-base sm:text-lg text-cool max-w-xl leading-relaxed">
                We build reliable, secure, and easy-to-use software designed to help your team get more done with less stress.
              </p>
            </Reveal>
          </div>
          <Button href="/solutions" variant="secondary" arrow>
            Explore Solutions
          </Button>
        </div>

        {/* 4 Spotlight Capability Cards */}
        <div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          onMouseLeave={() => {
            setHoveredIdx(null);
            setMousePositions({});
          }}
        >
          {capabilities.map((c, i) => {
            const IconComponent = c.icon;
            const isHovered = hoveredIdx === i;
            const isOtherHovered = hoveredIdx !== null && !isHovered;
            const pos = mousePositions[i] || { x: 150, y: 150 };

            return (
              <Reveal key={c.title} delay={i * 0.05}>
                <Link
                  href={c.href}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseMove={(e) => handleMouseMove(i, e)}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 transition-all duration-300 ${
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

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div
                      className={`flex items-center justify-between pb-4 border-b transition-colors ${
                        isHovered ? "border-[#60a5fa]/30" : "border-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isHovered
                            ? "border-[#93c5fd] bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] text-white shadow-[0_0_25px_rgba(59,130,246,0.95)] scale-110"
                            : "border-[#3b82f6]/40 bg-[#1e40af]/30 text-[#60a5fa] shadow-[0_0_10px_rgba(37,99,235,0.25)]"
                        }`}
                      >
                        <IconComponent size={22} aria-hidden="true" />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-mono font-medium border transition-colors ${
                          isHovered
                            ? "border-[#60a5fa]/60 bg-[#1d4ed8]/50 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                            : "border-white/10 bg-white/5 text-[#93c5fd]"
                        }`}
                      >
                        {c.tag}
                      </span>
                    </div>

                    <h3
                      className={`mt-5 text-lg font-bold transition-all duration-300 leading-snug ${
                        isHovered ? "text-white drop-shadow-[0_0_18px_rgba(96,165,250,0.8)]" : "text-white/95"
                      }`}
                    >
                      {c.title}
                    </h3>
                    <p
                      className={`mt-2.5 text-xs leading-relaxed transition-colors duration-300 ${
                        isHovered ? "text-[#e2e8f0]" : "text-cool"
                      }`}
                    >
                      {c.desc}
                    </p>
                  </div>

                  {/* Card Action Link */}
                  <div
                    className={`relative z-10 mt-8 pt-4 border-t flex items-center justify-between text-xs font-semibold transition-all duration-300 ${
                      isHovered
                        ? "border-[#60a5fa]/40 text-[#93c5fd]"
                        : "border-white/5 text-[#60a5fa]"
                    }`}
                  >
                    <span>Learn more</span>
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className={`transition-all duration-300 ${
                        isHovered ? "translate-x-1.5 text-white" : ""
                      }`}
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
