"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { posts } from "@/lib/data";
import { getLiveBlogPosts } from "@/lib/api";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Layers,
  ShieldCheck,
  Zap,
  Search,
  FileText,
  X,
  Clock,
  Calendar,
} from "lucide-react";

const CATEGORIES = ["All", "Guides", "Insights", "Architecture", "Developer Docs"];

const resourceFaqs = [
  [
    "How do developers integrate with DEZORYN platforms?",
    "DEZORYN platforms offer RESTful JSON endpoints and webhook event subscriptions. Development teams receive API reference documentation and sandbox access to build and test integrations reliably.",
  ],
  [
    "Where can we find product setup guides and implementation documentation?",
    "Detailed implementation guides, rollout checklists, and architectural overviews are published in the Guides and Docs sections on this page. Guided onboarding walkthroughs are also conducted during implementation.",
  ],
  [
    "How is API access authenticated and secured?",
    "All API transactions require secure HTTPS connections using bearer token authentication or API secret keys with scoped permissions to ensure business records and customer data remain protected.",
  ],
  [
    "Can we request custom integration assistance for our legacy systems?",
    "Yes. Our engineering and solutions team works directly with enterprise clients to plan, configure, and deploy custom webhooks and data connectors for existing on-premises or cloud systems.",
  ],
  [
    "How do webhooks deliver event notifications?",
    "When key business events occur (such as status updates, transactions, or new records), our platform dispatches a structured JSON payload to your configured webhook URL with verification signatures to ensure authenticity.",
  ],
];

