"use client";

import { Sparkles } from "lucide-react";
import Heading from "./Heading";
import DepthCarousel from "./DepthCarousel";

/* ─── 3 ENTERPRISE ARCHITECTURE CARDS DATA (CRYSTAL CLEAR & COMPELLING) ─── */
const enterpriseCards = [
  {
    id: "web-mobile",
    badge: "Web & Mobile",
    tag: "High-Performance Apps",
    headline: "Custom Web & Mobile Apps",
    desc: "We design and develop fast, modern web and mobile apps that look stunning and work effortlessly across iPhones, Android phones, and desktops.",
    image: "/resources/agentic-ai.jpg",
    metricValue: "< 1s",
    metricLabel: "Fast Loading",
    statusText: "OPTIMIZED FOR SPEED",
    icon: "Cpu",
    chips: ["iOS & Android", "High Conversion", "Instant Touch"],
    bullets: [
      {
        title: "Fast on Every Screen",
        desc: "Silky smooth performance on smartphones, tablets, and desktops.",
      },
      {
        title: "Custom Built For You",
        desc: "Tailored to your specific brand, customer flow, and business goals.",
      },
      {
        title: "Zero Lag Experience",
        desc: "Screens open in milliseconds without annoying loading delays.",
      },
    ],
    accent: {
      color: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.4)",
      badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      iconBg: "bg-blue-600/20 border-blue-500/40 text-blue-400",
      topLine: "from-blue-500 via-sky-400 to-transparent",
      highlightBorder: "border-blue-400/80 shadow-[0_20px_50px_rgba(59,130,246,0.35)]",
    },
    cta: "Explore Apps",
    href: "/solutions",
  },
  {
    id: "cloud-saas",
    badge: "Cloud & SaaS",
    tag: "Reliable Infrastructure",
    headline: "Scalable Cloud & SaaS Systems",
    desc: "All-in-one platforms that connect your billing, inventory, and team in a single dashboard — engineered to scale reliably without disruptions.",
    image: "/resources/saas-architecture.jpg",
    metricValue: "99.99%",
    metricLabel: "Guaranteed Uptime",
    statusText: "ACTIVE & PROTECTED",
    icon: "Network",
    chips: ["Unified Hub", "Bank-Grade Security", "Daily Backups"],
    bullets: [
      {
        title: "One Unified Dashboard",
        desc: "Manage sales, staff, and customer data from a single clean screen.",
      },
      {
        title: "Bank-Grade Security",
        desc: "Protected employee roles with 256-bit encrypted data storage.",
      },
      {
        title: "Automatic Daily Backups",
        desc: "Your records are continuously protected and recoverable anytime.",
      },
    ],
    accent: {
      color: "#8b5cf6",
      glow: "rgba(139, 92, 246, 0.4)",
      badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      iconBg: "bg-purple-600/20 border-purple-500/40 text-purple-400",
      topLine: "from-purple-500 via-violet-400 to-transparent",
      highlightBorder: "border-purple-400/80 shadow-[0_20px_50px_rgba(139,92,246,0.35)]",
    },
    cta: "Explore Cloud",
    href: "/solutions",
  },
  {
    id: "ai-automation",
    badge: "AI & Automation",
    tag: "Business Productivity",
    headline: "Smart AI & Workflow Automation",
    desc: "Intelligent automation tools and AI assistants that eliminate repetitive data entry, scan documents, and support your customers 24/7.",
    image: "/resources/cloud-finops.jpg",
    metricValue: "24/7",
    metricLabel: "Always Working",
    statusText: "AUTONOMOUS WORKFLOW",
    icon: "Layers",
    chips: ["Zero Manual Entry", "Document Reader", "24/7 Support"],
    bullets: [
      {
        title: "Cut Repetitive Work",
        desc: "Save 15+ hours a week on invoices, receipts, and manual typing.",
      },
      {
        title: "Instant File Answers",
        desc: "Get immediate, accurate answers from your company files and data.",
      },
      {
        title: "24/7 Customer Support",
        desc: "AI assistants answer client questions and capture leads automatically.",
      },
    ],
    accent: {
      color: "#0ea5e9",
      glow: "rgba(14, 165, 233, 0.4)",
      badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-300",
      iconBg: "bg-sky-600/20 border-sky-500/40 text-sky-400",
      topLine: "from-sky-400 via-blue-300 to-transparent",
      highlightBorder: "border-sky-400/80 shadow-[0_20px_50px_rgba(14,165,233,0.35)]",
    },
    cta: "Explore AI",
    href: "/solutions",
  },
];

export default function GlobalPresence() {
  return (
    <section className="relative bg-[#020510] border-t border-line/70 py-16 sm:py-24 overflow-hidden select-none">
      {/* ─── Ambient Atmospheric Glows ─── */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-electric/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[380px] w-[450px] rounded-full bg-violet/10 blur-[130px]" />

      {/* Cyber Grid Background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />

      <div className="container-x relative z-20">
        {/* ─── SECTION HEADER (SYMMETRICALLY CENTERED) ─── */}
        <div className="flex flex-col items-center text-center mx-auto gap-4 pb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-[#9db8ff] shadow-[0_0_15px_rgba(47,107,255,0.2)]">
            <Sparkles size={12} className="text-electric animate-pulse" />
            <span className="tracking-widest uppercase">BUILT FOR REAL BUSINESSES</span>
          </div>

          <Heading className="font-exo text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.15]">
            Architecture Built for the Enterprise.
          </Heading>

          <p className="mt-2 text-base sm:text-lg lg:text-[1.125rem] text-cool/90 leading-relaxed font-normal max-w-3xl mx-auto">
            From modern mobile and web apps to resilient cloud backends and smart AI workflows — we engineer software that grows your revenue and simplifies your operations.
          </p>
        </div>

        {/* ─── CENTERED 3D DEPTH CAROUSEL WITH TILTED CARDS & ANIMATED IMAGES ─── */}
        <div className="mt-8 sm:mt-12">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Explore Our Core Solutions
            </span>
          </div>
          <DepthCarousel
            items={enterpriseCards}
            autoplayInterval={5500}
            enableAutoplay={true}
          />
        </div>
      </div>
    </section>
  );
}
