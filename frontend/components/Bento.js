"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";
import Icon from "./Icon";
import Heading from "./Heading";

/* ─── 6 SERVICES DATA (EASY TO UNDERSTAND) ─── */
const services = [
  {
    id: "cloud-platforms",
    title: "Cloud Platforms",
    category: "SaaS Platforms",
    shortLabel: "Cloud",
    desc: "Subscription-ready software with automated billing, user accounts, and reliable hosting that scales with you.",
    fullDesc: "Launch your own software product or client portal with automated recurring payments, self-signup for customers, and fast cloud hosting that handles thousands of users effortlessly.",
    href: "/marketplace",
    cta: "Explore SaaS",
    icon: "Cloud",
    accent: {
      color: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.35)",
      badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      iconBg: "bg-blue-600/20 border-blue-500/40 text-blue-400",
      topLine: "from-blue-500 via-sky-400 to-transparent",
      highlightBorder: "border-blue-400/80 shadow-[0_15px_40px_rgba(59,130,246,0.3)]",
    },
    pills: ["Automated Billing", "Self-Service Signup", "Scales Effortlessly"],
    metrics: [
      { label: "Hosting", value: "Fast & Global" },
      { label: "User Capacity", value: "100k+ Active" },
      { label: "Availability", value: "99.99% Uptime" },
    ],
  },
  {
    id: "custom-erp",
    title: "Custom ERP",
    category: "Business Software",
    shortLabel: "ERP",
    desc: "Tailored business software that connects your sales, inventory, accounting, and staff in one easy dashboard.",
    fullDesc: "Manage your entire business operations from a single place. Built to match your specific workflow with safe employee permissions, instant reports, and automatic inventory updates.",
    href: "/solutions",
    cta: "Explore ERP",
    icon: "Building2",
    accent: {
      color: "#6366f1",
      glow: "rgba(99, 102, 241, 0.35)",
      badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
      iconBg: "bg-indigo-600/20 border-indigo-500/40 text-indigo-400",
      topLine: "from-indigo-500 via-purple-400 to-transparent",
      highlightBorder: "border-indigo-400/80 shadow-[0_15px_40px_rgba(99,102,241,0.3)]",
    },
    pills: ["One Clean Dashboard", "Safe Staff Roles", "Instant Reports"],
    metrics: [
      { label: "Access Security", value: "Protected Roles" },
      { label: "Data Safety", value: "100% Backed Up" },
      { label: "Tool Connections", value: "40+ Built-in" },
    ],
  },
  {
    id: "automation",
    title: "Smart Automation",
    category: "AI & Automation",
    shortLabel: "AI & Auto",
    desc: "Smart AI assistants and automated tools that take care of repetitive daily tasks in seconds.",
    fullDesc: "Save hours every week by letting smart automations handle invoice scanning, client reminders, data entry, and everyday customer questions without human delay.",
    href: "/solutions",
    cta: "Explore AI",
    icon: "Sparkles",
    accent: {
      color: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.35)",
      badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      iconBg: "bg-cyan-600/20 border-cyan-500/40 text-cyan-400",
      topLine: "from-cyan-400 via-teal-300 to-transparent",
      highlightBorder: "border-cyan-400/80 shadow-[0_15px_40px_rgba(6,182,212,0.3)]",
    },
    pills: ["Automate Data Entry", "Smart Document Reader", "24/7 AI Helpers"],
    metrics: [
      { label: "Speed", value: "Instant Response" },
      { label: "Time Saved", value: "Up to 80%" },
      { label: "Accuracy", value: "Human-Checked" },
    ],
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    category: "Mobile Applications",
    shortLabel: "Mobile",
    desc: "Beautiful, easy-to-use apps for iPhone and Android that keep your team and customers connected anywhere.",
    fullDesc: "Native mobile apps built to give your users a silky-smooth experience. Works offline, updates instantly, and makes ordering, booking, or managing tasks effortless on the go.",
    href: "/solutions",
    cta: "Explore Mobile",
    icon: "Smartphone",
    accent: {
      color: "#10b981",
      glow: "rgba(16, 185, 129, 0.35)",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      iconBg: "bg-emerald-600/20 border-emerald-500/40 text-emerald-400",
      topLine: "from-emerald-400 via-teal-300 to-transparent",
      highlightBorder: "border-emerald-400/80 shadow-[0_15px_40px_rgba(16,185,129,0.3)]",
    },
    pills: ["iPhone & Android", "Works Offline", "Silky Smooth"],
    metrics: [
      { label: "Platforms", value: "iOS & Android" },
      { label: "Speed", value: "Instant Tap" },
      { label: "Offline Mode", value: "Auto-Sync" },
    ],
  },
  {
    id: "web-platforms",
    title: "Web Platforms",
    category: "Web Platforms",
    shortLabel: "Web",
    desc: "High-speed web apps and client portals designed to load in a blink on laptops, tablets, and phones.",
    fullDesc: "Modern web applications and portals engineered for speed and clarity. Packed with interactive charts, instant search, and clean design that your customers and team will love using.",
    href: "/solutions",
    cta: "Explore Web",
    icon: "Globe2",
    accent: {
      color: "#0ea5e9",
      glow: "rgba(14, 165, 233, 0.35)",
      badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-300",
      iconBg: "bg-sky-600/20 border-sky-500/40 text-sky-400",
      topLine: "from-sky-400 via-blue-300 to-transparent",
      highlightBorder: "border-sky-400/80 shadow-[0_15px_40px_rgba(14,165,233,0.3)]",
    },
    pills: ["Opens in 1s", "Client Portals", "Clean Design"],
    metrics: [
      { label: "Load Time", value: "Under 1 Second" },
      { label: "Design", value: "All Devices" },
      { label: "Quality Score", value: "99+ Performance" },
    ],
  },
  {
    id: "modernization",
    title: "Modernization",
    category: "System Upgrades",
    shortLabel: "Upgrade",
    desc: "Upgrade old, slow software and spreadsheets into fast, secure, modern cloud platforms with zero downtime.",
    fullDesc: "Safely transfer your company's old databases and outdated systems into modern, reliable cloud apps without interrupting your day-to-day business operations.",
    href: "/solutions",
    cta: "Explore Upgrade",
    icon: "Layers",
    accent: {
      color: "#a855f7",
      glow: "rgba(168, 85, 247, 0.35)",
      badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      iconBg: "bg-purple-600/20 border-purple-500/40 text-purple-400",
      topLine: "from-purple-400 via-pink-300 to-transparent",
      highlightBorder: "border-purple-400/80 shadow-[0_15px_40px_rgba(168,85,247,0.3)]",
    },
    pills: ["Zero Business Pause", "Lower Running Cost", "Modern Cloud"],
    metrics: [
      { label: "Switchover", value: "Zero Downtime" },
      { label: "Server Cost", value: "40-60% Savings" },
      { label: "Safety", value: "Encrypted & Safe" },
    ],
  },
];

