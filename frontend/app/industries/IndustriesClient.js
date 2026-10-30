"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Building,
  GraduationCap,
  Building2,
  HeartPulse,
  Factory,
  ShoppingBag,
  Landmark,
  ConciergeBell,
  Truck,
  Briefcase,
  Home,
  Check,
} from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import { industries, getProduct, products } from "@/lib/data";
import api from "@/lib/axios";

const CATEGORIES = [
  "All",
  "Institutional",
  "Healthcare & Communities",
  "Operations & Logistics",
  "Commerce & Finance",
];

const industryCategoryMap = {
  education: "Institutional",
  "professional-services": "Institutional",
  healthcare: "Healthcare & Communities",
  "residential-communities": "Healthcare & Communities",
  hospitality: "Healthcare & Communities",
  manufacturing: "Operations & Logistics",
  logistics: "Operations & Logistics",
  "real-estate": "Operations & Logistics",
  retail: "Commerce & Finance",
  finance: "Commerce & Finance",
};

const industryFaqs = [
  [
    "Can DEZORYN SaaS platforms be customized for specific industry workflows?",
    "Yes. While platforms are pre-engineered around industry best practices (e.g., student rosters for education, EHR beds for hospitals), modular settings allow custom fields, approval chains, and localized tax/grading schemes.",
  ],
  [
    "How does DEZORYN handle data migration from legacy industry software?",
    "We provide standardized CSV/JSON ingestion tooling, automated deduplication, and schema mapping. Our solutions engineering team oversees end-to-end data cutovers with staging validation.",
  ],
  [
    "Are industry platforms compliant with regional and international standards?",
    "Every platform enforces TLS 1.3 in transit, AES-256 at rest, strict tenant-boundary isolation, and audit trails required for HIPAA, GDPR, ISO 27001, and FERPA standards.",
  ],
  [
    "Can one enterprise subscription span multiple industries or operating branches?",
    "Yes. DEZORYN's multi-tenant architecture supports multi-entity corporate structures, permitting unified executive oversight across schools, clinics, manufacturing facilities, or retail subsidiaries.",
  ],
];

