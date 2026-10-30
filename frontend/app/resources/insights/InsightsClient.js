"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import api from "@/lib/axios";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

export const whitepapers = [
  {
    id: "saas-tco-benchmark-2026",
    title: "2026 Global Enterprise SaaS Benchmark: Total Cost of Ownership (TCO) vs In-House Builds",
    format: "Executive Whitepaper (38 Pages)",
    pages: "38 Pages",
    date: "October 2026",
    category: "Financial ROI & Procurement",
    abstract:
      "A quantitative financial audit comparing multi-year capital expenditure (CapEx) and operational overhead (OpEx) between multi-tenant commercial SaaS platforms and bespoke in-house software development.",
    keyMetrics: [
      ["64% Average TCO Savings", "Compared with maintaining custom bespoke agency builds over a 3-year horizon."],
      ["14-Day Deployment Velocity", "Average time from procurement to live production onboarding across branches."],
      ["99.98% SLA Availability", "Elimination of internal DevOps maintenance and emergency server patching costs."],
    ],
    audience: "Chief Technology Officers, Chief Financial Officers, IT Procurement Directors",
    downloadUrl: "/resources/insights",
  },
  {
    id: "sovereign-cloud-architecture",
    title: "Sovereign Multi-Tenant Cloud Architecture: Data Privacy, RLS & Regulatory Compliance",
    format: "Technical Architecture Report (44 Pages)",
    pages: "44 Pages",
    date: "September 2026",
    category: "Security & Compliance",
    abstract:
      "Architectural patterns for achieving absolute tenant data isolation, zero-trust cryptographic boundaries, and strict compliance with regional data protection frameworks (GDPR, SOC-2, HIPAA, FERPA).",
    keyMetrics: [
      ["Zero Cross-Tenant Leakage", "Kernel-level PostgreSQL Row-Level Security (RLS) with session-injected claims."],
      ["AES-256 Envelope Encryption", "Dedicated tenant keys managed via hardware security modules (HSM/KMS)."],
      ["Immutable Audit Logging", "Cryptographically verifiable records for all administrative mutations and queries."],
    ],
    audience: "Principal Security Architects, Compliance Officers, Lead Data Engineers",
    downloadUrl: "/resources/insights",
  },
  {
    id: "autonomous-workflow-economics",
    title: "Autonomous Workflow Economics: How AI Assistants Reduce Operational Swivel-Chair Overhead",
    format: "Market Research Study (28 Pages)",
    pages: "28 Pages",
    date: "August 2026",
    category: "AI & Workflow Automation",
    abstract:
      "Field research across 150 commercial organizations measuring productivity gains when deploying deterministic business rules paired with domain-specific AI models for invoice parsing, lead routing, and roster planning.",
    keyMetrics: [
      ["82% Reduction in Manual Entry", "Direct elimination of copy-paste data transcription between disparate software tools."],
      ["Sub-50ms Decision Latency", "Automated real-time approval pipelines for standard expense and booking transactions."],
      ["Zero Model Hallucination", "Achieved by restricting generative AI to extraction while business rules remain deterministic."],
    ],
    audience: "Operations Directors, Chief Operating Officers, Transformation Leads",
    downloadUrl: "/resources/insights",
  },
  {
    id: "modernizing-campus-healthcare-erp",
    title: "Modernizing Campus & Healthcare Infrastructure: A Post-Legacy Migration Analysis",
    format: "Industry Case Study Report (32 Pages)",
    pages: "32 Pages",
    date: "July 2026",
    category: "Domain Digital Transformation",
    abstract:
      "A retrospective study on migrating multi-branch colleges, hospitals, and residential townships from fragmented desktop software and paper receipt books to unified multi-tenant cloud ecosystems.",
    keyMetrics: [
      ["100% Digital Fee Reconciliation", "Instant automated payment receipts with daily zero-variance cash reconciliation."],
      ["75% Shorter OPD Wait Times", "Tokenized queue routing and digital prescription fulfillment across specialty clinics."],
      ["Zero System Downtime", "Phased Strangler Fig migration protocol preserving operational continuity throughout cutover."],
    ],
    audience: "Campus Registrars, Hospital Directors, Society Board Members",
    downloadUrl: "/resources/insights",
  },
];