const TOTAL_CARDS = services.length;
const ANGLE_STEP = 360 / TOTAL_CARDS; // 60 deg each

export default function Bento() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [openedCard, setOpenedCard] = useState(null); // When card is open, animation stops!
  const [radius, setRadius] = useState(340);

  // High-performance direct DOM refs
  const sectionRef = useRef(null);
  const cylinderRef = useRef(null);
  const cardRefs = useRef([]);
  const requestRef = useRef(null);

  // Animation state in refs
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isTargetingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isCardOpenRef = useRef(false);
  const isInViewRef = useRef(true);
  const lastActiveIndexRef = useRef(0);

  useEffect(() => {
    isCardOpenRef.current = !!openedCard;
  }, [openedCard]);

  // Responsive radius calculation
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setRadius(195);
      } else if (w < 768) {
        setRadius(245);
      } else if (w < 1100) {
        setRadius(305);
      } else {
        setRadius(345);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection Observer to preserve CPU/GPU when out of viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Update card depths directly via DOM transforms for 120 FPS performance
  const updateCardDepths = useCallback((angle, currentRadius) => {
    const cylinder = cylinderRef.current;
    if (cylinder) {
      cylinder.style.transform = `rotateX(-5deg) rotateY(${angle}deg)`;
    }

    const cards = cardRefs.current;
    if (!cards || cards.length !== TOTAL_CARDS) return;

    for (let i = 0; i < TOTAL_CARDS; i++) {
      const cardEl = cards[i];
      if (!cardEl) continue;

      const cardAngle = i * ANGLE_STEP;
      const relAngle = ((cardAngle + angle) % 360 + 360) % 360;
      const rad = (relAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad);

      // Depth scaling & opacity
      const opacity = Math.max(0.35, ((cosVal + 1) / 2) * 0.75 + 0.25);
      const scale = cosVal > 0.85 ? 1.04 : 0.92;
      const zIndex = Math.round((cosVal + 1) * 100);

      cardEl.style.transform = `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${currentRadius}px) scale(${scale})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = zIndex;

      // Toggle highlight border when card is front-facing
      const innerCard = cardEl.firstElementChild;
      if (innerCard) {
        if (cosVal > 0.88) {
          innerCard.setAttribute("data-active", "true");
        } else {
          innerCard.removeAttribute("data-active");
        }
      }
    }
  }, []);

  // Continuous Autonomous Rotation Loop
  // Continues without stopping on hover; only pauses when a card is clicked/opened
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isInViewRef.current) {
        if (isTargetingRef.current) {
          // Smooth glide toward target card
          const diff = targetAngleRef.current - currentAngleRef.current;
          if (Math.abs(diff) < 0.1) {
            currentAngleRef.current = targetAngleRef.current;
            isTargetingRef.current = false;
          } else {
            currentAngleRef.current += diff * Math.min(delta * 10, 0.2);
          }
        } else if (!isCardOpenRef.current && !isDraggingRef.current) {
          // CONTINUOUS ROTATION (~7.5 deg/sec)
          currentAngleRef.current = (currentAngleRef.current + delta * 7.5) % 360;
        }

        // Apply hardware-accelerated transforms directly
        updateCardDepths(currentAngleRef.current, radius);

        // Calculate closest front-facing card index
        const normalized = (360 - (currentAngleRef.current % 360) + 360) % 360;
        const closest = Math.round(normalized / ANGLE_STEP) % TOTAL_CARDS;

        if (closest !== lastActiveIndexRef.current) {
          lastActiveIndexRef.current = closest;
          setActiveCardIndex(closest);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [radius, updateCardDepths]);

  // Rotate smoothly to specific card
  const rotateToCard = useCallback((idx) => {
    isTargetingRef.current = true;

    const currentNorm = ((currentAngleRef.current % 360) + 360) % 360;
    const targetNorm = ((360 - idx * ANGLE_STEP) % 360 + 360) % 360;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    targetAngleRef.current = currentAngleRef.current + diff;
    setActiveCardIndex(idx);
    lastActiveIndexRef.current = idx;
  }, []);

  // When card is clicked to open: rotate to it, open details modal, and STOP animation!
  const handleOpenCard = useCallback(
    (service, idx) => {
      rotateToCard(idx);
      setOpenedCard(service);
    },
    [rotateToCard]
  );

  // Close card modal: animation resumes automatically!
  const handleCloseCard = useCallback(() => {
    setOpenedCard(null);
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && openedCard) {
        handleCloseCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openedCard, handleCloseCard]);

  const handleNext = useCallback(() => {
    const nextIdx = (lastActiveIndexRef.current + 1) % TOTAL_CARDS;
    rotateToCard(nextIdx);
  }, [rotateToCard]);

  const handlePrev = useCallback(() => {
    const prevIdx = (lastActiveIndexRef.current - 1 + TOTAL_CARDS) % TOTAL_CARDS;
    rotateToCard(prevIdx);
  }, [rotateToCard]);

  // Pointer / Touch Drag interaction
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    isTargetingRef.current = false;
    dragDistanceRef.current = 0;
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const diff = clientX - startXRef.current;
    startXRef.current = clientX;
    dragDistanceRef.current += Math.abs(diff);

    currentAngleRef.current = (currentAngleRef.current + diff * 0.4) % 360;
    updateCardDepths(currentAngleRef.current, radius);

    const normalized = (360 - (currentAngleRef.current % 360) + 360) % 360;
    const closest = Math.round(normalized / ANGLE_STEP) % TOTAL_CARDS;
    if (closest !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = closest;
      setActiveCardIndex(closest);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#020510] py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* ─── Ambient Atmospheric Glows (Static, GPU optimized) ─── */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[950px] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[380px] w-[420px] rounded-full bg-indigo-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute left-10 top-10 h-[340px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Cyber Grid Background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />

      <div className="container-x relative z-20">
        {/* ─── SECTION HEADER (LARGER HEADING & ENHANCED PARAGRAPH, NO 3D ORBIT/GRID/PAUSE BUTTONS) ─── */}
        <div className="flex flex-col items-start gap-4 pb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="tracking-widest uppercase">
              WHAT WE BUILD • SOLUTIONS ARCHITECTURE
            </span>
          </div>

          <Heading className="font-exo text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.15]">
            Technology Solutions for{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
              Modern Businesses
            </span>
          </Heading>

          <p className="mt-1 text-base sm:text-lg lg:text-[1.125rem] text-cool/90 leading-relaxed font-normal max-w-3xl">
            We architect high-performance cloud platforms, custom enterprise systems, and intelligent digital workflows designed to streamline operations, eliminate repetitive friction, and power continuous business growth at global scale.
          </p>
        </div>
      </div>

      {/* ─── 3D ORBIT CYLINDER CAROUSEL VIEW ─── */}
      <div
        className="relative w-full h-[470px] sm:h-[510px] my-4 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        {/* 3D Holographic Radar Pedestal at Bottom */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 sm:translate-y-24 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full border border-blue-500/25 opacity-70"
          style={{
            transform: "translate(-50%, -10%) rotateX(75deg)",
            boxShadow: "0 0 50px rgba(59,130,246,0.2), inset 0 0 50px rgba(59,130,246,0.15)",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          }}
        >
          {/* Concentric rotating radar rings */}
          <div className="absolute inset-8 rounded-full border border-cyan-400/20" />
          <div
            className="absolute inset-20 rounded-full border border-indigo-500/30 border-dashed animate-spin"
            style={{ animationDuration: "35s" }}
          />
          <div className="absolute inset-32 rounded-full border border-blue-400/20" />
          <div
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_310deg,rgba(56,189,248,0.35)_360deg)] animate-spin"
            style={{ animationDuration: "12s" }}
          />
        </div>

        {/* 3D Perspective Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 48%",
          }}
        >
          {/* Rotating 3D Cylinder Container */}
          <div
            ref={cylinderRef}
            className="relative w-0 h-0"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              transform: "rotateX(-5deg) rotateY(0deg)",
            }}
          >
            {services.map((service, idx) => {
              const cardAngle = idx * ANGLE_STEP;
              return (
                <div
                  key={service.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onClick={() => {
                    if (dragDistanceRef.current < 8) {
                      handleOpenCard(service, idx);
                    }
                  }}
                  className="absolute top-1/2 left-1/2 pointer-events-auto cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    transition: "opacity 0.25s linear",
                  }}
                >
                  <OrbitCard
                    service={service}
                    isCenterFront={activeCardIndex === idx}
                    onOpen={() => handleOpenCard(service, idx)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Prev / Next Navigation Floating Buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous Card"
          className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/15 bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-blue-600/30 hover:border-blue-400 transition-all shadow-lg active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next Card"
          className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/15 bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-blue-600/30 hover:border-blue-400 transition-all shadow-lg active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ─── BOTTOM CONTROLS & SELECTION BAR (NO 'CONTINUOUS 3D ORBIT ACTIVE' TEXT) ─── */}
      <div className="container-x relative z-30 mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Interactive Indicator Pills (Card Name & Status, No Numbers) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {services.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                rotateToCard(idx);
              }}
              className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                activeCardIndex === idx
                  ? "border-blue-400/80 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                  : "border-white/10 bg-white/[0.03] text-cool/70 hover:text-white hover:border-white/30"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  activeCardIndex === idx ? "animate-pulse scale-110" : "opacity-60"
                }`}
                style={{ backgroundColor: s.accent.color }}
              />
              <span className="font-medium tracking-wide">{s.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Clean CTA Link to Solutions */}
        <Link
          href="/solutions"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/90 hover:text-blue-400 transition-colors font-medium px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
        >
          <span>All Solutions</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* ─── EXPANDED CARD DETAIL MODAL (WHEN A CARD IS CLICKED & OPENED) ─── */}
      {openedCard && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseCard}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#070c1e]/98 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {/* Top Glowing Laser Border */}
            <div
              className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${openedCard.accent.topLine}`}
            />

            {/* Inner Glow */}
            <div
              className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
              style={{ backgroundColor: openedCard.accent.color }}
            />

            {/* Header: Category Badge + Icon + Close Button */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border ${openedCard.accent.iconBg}`}
                >
                  <Icon name={openedCard.icon} size={16} />
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-mono font-medium ${openedCard.accent.badgeBg}`}
                >
                  {typeof openedCard.category === "object" && openedCard.category !== null ? (openedCard.category.name || openedCard.category.slug || "Infrastructure") : (openedCard.category || "Infrastructure")}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseCard}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-cool/80 hover:text-white hover:bg-white/10 transition-all"
                title="Close & Resume Rotation"
              >
                <X size={16} />
              </button>
            </div>

            {/* Title & Full Description */}
            <div className="relative z-10 pt-5">
              <h3 className="font-exo text-xl sm:text-2xl font-bold text-white">
                {openedCard.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-cool/90 leading-relaxed font-normal">
                {openedCard.fullDesc}
              </p>
            </div>

            {/* Key Architectural Pillars */}
            <div className="relative z-10 mt-5 pt-4 border-t border-white/10">
              <div className="text-[11px] font-mono uppercase text-cool/60 mb-2.5 tracking-wider">
                Core Architecture & Capabilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {openedCard.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-cool/90"
                  >
                    <CheckCircle2
                      size={12}
                      style={{ color: openedCard.accent.color }}
                      className="shrink-0"
                    />
                    <span>{pill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Metrics Grid */}
            {openedCard.metrics && (
              <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
                {openedCard.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="text-[10px] font-mono text-cool/60 truncate">
                      {m.label}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseCard}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-mono text-cool hover:text-white hover:bg-white/[0.08] transition-all"
              >
                Close & Resume
              </button>

              <Link
                href={openedCard.href}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                <span>{openedCard.cta}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── ORBIT 3D CARD COMPONENT ─── */
function OrbitCard({ service, isCenterFront = false, onOpen }) {
  return (
    <div className="w-[275px] sm:w-[315px] md:w-[330px] select-none group">
      <div
        className={`relative flex flex-col justify-between rounded-2xl border bg-[#070c1e]/95 p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.8)] transition-all duration-300 ${
          isCenterFront
            ? service.accent.highlightBorder
            : "border-white/10 hover:border-white/30"
        } hover:scale-[1.02]`}
      >
        {/* Continuous Glowing Laser Line along Top Border */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${
            service.accent.topLine
          } ${isCenterFront ? "opacity-100" : "opacity-60"}`}
        />

        {/* Inner Ambient Glow (GPU accelerated) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 15% 15%, ${service.accent.glow} 0%, transparent 65%)`,
          }}
        />

        {/* ─── CARD HEADER: CATEGORY BADGE + ICON ─── */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2 w-2 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: service.accent.color }}
            />
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-medium truncate ${service.accent.badgeBg}`}
            >
              {typeof service.category === "object" && service.category !== null ? (service.category.name || service.category.slug || "Enterprise") : (service.category || "Enterprise")}
            </span>
          </div>

          <div
            className={`flex h-6 w-6 items-center justify-center rounded-lg border ${service.accent.iconBg} shrink-0 group-hover:scale-110 transition-transform`}
          >
            <Icon name={service.icon} size={13} />
          </div>
        </div>

        {/* ─── CARD BODY: TITLE & DESCRIPTION ─── */}
        <div className="relative z-10 pt-2.5 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-exo text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors truncate">
              {service.title}
            </h4>
            <span className="text-[10px] font-mono text-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
              <span>Open</span>
              <Maximize2 size={10} />
            </span>
          </div>
          <p className="mt-1 text-[11px] sm:text-[11.5px] text-cool/85 leading-relaxed line-clamp-2">
            {service.desc}
          </p>
        </div>

        {/* ─── PILLS (CHECKMARK TAGS) ─── */}
        <div className="relative z-10 flex flex-wrap gap-1 my-2.5">
          {service.pills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[8.5px] font-mono text-cool/90"
            >
              <CheckCircle2
                size={8.5}
                style={{ color: service.accent.color }}
                className="shrink-0"
              />
              <span className="truncate">{pill}</span>
            </span>
          ))}
        </div>

        {/* ─── FOOTER: CTA LINK + OPEN ACTION ─── */}
        <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
            <span>{service.cta}</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>

          <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-cool/70 group-hover:text-blue-300 transition-colors">
            <span
              className="h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: service.accent.color }}
            />
            <span>CLICK TO OPEN</span>
          </span>
        </div>
      </div>
    </div>
  );
}