export default function ResourcesClient() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    let mounted = true;
    // Fetch blog posts
    getLiveBlogPosts()
      .then((data) => {
        const live = data?.posts || (Array.isArray(data) ? data : null);
        if (mounted && Array.isArray(live) && live.length > 0) {
          const mapped = live.map((p, idx) => ({
            title: p.title,
            slug: p.slug,
            cat: p.category || p.cat || "Guides",
            summary: p.summary || p.excerpt || "",
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : p.date || "October 2026",
            read: p.readingTime || p.readTime || p.read || "5 min read",
            author: p.author?.name || p.author || "DEZORYN Engineering",
            image: p.image || "/resources/saas-architecture.jpg",
            hue: p.hue || (idx * 60) % 360,
          }));
          setAllPosts(mapped);
        }
      })
      .catch(() => {
        // Fallback to static posts from data.js
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPosts.filter((p) => {
      const postCat = (p.cat || p.category || "").toLowerCase();
      const matchesTab =
        activeTab === "All" ||
        postCat === activeTab.toLowerCase() ||
        (activeTab === "Developer Docs" &&
          (postCat.includes("developer") || postCat.includes("docs") || p.slug.includes("api")));

      const matchesSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.summary && p.summary.toLowerCase().includes(q)) ||
        (p.cat && p.cat.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, allPosts]);

  return (
    <section className="pb-28 pt-32">
      <div className="container-x">
        <Breadcrumb items={[{ label: "Resources" }]} />

        {/* ─── SECTION 1: HERO (RESOURCES & INSIGHTS) ─── */}
        <div className="max-w-4xl mt-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-[#9db8ff] shadow-sm shadow-electric/10">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <BookOpen size={13} className="text-electric" />
            <span>KNOWLEDGE BASE &amp; DOCUMENTATION</span>
          </div>
          <h1 className="h-display text-4xl sm:text-6xl text-white">
            Resources &amp; <span className="text-gradient-blue">Insights</span>
          </h1>
          <p className="lead mt-4 text-cool">
            Practical guides, technical documentation, and insights to help businesses evaluate, implement, and use modern software platforms.
          </p>
        </div>

        {/* ─── SECTION 2: RESOURCE CATEGORIES & SEARCH ─── */}
        <div className="mt-14 scroll-mt-24 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                aria-pressed={activeTab === cat}
                className={`relative rounded-xl px-4 py-2 text-xs font-medium transition duration-300 whitespace-nowrap ${
                  activeTab === cat
                    ? "text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] -translate-y-0.5"
                    : "border border-white/10 bg-white/[0.03] text-cool hover:text-white hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {activeTab === cat && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] border border-[#60a5fa]/50 -z-0" />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-72 group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-blue-400/30 blur opacity-30 group-hover:opacity-75 transition duration-300" />
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60a5fa]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources and articles..."
                aria-label="Search resources and articles"
                className="h-10 w-full rounded-xl border border-white/10 bg-[#070d1e]/90 pl-9 pr-8 text-xs text-white placeholder:text-cool/60 outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#3b82f6]/25 transition backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cool hover:text-white transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── SECTION 3: FEATURED RESOURCES (ARTICLES GRID) ─── */}
        <div className="mt-8">
          {filteredPosts.length === 0 ? (
            <div className="card py-16 text-center border-white/10 bg-[#070b16]">
              <FileText size={36} className="mx-auto text-cool/50 mb-3" />
              <p className="font-semibold text-white">No resources found.</p>
              <p className="mt-1 text-xs text-cool">
                Try adjusting your search query or switching to another category.
              </p>
              <button
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                }}
                className="btn btn-secondary mt-4 text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredPosts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.04}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group card card-hover relative flex h-full flex-col overflow-hidden p-3 border-white/10 bg-[#070b16]/90 transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_20px_45px_rgba(56,189,248,0.2)] hover:-translate-y-1.5"
                  >
                    {/* Top Laser Border Beam */}
                    <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_#38bdf8]" />

                    <div className="relative overflow-hidden rounded-lg">
                      <ProductArt
                        hue={200 + i * 30}
                        variant={i}
                        compact
                        image={p.image}
                        title={p.title}
                        className="h-44 transition-transform duration-700 ease-out group-hover:scale-108"
                      />

                      {/* Continuous Cyber Radar Scanline */}
                      <div className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-cyber-scan" />

                      <span className="absolute top-3 left-3 tag bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] shadow-sm">
                        {p.cat}
                      </span>
                      {p.read && (
                        <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/75 px-2 py-0.5 text-[9.5px] font-mono text-cool/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <Clock size={10} className="text-sky-400" />
                          {p.read.includes("read") ? p.read : `${p.read} read`}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      {p.date && (
                        <span className="text-[10px] font-mono text-cool/80 mb-1.5 flex items-center gap-1">
                          <Calendar size={10} className="text-sky-400/70" />
                          {p.date}
                        </span>
                      )}

                      <h2 className="font-bold text-sm leading-snug text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                        {p.title}
                      </h2>

                      <p className="mt-2 text-xs text-cool line-clamp-2 leading-relaxed">
                        {p.summary}
                      </p>

                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-cool border-t border-white/10">
                        <span className="text-xs font-semibold text-sky-400 group-hover:text-white transition-colors">
                          Read Article
                        </span>
                        <span className="inline-flex items-center text-sky-400 transition-transform duration-300 group-hover:translate-x-1.5">
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* ─── SECTION 4: DEVELOPER DOCUMENTATION (COMPACT MERGED SECTION) ─── */}
        <div id="docs" className="card mt-20 scroll-mt-24 p-6 sm:p-8 border-white/15 bg-gradient-to-br from-[#070d1e] via-[#050a18] to-[#030612]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-[#9db8ff] mb-2 font-mono">
                <Code2 size={14} className="text-electric" />
                <span>TECHNICAL DOCUMENTATION &amp; INTEGRATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Developer Documentation
              </h2>
              <p className="mt-2 text-sm text-cool max-w-2xl leading-relaxed">
                Connect DEZORYN platforms with your existing databases, third-party applications, and identity systems using our technical references and integration guides.
              </p>
            </div>

            <Link
              href="/resources/api"
              className="btn btn-primary text-xs shrink-0 self-start md:self-auto"
            >
              <span>Explore API Reference</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 4 Compact Integration Links */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/resources/api"
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-electric/50 hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15 text-electric group-hover:scale-105 transition-transform">
                <Code2 size={17} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-electric transition-colors">
                API Reference
              </h3>
              <p className="mt-1 text-xs text-cool leading-relaxed">
                Available endpoints, request formats, and response schemas.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-electric">
                View Reference <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/resources/guides"
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-electric/50 hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-400 group-hover:scale-105 transition-transform">
                <Layers size={17} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Integration Guides
              </h3>
              <p className="mt-1 text-xs text-cool leading-relaxed">
                Step-by-step technical guides for connecting tools and deploying workflows.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                Browse Guides <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/resources/docs"
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-electric/50 hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-400/15 text-indigo-400 group-hover:scale-105 transition-transform">
                <ShieldCheck size={17} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                Authentication &amp; Security
              </h3>
              <p className="mt-1 text-xs text-cool leading-relaxed">
                Token authentication, access permissions, and HTTPS transport security.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400">
                Read Security Specs <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/resources/api"
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-electric/50 hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400 group-hover:scale-105 transition-transform">
                <Zap size={17} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Webhook Documentation
              </h3>
              <p className="mt-1 text-xs text-cool leading-relaxed">
                Event notifications, payload structures, and signature verification.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                Explore Webhooks <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* ─── SECTION 5: FREQUENTLY ASKED QUESTIONS ─── */}
        <div id="faq" className="mt-20 max-w-4xl mx-auto scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Integration &amp; Technical Setup
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ items={resourceFaqs} />
        </div>

        {/* ─── SECTION 6: NEED TECHNICAL GUIDANCE? (FINAL CTA) ─── */}
        <div className="mt-20">
          <CTASection
            title="Need Technical Guidance?"
            text="Speak with our engineering team to review integration requirements, explore custom architecture, or get answers to specific deployment questions."
            primary={["Contact Sales", "/contact?solution=Integration%20%26%20Architecture"]}
            secondary={["View Developer Docs", "/resources/docs"]}
          />
        </div>
      </div>
    </section>
  );
}
