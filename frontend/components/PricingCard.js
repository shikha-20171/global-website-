"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Odometer from "./Odometer";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice, getPlanPrice } from "@/lib/data";

/**
 * Interactive Prisma Pricing Card with Dynamic Cursor Movement & Blue Glow Transitions
 * Features:
 * - Real-time mouse-follow cursor spotlight in rich electric blue
 * - Interactive 3D tilt physics responsive to cursor position
 * - Dynamic blue transition when switching cursor between pricing cards
 * - Ambient blue back-aura and laser top beam on active/hovered card
 * - High-contrast elevated CTA button and checkmark glows
 */
export default function PricingCard({
  plan,
  cycle,
  product,
  index = 0,
  isActive: controlledIsActive,
  isHoveredDirectly: controlledIsHoveredDirectly,
  isAnyHovered = false,
  onHover,
  onLeave,
}) {
  const cardRef = useRef(null);
  const [internalHover, setInternalHover] = useState(false);

  // Determine active and hover states (supports both parent-controlled and standalone mode)
  const isSelfHovered = controlledIsHoveredDirectly !== undefined ? controlledIsHoveredDirectly : internalHover;
  const isActive = controlledIsActive !== undefined ? controlledIsActive : (internalHover || !!plan.highlighted);

  // Mouse coordinates normalized from -0.5 to 0.5 for 3D tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D rotation (max 8 degrees tilt)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 220,
    damping: 24,
  });

  // Dynamic Spotlight position relative to card (in px)
  const [spotlightPos, setSpotlightPos] = useState({ x: 150, y: 150 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
    setSpotlightPos({ x, y });
  };

  const handleMouseEnter = () => {
    setInternalHover(true);
    if (onHover) onHover(index);
  };

  const handleMouseLeave = () => {
    setInternalHover(false);
    mouseX.set(0);
    mouseY.set(0);
    if (onLeave) onLeave(index);
  };

  const price = getPlanPrice(plan, cycle);
  const q = product ? `?product=${product}&plan=${plan.id}` : `?plan=${plan.id}`;
  const isMostPopular = Boolean(
    plan.highlighted ||
    plan.highlight ||
    plan.isHighlighted ||
    plan.id === "business" ||
    plan.slug === "business"
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full [perspective:1200px] transition-all duration-300 ${
        isActive ? "z-20 lg:-translate-y-2.5 lg:scale-[1.03]" : "z-10"
      }`}
    >
      {/* ─── Ambient Blue Aura Glow Behind Active Card ─── */}
      <div
        className={`pointer-events-none absolute -inset-[3px] rounded-2xl bg-gradient-to-b from-blue-600/40 via-blue-500/20 to-transparent blur-xl transition-all duration-500 ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />

      {/* ─── 3D Motion Card Container ─── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 ${
          isActive
            ? "border-2 border-[#3b82f6] bg-[#07112b]/95 shadow-[0_20px_50px_rgba(37,99,235,0.45),0_0_35px_rgba(59,130,246,0.35)] ring-1 ring-[#60a5fa]"
            : isAnyHovered
            ? "border border-white/5 bg-[#040816]/75 opacity-60 scale-[0.98]"
            : "border border-white/10 bg-[#050a18]/90 hover:border-blue-500/60 hover:bg-[#070e24]/95 shadow-lg"
        }`}
      >
        {/* Glowing Electric Blue Top Laser Beam when active */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent shadow-[0_0_15px_#3b82f6] transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* ─── Dynamic Blue Cursor Spotlight Following Mouse ─── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: isSelfHovered ? 1 : isActive ? 0.35 : 0,
            background: `radial-gradient(380px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(59, 130, 246, 0.32), rgba(37, 99, 235, 0.12) 40%, transparent 80%)`,
          }}
        />

        {/* Floating "Most Popular" Badge (Centered with 3D Z-Depth: 35px & Shimmer Animation) */}
        {isMostPopular && (
          <div className="absolute -top-3.5 inset-x-0 z-30 flex justify-center pointer-events-none">
            <div
              style={{ transform: "translateZ(35px)" }}
              className="pointer-events-auto"
            >
              <div className="relative overflow-hidden flex items-center gap-1.5 rounded-full border border-sky-400/80 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-white shadow-[0_0_22px_rgba(59,130,246,0.7),0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md">
                {/* Continuous Shimmer Sweep Animation */}
                <motion.span
                  className="pointer-events-none absolute inset-0 z-10 w-full"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 1.0,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)",
                  }}
                  aria-hidden="true"
                />
                <Sparkles size={11} aria-hidden="true" className="text-yellow-300 shrink-0 animate-pulse" />
                <span className="relative z-20 font-black">Most Popular</span>
              </div>
            </div>
          </div>
        )}

        {/* Header: Plan Name & Tagline (Layered 3D Z-Depth: 26px) */}
        <div style={{ transform: "translateZ(26px)" }} className="pt-1">
          <div className="flex items-center justify-between">
            <h3
              className={`text-xl font-bold tracking-tight transition-colors duration-200 ${
                isActive ? "text-white" : "text-white/95"
              }`}
            >
              {plan.name}
            </h3>
            {isActive && (
              <span className="h-2 w-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
            )}
          </div>
          <p className="mt-1 text-xs text-cool/90 leading-relaxed">{plan.for}</p>
        </div>

        {/* Pricing Display (Layered 3D Z-Depth: 32px) */}
        <div
          style={{ transform: "translateZ(32px)" }}
          className="mt-6 min-h-[64px] border-b border-white/10 pb-5"
        >
          {price == null ? (
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-white">Custom</div>
              <div className="text-xs font-mono text-[#93c5fd] mt-1">Tailored Enterprise Pricing</div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1.5">
                <Odometer
                  value={formatPrice(price)}
                  className="text-4xl font-extrabold tracking-tight text-white"
                />
                <span className="text-xs font-medium text-cool">/month</span>
              </div>
              <div className="mt-1 text-[11px] font-mono text-[#93c5fd]">
                {cycle === "annual" ? "Billed annually • Save 20%" : "Billed monthly"}
              </div>
            </div>
          )}
        </div>

        {/* Feature List (Layered 3D Z-Depth: 20px) */}
        <ul
          style={{ transform: "translateZ(20px)" }}
          className="my-6 flex-1 space-y-3 text-xs"
        >
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-white/90">
              <span
                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "border border-blue-400/50 bg-blue-500/25 text-[#93c5fd] shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    : "border border-white/10 bg-white/5 text-cool"
                }`}
              >
                <Check size={11} aria-hidden="true" />
              </span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* Action CTA Button (Layered 3D Z-Depth: 28px) */}
        <div style={{ transform: "translateZ(28px)" }} className="mt-auto pt-2">
          <Link
            href={plan.enterprise ? "/contact?solution=Enterprise" : `/demo${q}`}
            className={`btn w-full h-11 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] text-white shadow-[0_4px_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.85)] scale-[1.01]"
                : "btn-secondary hover:border-blue-500/50 hover:bg-white/[0.08]"
            }`}
          >
            <span>{plan.enterprise ? "Talk to Sales" : "Get Started"}</span>
            <ArrowRight size={13} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
