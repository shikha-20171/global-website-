"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Globe2,
  Smartphone,
  Database,
  Zap,
  Layers,
  Check,
  Quote,
} from "lucide-react";
import { projects } from "@/lib/data";
import { getLiveProjects } from "@/lib/api";

const CATEGORIES = [
  { id: "All", label: "All Projects" },
  { id: "Education", label: "Education" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Real Estate", label: "Real Estate & Society" },
  { id: "Enterprise", label: "Enterprise & HR" },
  { id: "Digital", label: "Messaging & Media" },
];

const CAPABILITIES = [
  {
    icon: Globe2,
    title: "Custom Web Applications",
    desc: "Fast, responsive web applications built with modern frameworks, intuitive navigation, and clean architecture.",
    tag: "Next.js • React • Node.js",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps (iOS & Android)",
    desc: "User-friendly native and cross-platform mobile apps for field workers, students, doctors, and customers.",
    tag: "React Native • Mobile APIs",
  },
  {
    icon: Database,
    title: "Enterprise Cloud Platforms",
    desc: "Multi-tenant cloud databases with role-based access control, automated backups, and 99.9% uptime reliability.",
    tag: "PostgreSQL • Redis • Cloud VPS",
  },
  {
    icon: Zap,
    title: "API & Workflow Automation",
    desc: "Seamless integrations with WhatsApp Business APIs, payment gateways, biometric scanners, and external tools.",
    tag: "Meta API • Webhooks • UPI",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Schooly Core streamlined fee collections and parent notices across all our campuses. Parents love the real-time mobile app updates.",
    author: "Rajesh Singhania",
    role: "Managing Trustee, K-12 Academy Group",
    product: "Schooly Core Campus ERP",
  },
  {
    quote:
      "Dezo Care cut down outpatient waiting times significantly and gave our doctors immediate digital access to past medical records.",
    author: "Dr. Arvind Sharma",
    role: "Medical Director, Care Clinic Network",
    product: "Dezo Care Hospital ERP",
  },
  {
    quote:
      "Real Estate OS eliminated double-bookings and made our tower inventory and payment plans completely transparent for sales brokers.",
    author: "Meera Nair",
    role: "VP of Sales Operations, Apex Realty",
    product: "Real Estate Property Platform",
  },
];

const STATS = [
  { number: "13+", label: "Delivered Platforms", sub: "Active in Production" },
  { number: "10+", label: "Industry Domains", sub: "Education, Health, Real Estate +" },
  { number: "99.9%", label: "Measured Cloud Uptime", sub: "24/7 High Availability" },
  { number: "100%", label: "Client Delivery Success", sub: "Verified Deployments" },
];

export default function PortfolioView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveProjects, setLiveProjects] = useState(projects);

  useEffect(() => {
    let mounted = true;
    // [API IMPLEMENTATION] getLiveProjects() -> GET /api/v1/projects
    getLiveProjects()
      .then((data) => {
        if (!mounted || !Array.isArray(data) || data.length === 0) return;
        const normalized = data.map((d) => {
          const matchedStatic = projects.find((p) => p.slug === d.slug);
          return {
            ...(matchedStatic || {}),
            ...d,
            name: d.name || d.title || matchedStatic?.name,
            industry: d.industry || d.category || matchedStatic?.industry || "Enterprise",
            result: d.shortDescription || d.summary || matchedStatic?.result || "",
            tech: Array.isArray(d.techStack)
              ? d.techStack
              : Array.isArray(d.tech)
              ? d.tech
              : matchedStatic?.tech || ["Next.js", "PostgreSQL"],
          };
        });
        setLiveProjects(normalized);
      })
      .catch((err) => {
        console.warn("Portfolio live projects notice:", err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return liveProjects.filter((p) => {
      // Category filter
      let matchCategory = true;
      if (selectedCategory === "Education") {
        matchCategory = p.industry === "Education";
      } else if (selectedCategory === "Healthcare") {
        matchCategory = p.industry === "Healthcare";
      } else if (selectedCategory === "Real Estate") {
        matchCategory = p.industry === "Real Estate" || p.industry === "Residential Communities";
      } else if (selectedCategory === "Enterprise") {
        matchCategory = p.industry === "HR" || p.industry === "CRM" || p.industry === "Finance";
      } else if (selectedCategory === "Digital") {
        matchCategory = p.industry === "Retail" || p.industry === "Media";
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const techList = Array.isArray(p.tech) ? p.tech : [];
      const matchSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.industry && p.industry.toLowerCase().includes(q)) ||
        (p.result && p.result.toLowerCase().includes(q)) ||
        techList.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery, liveProjects]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-14 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[420px] w-[520px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Portfolio" },
            ]}
          />

          <div className="max-w-4xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3 shadow-sm shadow-electric/10">
              <Sparkles size={12} className="text-electric animate-pulse" />
              <span>OUR WORK &amp; CLIENT PROJECTS</span>
            </div>

            <h1 className="h-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              Software We Have Built &amp; <span className="text-gradient-blue">Delivered.</span>
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed max-w-3xl">
              A curated collection of web applications, mobile platforms, and enterprise software engineered for real-world businesses across education, healthcare, real estate, and retail.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-8 border-t border-line/60">
            {STATS.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{s.number}</div>
                <div className="mt-1 text-xs text-white/90 font-semibold">{s.label}</div>
                <p className="mt-0.5 text-[11px] text-cool">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN PORTFOLIO CONTENT ─── */}
      <section className="section bg-[#050811] border-b border-line">
        <div className="container-x">
          {/* ─── FEATURED FLAGSHIP SPOTLIGHT ─── */}
          <div className="mb-16 rounded-2xl border border-electric/30 bg-gradient-to-br from-electric/10 via-[#070b16] to-[#040711] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 bg-electric/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/15 px-3 py-1 text-xs font-mono text-electric mb-3">
                  <Sparkles size={12} />
                  <span>FEATURED FLAGSHIP SYSTEM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  Schooly Core Campus ERP
                </h2>
                <p className="mt-3 text-sm sm:text-base text-cool leading-relaxed">
                  A comprehensive digital campus operating system serving multi-branch schools. Connects student admissions, automated fee collections, real-time bus tracking, teacher timetables, and direct parent mobile notifications.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs text-white/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Same-Day Fee Reconciliation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Live RFID Gate &amp; Attendance Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Direct Parent Mobile App Notices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Board-Compliant Digital Grade Cards</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/case-studies/schooly-core-campus"
                    className="btn btn-primary h-11 px-6 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-electric/25"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/projects/schooly-core-campus"
                    className="btn btn-secondary h-11 px-5 text-xs sm:text-sm font-medium flex items-center gap-1.5"
                  >
                    <span>Technical Specs</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl group">
                  <img
                    src="/products/schooly-core.jpg"
                    alt="Schooly Core Campus ERP"
                    className="w-full h-64 sm:h-80 object-cover object-center transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10">
                    <span className="text-white/80">Active in 120+ Campuses</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live in Production
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── PORTFOLIO DIRECTORY CONTROLS ─── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-electric">
                Portfolio Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Explore All Completed Projects
              </h2>
              <p className="text-sm text-cool mt-1">
                Filter by industry category or search by keywords and technology stack.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative min-w-[280px] sm:min-w-[320px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cool pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or tech stack..."
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-cool/60 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cool hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Clean Single-Row Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-4 border-b border-white/5">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? "bg-electric text-white shadow-md shadow-electric/25"
                      : "border border-white/10 bg-white/[0.03] text-cool hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-cool">
              Showing <strong className="text-white">{filteredProjects.length}</strong> of{" "}
              {projects.length} systems
            </span>
          </div>

          {/* ─── GRID OF PROJECTS (Clean 3-column cards) ─── */}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="group card card-hover flex flex-col justify-between overflow-hidden border-white/10 bg-[#070b16] hover:border-electric/40 transition-all duration-300"
                >
                  <div>
                    {/* Project Preview Image */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0a0f1b]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-black/30" />
                      
                      <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-white">
                        {p.industry}
                      </span>
                      <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                        {p.type}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white group-hover:text-electric transition-colors leading-snug">
                        {p.name}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-cool leading-relaxed line-clamp-2">
                        {p.result}
                      </p>

                      {/* Tech stack */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-white/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-line/60 flex items-center justify-between">
                      <Link
                        href={`/case-studies/${p.slug}`}
                        className="text-xs font-mono font-semibold text-electric group-hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>View Case Study</span>
                        <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="text-xs font-mono text-cool hover:text-white transition inline-flex items-center gap-1"
                      >
                        <span>Specs</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="card mt-8 py-16 text-center text-cool">
              <Search size={32} className="mx-auto text-cool/40 mb-3" />
              <p className="text-base font-semibold text-white">No projects found</p>
              <p className="text-xs text-cool mt-1">Try resetting the category filter or search query.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 btn btn-secondary text-xs px-4 py-2"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHAT WE BUILD (CORE CAPABILITIES) ─── */}
      <section className="section bg-[#070b16] border-b border-line">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              What We Build For Our Clients
            </h2>
            <p className="text-sm text-cool mt-2 leading-relaxed">
              From custom cloud applications to automated mobile workflows, we turn complex business operations into fast, easy-to-use software.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="card p-6 border-white/10 bg-[#050811] hover:border-electric/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-11 w-11 rounded-xl bg-electric/10 border border-electric/25 flex items-center justify-center text-electric mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                    <p className="text-xs sm:text-sm text-cool leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-electric">
                    {c.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CLIENT TESTIMONIALS & IMPACT ─── */}
      <section className="section bg-[#050811] border-b border-line">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Real Results for Real Businesses
            </h2>
            <p className="text-sm text-cool mt-2">
              See how organizations across healthcare, education, and real estate transformed their daily operations with our software.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="card p-6 border-white/10 bg-[#070b16] flex flex-col justify-between"
              >
                <div>
                  <Quote size={20} className="text-electric/40 mb-3" />
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60">
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-xs text-cool">{t.role}</div>
                  <div className="text-[11px] font-mono text-electric mt-1">{t.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION SECTION ─── */}
      <section className="py-20 bg-gradient-to-b from-[#070b16] to-[#04060d] text-center border-b border-line relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-electric/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="container-x relative max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Have a Project in Mind? Let's Build It.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cool leading-relaxed">
            Whether you need a custom web platform, mobile application, or full-scale enterprise software, our team is ready to help you plan, design, and launch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn btn-primary h-12 px-8 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-electric/25"
            >
              <span>Start a Project</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/products"
              className="btn btn-secondary h-12 px-7 text-sm font-medium"
            >
              Browse Ready Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
