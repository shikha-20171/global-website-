"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Lock,
  KeyRound,
  FileClock,
  Plug,
  Maximize2,
  X,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  Building2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Cpu,
} from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import Button from "./Button";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";
import FAQ from "./FAQ";
import CTASection from "./CTASection";
import Reveal from "./Reveal";
import ModuleWorkspace from "./ModuleWorkspace";
import { projects, formatPrice, startingPrice } from "@/lib/data";
import { caseStudiesDetails } from "@/lib/caseStudiesData";

const sections = ["Overview", "Features", "Modules", "How It Works", "Integrations", "Case Study", "Security", "Pricing", "FAQ"];

const SECURITY_ICON_MAP = {
  Lock,
  KeyRound,
  FileClock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
};

const id = (s) => s.toLowerCase().replace(/\s+/g, "-");

export default function ProductDetail({ product: p }) {
  const [active, setActive] = useState("Overview");
  const [mod, setMod] = useState(0);
  const [cycle, setCycle] = useState("monthly");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pricingHoveredIdx, setPricingHoveredIdx] = useState(null);

  const relatedProject = projects.find((proj) => proj.product === p.slug);
  const caseDetails = relatedProject ? caseStudiesDetails[relatedProject.slug] : null;

  const steps = p.steps || [
    ["Discover", "We evaluate your operations and configure multi-tenant data pipelines."],
    ["Configure", "Set up enterprise roles, custom workflows, and branded client portals."],
    ["Launch", "Go live with dedicated sandbox training, migration scripts, and VIP support."],
    ["Scale", "Add unlimited users, branch locations, and automated AI triggers seamlessly."]
  ];

  const security = (p.security || [
    ["Lock", "AES-256 Encryption", "Zero-knowledge end-to-end encryption in transit and at rest."],
    ["KeyRound", "Granular RBAC", "Role-based access controls with multi-factor authentication."],
    ["FileClock", "Immutable Audit Trail", "Complete cryptographic log of user and API actions."],
    ["ShieldCheck", "Enterprise Cloud", "Multi-region redundancy with continuous real-time backups."]
  ]).map(([iconName, title, desc]) => [
    SECURITY_ICON_MAP[iconName] || ShieldCheck,
    title,
    desc
  ]);

  const trustMetrics = p.trustMetrics || [
    { title: "14-Day Free Trial", desc: "No credit card required" },
    { title: "Instant Deploy", desc: "Live setup in < 48 hours" },
    { title: "Compliance Ready", desc: "SOC-2, GDPR & ISO certified" }
  ];

  const telemetryBadges = p.telemetryBadges || [
    { title: "Low-Latency Cloud", desc: "Sub-50ms Global Edge" },
    { title: "ISO 27001 & SOC-2", desc: "Bank-Grade Security" }
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(sections.find((s) => id(s) === e.target.id))),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(id(s));
      el && obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* =========================================================================
          HERO SECTION: Expansive Wide-Screen Showcase with macOS Mockup & Telemetry
          ========================================================================= */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: `radial-gradient(65% 65% at 75% 15%, hsl(${p.hue} 85% 40% / .32), transparent 75%)` }}
        />
        <div className="grid-bg pointer-events-none absolute inset-0" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: p.name }]} />

          {/* Top Pill Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold text-electric">
              <Sparkles size={12} />
              {typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug) : (p.category || "Enterprise Suite")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cool">
              <Activity size={12} className="text-emerald-400" />
              99.99% Cloud SLA
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cool">
              <Layers size={12} className="text-cyan-400" />
              {p.deployment || "Cloud Native"}
            </span>
          </div>

          <div className="mt-6 grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
            {/* Left Content Column */}
            <div className="flex flex-col justify-center">
              <h1 className="h-display text-4xl sm:text-6xl lg:text-7xl leading-[1.08]">
                {p.name}
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-medium text-white/90 leading-snug">
                {p.tagline}
              </p>
              <p className="lead mt-5 max-w-xl text-cool/90 leading-relaxed">
                {p.description}
              </p>

              {/* Price Callout */}
              <div className="mt-6 flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium uppercase tracking-wider text-cool">Starting from</span>
                <span className="text-3xl font-bold tracking-tight text-white">
                  {formatPrice(startingPrice(p))}
                </span>
                <span className="text-sm text-cool">/month billed {cycle}</span>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={`/demo?product=${p.slug}&type=trial`} arrow className="shadow-lg shadow-electric/25">
                  Start Free Trial
                </Button>
                <Button href={`/demo?product=${p.slug}`} variant="secondary">
                  Book Live Demo
                </Button>
                <Button href="#modules" variant="tertiary">
                  Explore Modules ↓
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 pt-6 text-xs text-cool">
                {trustMetrics.map((t, idx) => (
                  <div key={idx}>
                    <div className="font-semibold text-white">{t.title}</div>
                    <div>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Showcase: Grand Wide-Screen Browser Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Dynamic Ambient Glow matching product hue */}
              <div
                className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 pointer-events-none"
                style={{ background: `hsl(${p.hue} 85% 50% / .3)` }}
              />

              {/* Mac-style Window Frame Mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#090d19] shadow-2xl backdrop-blur-2xl group">
                {/* Window Chrome Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 inline-block shadow-sm" />
                  </div>

                  {/* Browser URL Badge */}
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1 text-xs text-cool/90">
                    <Lock size={11} className="text-emerald-400" />
                    <span className="font-mono text-[11px] tracking-tight text-white/80">
                      https://app.dezoryn.com/{p.slug}
                    </span>
                  </div>

                  {/* Expand / Fullscreen View Button */}
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-cool hover:border-electric/50 hover:text-white transition"
                    title="Open Fullscreen View"
                  >
                    <Maximize2 size={12} />
                    <span className="hidden sm:inline text-[11px]">Enlarge</span>
                  </button>
                </div>

                {/* Main Showcase Image Stage */}
                <div
                  onClick={() => setIsFullscreen(true)}
                  className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-[#070b16] cursor-pointer"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={`${p.name} Enterprise Dashboard Showcase`}
                      className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-8 text-center bg-gradient-to-br from-[#0c1222] to-[#050811]">
                      <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/20 text-electric">
                          <Cpu size={32} />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-white">{p.name} Production Workspace</h3>
                        <p className="mt-2 text-sm text-cool">High-throughput enterprise application suite</p>
                      </div>
                    </div>
                  )}

                  {/* Gradient vignettes */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />

                  {/* Floating Glassmorphism Telemetry Cards */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-black/70 px-3.5 py-2 backdrop-blur-xl shadow-xl flex items-center gap-2.5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric/20 text-electric">
                      <Zap size={14} />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-semibold text-white">{telemetryBadges[0].title}</div>
                      <div className="text-[10px] text-cool">{telemetryBadges[0].desc}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-4 right-4 rounded-xl border border-white/15 bg-black/70 px-3.5 py-2 backdrop-blur-xl shadow-xl flex items-center gap-2.5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-semibold text-white">{telemetryBadges[1].title}</div>
                      <div className="text-[10px] text-cool">{telemetryBadges[1].desc}</div>
                    </div>
                  </motion.div>

                  {/* Overlay click prompt */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20">
                    <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
                      <Maximize2 size={13} />
                      Click to Expand High-Res Showcase
                    </span>
                  </div>
                </div>

                {/* Bottom Mockup Status Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-cool">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Production Cluster: 100% Operational</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>Multi-Tenant DB</span>
                    <span>•</span>
                    <span>REST / GraphQL APIs</span>
                    <span>•</span>
                    <span>Webhook Automation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && p.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-2xl"
            onClick={() => setIsFullscreen(false)}
          >
            <div
              className="relative max-h-[92vh] max-w-6xl w-full overflow-hidden rounded-2xl border border-white/20 bg-[#090d19] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white text-sm">{p.name} • Full Workspace View</span>
                  <span className="rounded-full bg-electric/20 px-2.5 py-0.5 text-xs text-electric">High-Res UI</span>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-lg p-1.5 text-cool hover:bg-white/10 hover:text-white transition"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Image */}
              <div className="max-h-[80vh] overflow-auto bg-black p-2 flex items-center justify-center">
                <img
                  src={p.image}
                  alt={`${p.name} Fullscreen Inspection`}
                  className="max-h-[76vh] w-auto rounded-lg object-contain shadow-2xl"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-5 py-3 text-xs text-cool">
                <span>Enterprise UI Mockup for {p.name}</span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-lg bg-electric px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-electric-light"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Secondary Nav */}
      <div className="sticky top-16 z-30 border-y border-line bg-ink/85 backdrop-blur-xl">
        <div className="container-x flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${id(s)}`}
              className={`relative shrink-0 px-4 py-3.5 text-sm transition ${
                active === s ? "text-white" : "text-cool hover:text-white"
              }`}
            >
              {s}
              {active === s && (
                <motion.span layoutId="tab-underline" className="absolute inset-x-3 bottom-0 h-0.5 bg-electric" />
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      <section id="overview" className="section scroll-mt-28">
        <div className="container-x">
          <Reveal>
            <h2 className="h-section max-w-2xl">Key enterprise benefits</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.benefits.map((b, i) => (
              <Reveal key={b} delay={i * 0.05}>
                <div className="card card-hover h-full p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/15 text-electric">
                    <Check size={16} />
                  </span>
                  <p className="mt-5 font-medium leading-snug">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section scroll-mt-28 bg-midnight/60">
        <div className="container-x">
          <Reveal>
            <h2 className="h-section">Features & Capabilities</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.04}>
                <div className="card card-hover h-full p-6">
                  <h3 className="font-semibold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-cool leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODULES SECTION: Replaced Repetitive Chart Canvas with Dynamic AI Simulator
          ========================================================================= */}
      <section id="modules" className="section scroll-mt-28">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-electric">
              Modular Architecture
            </span>
            <h2 className="h-section mt-2">Interactive Modules & AI Workspaces</h2>
            <p className="lead mt-3">
              Explore how each module operates in real time with live telemetry, automated records, and Dezoryn Neural Copilot workflows.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr]">
            {/* Left Module Tabs List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-cool/80 px-1 mb-3">
                Select Workspace ({p.modules.length} Modules)
              </div>
              <div role="tablist" aria-label="Modules" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
                {p.modules.map((m, i) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={mod === i}
                    onClick={() => setMod(i)}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      mod === i
                        ? "bg-electric text-white shadow-lg shadow-electric/25"
                        : "border border-white/5 bg-white/[0.02] text-cool hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs ${
                          mod === i ? "text-white/80" : "text-cool/60 group-hover:text-cool"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{m}</span>
                    </div>
                    {mod === i && <ArrowRight size={14} className="text-white shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Module Assistance Tip */}
              <div className="mt-6 hidden lg:block rounded-xl border border-white/8 bg-white/[0.02] p-4 text-xs text-cool">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles size={14} className="text-electric" />
                  Custom Deployments
                </div>
                <p className="mt-2 leading-relaxed">
                  Need custom module workflows or ERP integrations? We build tailored pipelines for enterprise clients.
                </p>
                <a
                  href={`/contact?product=${p.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-electric font-medium hover:underline"
                >
                  Talk to a Solutions Architect →
                </a>
              </div>
            </div>

            {/* Right Interactive AI Workspace Stage */}
            <div>
              <ModuleWorkspace product={p} activeIndex={mod} onSelectModule={setMod} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section scroll-mt-28 bg-midnight/60">
        <div className="container-x">
          <Reveal>
            <h2 className="h-section">Deployment & Onboarding Process</h2>
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <li className="relative list-none">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-electric/50 text-sm font-semibold text-electric">
                      {i + 1}
                    </span>
                    {i < 3 && (
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-electric/50 to-transparent md:block" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{t}</h3>
                  <p className="mt-1 text-sm text-cool leading-relaxed">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="section scroll-mt-28">
        <div className="container-x">
          <h2 className="h-section">Enterprise Integrations</h2>
          <p className="lead mt-3 max-w-xl">
            Pre-built connectors to synchronize data with your existing productivity and identity stack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.integrations.map((x) => (
              <span key={x} className="card flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium">
                <Plug size={15} className="text-electric" />
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Case Study Spotlight */}
      {relatedProject && (
        <section id="case-study" className="section scroll-mt-28 bg-[#050811] border-y border-line">
          <div className="container-x">
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16] relative overflow-hidden">
              <div className="absolute top-0 right-0 h-48 w-48 bg-electric/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Real-World Case Study
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-cool">
                      {relatedProject.type}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                    {relatedProject.name}
                  </h2>

                  {(caseDetails?.clientScale || caseDetails?.timeline) && (
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {caseDetails?.clientScale && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-midnight/80 px-3 py-1.5 text-xs font-mono text-white/90">
                          <Building2 size={13} className="text-electric shrink-0" />
                          {caseDetails.clientScale}
                        </span>
                      )}
                      {caseDetails?.timeline && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-midnight/80 px-3 py-1.5 text-xs font-mono text-white/90">
                          <Clock size={13} className="text-amber-400 shrink-0" />
                          {caseDetails.timeline}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-cool leading-relaxed">
                    {caseDetails?.overview || relatedProject.result}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button href={`/case-studies/${relatedProject.slug}`} arrow>
                      Read Full Case Study
                    </Button>
                    <a
                      href={`/contact?subject=Product%20Inquiry%20${encodeURIComponent(relatedProject.name)}`}
                      className="text-xs font-mono text-cool hover:text-white transition px-3 py-2"
                    >
                      Ask Questions About This Product →
                    </a>
                  </div>
                </div>

                {caseDetails?.metrics && caseDetails.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {caseDetails.metrics.slice(0, 4).map((m, idx) => (
                      <div key={idx} className="rounded-xl border border-white/10 bg-midnight/90 p-4 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-electric uppercase tracking-wider line-clamp-1">{m.category || m.label}</div>
                          <div className="mt-1 text-sm font-bold text-white line-clamp-2">{m.title || m.label}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 font-mono">{m.metric || m.change}</span>
                          <span className="text-[10px] font-mono text-white/40">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Security Section */}
      <section id="security" className="section scroll-mt-28 bg-midnight/60">
        <div className="container-x">
          <h2 className="h-section">Compliance & Bank-Grade Security</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {security.map(([I, t, d]) => (
              <div key={t} className="card p-6">
                <I size={22} className="text-electric" />
                <div className="mt-5 font-semibold text-white">{t}</div>
                <p className="mt-1 text-sm text-cool leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section scroll-mt-28">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="h-section">Transparent Pricing</h2>
              <p className="lead mt-2">Scale as your team grows with zero hidden fees.</p>
            </div>
            <BillingToggle cycle={cycle} setCycle={setCycle} />
          </div>
          <div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch py-4"
            onMouseLeave={() => setPricingHoveredIdx(null)}
          >
            {p.plans.map((pl, i) => {
              const defaultPopular = p.plans.findIndex((plan) => plan.highlighted || plan.highlight);
              const activeIdx = pricingHoveredIdx !== null ? pricingHoveredIdx : (defaultPopular !== -1 ? defaultPopular : 1);
              return (
                <PricingCard
                  key={pl.id}
                  plan={pl}
                  cycle={cycle}
                  product={p.slug}
                  index={i}
                  isActive={i === activeIdx}
                  isHoveredDirectly={i === pricingHoveredIdx}
                  isAnyHovered={pricingHoveredIdx !== null}
                  onHover={() => setPricingHoveredIdx(i)}
                  onLeave={() => {}}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section scroll-mt-28 pt-0">
        <div className="container-x max-w-4xl">
          <h2 className="mb-8 text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          <FAQ items={p.faq} />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        primary={["Start Free Trial", `/demo?product=${p.slug}&type=trial`]}
        secondary={["Book Demo", `/demo?product=${p.slug}`]}
      />
    </>
  );
}