export default function InsightsPage() {
  const [downloaded, setDownloaded] = useState({});
  const [papers, setPapers] = useState(whitepapers);

  useEffect(() => {
    let active = true;
    // Direct Axios API call inside InsightsClient
    api.get("/api/v1/resources/insights")
      .then((response) => {
        if (!active) return;
        const res = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        const list = Array.isArray(res) ? res : res?.data || [];
        if (list.length > 0) {
          const normalized = list.map((item) => ({
            id: item.id || item.slug,
            title: item.title,
            format: `Executive Whitepaper (${item.pagesCount || 38} Pages)`,
            pages: `${item.pagesCount || 38} Pages`,
            date: item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recent",
            category: item.sector || (item.tags && item.tags[0]) || "Research & Architecture",
            abstract: item.summary || "",
            keyMetrics: [
              [`${item.pagesCount || 38} Pages of Analysis`, "Comprehensive system design and technical architecture specifications."],
              [`${item.downloadCount || 1000}+ Downloads`, "Verified industry citation and benchmark data."],
              ["Zero Vendor Lock-in", "Open standard compliance and portable deployment specifications."],
            ],
            audience: item.author ? `${item.author} & Systems Architects` : "CTOs, Enterprise Architects, Engineering Leaders",
            downloadUrl: item.pdfAssetUrl || "/resources/insights",
          }));
          setPapers(normalized);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleDownload = (id) => {
    setDownloaded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setDownloaded((prev) => ({ ...prev, [id]: false }));
    }, 3000);
  };

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Executive Insights & Whitepapers" },
            ]}
          />

          <div className="max-w-5xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <BarChart3 size={13} className="text-electric" />
              <span>EXECUTIVE RESEARCH &amp; WHITEPAPERS</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Technology Insights &amp; Research.
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              In-depth research reports, total cost of ownership benchmarks, multi-tenant cloud architectures, and quantitative ROI analyses authored by DEZORYN systems architects.
            </p>
          </div>
        </div>
      </section>

      {/* Reports Directory */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="space-y-8">
            {papers.map((wp, idx) => (
              <Reveal key={wp.id} delay={idx * 0.05}>
                <div className="card border-white/10 bg-[#070b16] p-7 sm:p-9 rounded-2xl transition-all duration-300 hover:border-electric/40 hover:shadow-2xl hover:shadow-electric/10">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-3">
                        <span className="tag text-electric border-electric/30 bg-electric/10">
                          {wp.category}
                        </span>
                        <span className="text-cool/80 flex items-center gap-1">
                          <Calendar size={12} /> {wp.date}
                        </span>
                        <span className="text-cool/80">•</span>
                        <span className="text-white/80 font-medium">{wp.pages}</span>
                      </div>

                      <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
                        {wp.title}
                      </h2>

                      <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed max-w-3xl font-sans">
                        {wp.abstract}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3 pt-6 border-t border-white/5">
                        {wp.keyMetrics.map(([metric, desc]) => (
                          <div key={metric} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                            <div className="text-sm font-bold text-emerald-400 font-mono">{metric}</div>
                            <div className="mt-1 text-[11px] text-cool/80 leading-normal">{desc}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 text-[11px] font-mono text-cool/60">
                        <strong className="text-cool/90">Target Audience:</strong> {wp.audience}
                      </div>
                    </div>

                    <div className="lg:w-60 flex-shrink-0 flex flex-col justify-center rounded-xl border border-white/10 bg-midnight/80 p-5 text-center">
                      <FileText size={32} className="mx-auto text-electric mb-2" />
                      <div className="text-xs font-mono text-white font-medium">{wp.format}</div>
                      <div className="text-[10px] text-cool mt-1">Direct PDF Access · Verified Research</div>
                      <button
                        onClick={() => handleDownload(wp.id)}
                        className="btn btn-primary mt-4 text-xs h-9 justify-center flex items-center gap-2"
                      >
                        {downloaded[wp.id] ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            <span>Access Granted</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} />
                            <span>Download Whitepaper</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Need a Custom Technology Feasibility Study?"
        text="Our enterprise architecture practice prepares tailored TCO evaluations and multi-tenant cloud roadmap designs for enterprise organizations."
        primary={["Request Architectural Assessment", "/contact-sales"]}
        secondary={["Explore Implementation Guides", "/resources/guides"]}
      />
    </>
  );
}