export default function IndustriesClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liveList, setLiveList] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Direct Axios API call inside IndustriesClient
    api.get("/api/v1/industries")
      .then((res) => {
        const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        if (mounted && Array.isArray(data) && data.length > 0) {
          setLiveList(data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const displayedIndustries = useMemo(() => {
    const list = (liveList && liveList.length > 0) ? liveList : industries;
    if (activeCategory === "All") return list;
    return list.filter((ind) => {
      const cat = industryCategoryMap[ind.slug] || "Institutional";
      return cat === activeCategory;
    });
  }, [activeCategory, liveList]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[450px] w-[600px] rounded-full bg-electric/20 blur-[130px]" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Industries" }]} />

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-5 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <Building size={14} className="text-electric" />
              <span>VERTICAL DOMAIN ARCHITECTURES</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Specialized Software for <span className="text-gradient-blue">Global Industries.</span>
            </h1>

            <p className="lead mt-6 text-cool max-w-3xl text-base sm:text-lg leading-relaxed">
              Every vertical industry operates under unique regulatory frameworks, workflows, and operating rhythms. DEZORYN architects domain-specific SaaS platforms and enterprise architectures engineered to eliminate operational friction across education, healthcare, manufacturing, and commerce.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-line/60 pt-8">
              <div>
                <p className="text-2xl font-bold font-mono text-white">10+</p>
                <p className="text-xs text-cool mt-1">Vertical Sectors Served</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">99.99%</p>
                <p className="text-xs text-cool mt-1">Target Infrastructure SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">AES-256</p>
                <p className="text-xs text-cool mt-1">Tenant Data Encryption</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">USD</p>
                <p className="text-xs text-cool mt-1">Global Standard Billing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY DIRECTORY SECTION ─── */}
      <section className="section border-b border-line">
        <div className="container-x">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-line/50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white font-semibold shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-[#60a5fa]/50 -translate-y-0.5"
                    : "bg-[#0b1120] text-cool hover:text-white border border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Industry Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedIndustries.map((ind) => {
              const directProds = (ind.products || []).map(getProduct).filter(Boolean);
              const matchedProds = (products || []).filter(
                (p) =>
                  Array.isArray(p.industries) &&
                  p.industries.includes(ind.slug) &&
                  !directProds.some((dp) => dp.slug === p.slug)
              );
              const pairedProducts = [...directProds, ...matchedProds];

              return (
                <div
                  key={ind.slug}
                  className="card group relative flex flex-col justify-between p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-sky-400/50 hover:shadow-[0_20px_45px_rgba(56,189,248,0.2)] overflow-hidden bg-[#070b16]/95 border-white/10"
                >
                  {/* Top Glowing Laser Border Beam */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_15px_#38bdf8]" />

                  {/* Corner Glow Flare */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-500/10 blur-2xl group-hover:bg-sky-500/25 transition-all duration-500" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#060a18] text-sky-400 group-hover:border-sky-400/50 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-300">
                        <Icon name={ind.icon} size={20} />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cool/80 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        {industryCategoryMap[ind.slug] || "Vertical"}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors duration-200">
                        {ind.name}
                      </h2>
                      <span className="text-[11px] font-mono text-sky-400 shrink-0">
                        {pairedProducts.length > 0
                          ? `${pairedProducts.length} ${pairedProducts.length === 1 ? "Platform" : "Platforms"}`
                          : "Bespoke Scope"}
                      </span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">
                      {ind.description}
                    </p>

                    {/* Operational Highlights / Pain Points Solved */}
                    {ind.painPoints && ind.painPoints.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-line/60">
                        <p className="text-[11px] font-mono uppercase text-cool/70 mb-2">
                          Domain Workflows Automated:
                        </p>
                        <ul className="space-y-1.5">
                          {ind.painPoints.slice(0, 3).map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-cool/90">
                              <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Paired Products & Deep-Dive Link */}
                  <div className="mt-6 pt-4 border-t border-line">
                    {pairedProducts.length > 0 ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-mono uppercase text-cool/70 flex items-center gap-1.5">
                            <Sparkles size={11} className="text-electric" />
                            <span>Software for {ind.name} ({pairedProducts.length}):</span>
                          </p>
                          <span className="text-[10px] font-mono text-emerald-400 font-medium">Ready</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {pairedProducts.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/products/${p.slug}`}
                              className="text-[11px] text-white/90 hover:text-white bg-white/[0.04] hover:bg-electric/20 border border-white/10 hover:border-electric/40 px-2 py-0.5 rounded transition-all inline-flex items-center gap-1"
                            >
                              <span className="h-1 w-1 rounded-full bg-electric shrink-0" />
                              <span>{p.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-mono uppercase text-cool/60 flex items-center gap-1.5">
                            <Sparkles size={11} className="text-cool/40" />
                            <span>Architecture Delivery:</span>
                          </p>
                          <span className="text-[10px] font-mono text-blue-400 font-medium">Custom Scope</span>
                        </div>
                        <div className="text-[11px] text-cool/80 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded inline-flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-blue-400/60 shrink-0" />
                          <span>Custom Enterprise ERP &amp; Integrations</span>
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/industries/${ind.slug}`}
                      className="inline-flex w-full items-center justify-between text-xs font-semibold text-white group-hover:text-electric transition-colors pt-2 border-t border-white/5"
                    >
                      <span>
                        {pairedProducts.length > 0
                          ? `Explore ${ind.name} Software (${pairedProducts.length})`
                          : `Explore ${ind.name} Architecture`}
                      </span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ADVANTAGE SECTION ─── */}
      <section className="section bg-[#030611] border-b border-line">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Engineering Principles
            </span>
            <h2 className="h-section mt-1">
              Why Vertical-Engineered SaaS Outperforms Generic Software
            </h2>
            <p className="lead mt-3 text-cool">
              Generic one-size-fits-all tools force frontline teams into awkward workarounds. DEZORYN vertical platforms are built specifically for domain realities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6 border-white/10 bg-[#070b16]">
              <span className="tag text-xs font-mono text-red-400 border-red-500/20 bg-red-500/10 mb-3">
                Generic Off-the-Shelf Tools
              </span>
              <h3 className="font-bold text-white text-base">Rigid &amp; Mismatched</h3>
              <p className="mt-2 text-xs text-cool leading-relaxed">
                Generic CRM or ERP tools lack industry terminology, domain workflows, and specialized regulatory checks, requiring costly third-party custom plugins.
              </p>
            </div>

            <div className="card p-6 border-white/10 bg-[#070b16]">
              <span className="tag text-xs font-mono text-amber-400 border-amber-500/20 bg-amber-500/10 mb-3">
                Fragile Agency Builds
              </span>
              <h3 className="font-bold text-white text-base">High TCO &amp; Abandonware</h3>
              <p className="mt-2 text-xs text-cool leading-relaxed">
                Custom software agencies charge high upfront retainers, take months to deliver, and leave clients with unmaintained codebases vulnerable to security exploits.
              </p>
            </div>

            <div className="card p-6 border-electric/40 bg-gradient-to-br from-electric/10 via-[#070e24] to-[#040a1a] shadow-xl">
              <span className="tag text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 mb-3">
                DEZORYN Vertical SaaS
              </span>
              <h3 className="font-bold text-white text-base">Production-Ready &amp; Scalable</h3>
              <p className="mt-2 text-xs text-cool/90 leading-relaxed">
                Battle-tested platforms deploy in days with built-in industry schemas, automated workflows, continuous cloud updates, and dedicated 24/7 SLA uptime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY FAQ ─── */}
      <section className="section border-b border-line">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Implementation &amp; Security
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Industry Domain Solutions FAQ
            </h2>
          </div>
          <FAQ items={industryFaqs} />
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <CTASection
        title="Don't See Your Exact Industry Listed?"
        text="DEZORYN builds bespoke enterprise software, multi-tenant portals, and AI automation engines for specialized vertical sectors worldwide."
        primary={["Discuss Your Sector", "/contact-sales"]}
        secondary={["Explore Full Marketplace", "/marketplace"]}
      />
    </>
  );
}
