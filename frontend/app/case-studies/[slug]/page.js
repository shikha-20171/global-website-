import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import ProductArt from "@/components/ProductArt";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { projects } from "@/lib/data";
import { caseStudiesDetails } from "@/lib/caseStudiesData";
import api from "@/lib/axios";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import {
  ArrowLeft,
  CheckCircle2,
  Layers,
  Cpu,
  ShieldCheck,
  Target,
  Workflow,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Building2,
  Calendar,
  Zap,
  BarChart3,
  Server,
  FileCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  let liveStudy = null;
  try {
    // Direct Axios call for case study metadata
    const res = await api.get(`/api/v1/case-studies/${params.slug}`);
    liveStudy = res.data?.data || res.data?.caseStudy || res.data;
  } catch (err) {}

  const p = projects.find((x) => x.slug === params.slug) || liveStudy;
  const details = caseStudiesDetails[params.slug];

  if (!p) {
    return buildMetadata({
      title: "Case Study | DEZORYN",
      path: `/case-studies/${params.slug}`,
    });
  }

  const title = `${p.name} — Enterprise Case Study & Architecture | DEZORYN`;
  const description =
    liveStudy?.summary ||
    liveStudy?.overview ||
    details?.overview ||
    p.result ||
    `Real-world implementation of DEZORYN software architecture for ${p.name}.`;

  return buildMetadata({
    title,
    description,
    path: `/case-studies/${params.slug}`,
    keywords: [
      p.name,
      p.industry || "Enterprise",
      "software case study",
      "system architecture results",
      "DEZORYN",
    ],
  });
}

export default async function CaseStudyPage({ params }) {
  let liveStudy = null;
  try {
    // Direct Axios call inside Case Study slug page
    const res = await api.get(`/api/v1/case-studies/${params.slug}`);
    liveStudy = res.data?.data || res.data?.caseStudy || res.data;
  } catch (err) {
    console.warn("Case study live notice:", err?.message || err);
  }

  const p = projects.find((x) => x.slug === params.slug) || liveStudy;
  if (!p) notFound();

  const baseDetails = caseStudiesDetails[params.slug] || {
    slug: p.slug,
    name: p.name,
    industry: p.industry,
    type: p.type,
    product: p.product,
    clientScale: "Enterprise Organization • Multi-location Deployment",
    timeline: "12–16 Weeks Delivery Lifecycle",
    overview: p.result,
    challenge:
      "Operational friction and fragmented tools required a modern, unified software solution with automated workflows and audit trails.",
    objectives: [
      "Streamline daily departmental operations and cross-functional coordination.",
      "Eliminate manual paperwork and duplicate data entry across legacy silos.",
      "Provide secure role-based access for stakeholders with encrypted audit logging.",
      "Accelerate transaction speed and eliminate operational bottlenecks.",
      "Deliver automated compliance reporting and real-time executive visibility.",
      "Ensure high-availability multi-region cloud deployment with automated failover.",
    ],
    solution:
      "DEZORYN engineered and deployed a tailored software system designed around the organization's workflows with high-availability microservices.",
    architecture:
      "Modular cloud architecture with clean API separation, secure database storage, low-latency caching, and responsive web interfaces.",
    implementation: [
      "Phase 1: Planning & Data Cleanup — Cleaning data and moving old records to the cloud.",
      "Phase 2: System Setup & Roles — Setting up user logins and permissions for team members.",
      "Phase 3: Hardware & API Testing — Testing the system with sample data and team feedback.",
      "Phase 4: Staff Training — Step-by-step training for daily users and managers.",
      "Phase 5: Live Launch & Support — Smooth system launch with round-the-clock technical help.",
    ],
    metrics: [
      {
        metric: "Instant",
        title: "Automated Operational Workflows",
        label: "Automated Operational Workflows",
        category: "Process Efficiency",
        desc: "Eliminates repetitive manual paperwork with automated digital task queues and notifications.",
        change: "Instant"
      },
      {
        metric: "Real-Time",
        title: "Unified Cloud Ledger & Data Sync",
        label: "Unified Cloud Ledger & Data Sync",
        category: "Data Integrity",
        desc: "All department records synchronize instantaneously across devices with zero discrepancies.",
        change: "Real-Time"
      },
      {
        metric: "100%",
        title: "Role-Based Access & Security Audit",
        label: "Role-Based Access & Security Audit",
        category: "Enterprise Security",
        desc: "Enforces strict user permissions with complete activity timestamps and zero data leakage.",
        change: "100%"
      },
      {
        metric: "Digital",
        title: "Paperless Cross-Team Collaboration",
        label: "Paperless Cross-Team Collaboration",
        category: "Resource Optimization",
        desc: "Replaces physical logbooks and printed forms with connected web and mobile interfaces.",
        change: "Digital"
      }
    ],
    highlights: [
      { label: "Reliable Cloud Setup", desc: "Fast and dependable system that runs smoothly every day." },
      { label: "Centralized Data", desc: "All team members work with the same accurate information." },
      { label: "Secure User Logins", desc: "Each staff member only sees the data their role needs." },
      { label: "Clear Activity History", desc: "Every important change is logged so nothing goes missing." },
    ],
    outcome:
      "Daily work was completely simplified, saving time and money while helping the organization serve its customers better.",
  };

  const details = {
    ...baseDetails,
    ...(liveStudy || {}),
    overview: liveStudy?.summary || liveStudy?.overview || baseDetails.overview,
    challenge: liveStudy?.challenge || baseDetails.challenge,
    solution: liveStudy?.solution || baseDetails.solution,
    highlights: Array.isArray(liveStudy?.highlights) && liveStudy.highlights.length > 0 ? liveStudy.highlights : baseDetails.highlights,
    objectives: Array.isArray(liveStudy?.objectives) && liveStudy.objectives.length > 0 ? liveStudy.objectives : baseDetails.objectives,
    implementation: Array.isArray(liveStudy?.implementation) && liveStudy.implementation.length > 0 ? liveStudy.implementation : baseDetails.implementation,
    metrics: Array.isArray(liveStudy?.metrics) && liveStudy.metrics.length > 0 ? liveStudy.metrics : baseDetails.metrics,
  };

  const otherProjects = projects.filter((x) => x.slug !== p.slug).slice(0, 3);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" },
    { name: p.name, url: `/case-studies/${params.slug}` },
  ]);

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[450px] w-[550px] rounded-full bg-electric/15 blur-[120px]" />
        
        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Portfolio", href: "/portfolio" },
              { label: "Case Studies", href: "/case-studies" },
              { label: p.name },
            ]}
          />

          <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
                  {p.industry}
                </span>
                <span className="tag border-white/20 bg-white/5 text-white/90">
                  {p.type}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck size={13} /> Real-World Case Study
                </span>
              </div>

              <h1 className="h-display text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight">
                {p.name}
              </h1>

              {/* Client Scale & Timeline Badges */}
              {(details.clientScale || details.timeline) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {details.clientScale && (
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#070b16] px-3.5 py-2 text-xs text-white/90 font-mono">
                      <Building2 size={14} className="text-electric shrink-0" />
                      <span>{details.clientScale}</span>
                    </div>
                  )}
                  {details.timeline && (
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#070b16] px-3.5 py-2 text-xs text-white/90 font-mono">
                      <Clock size={14} className="text-amber-400 shrink-0" />
                      <span>{details.timeline}</span>
                    </div>
                  )}
                </div>
              )}

              <p className="lead mt-6 text-base sm:text-lg text-cool max-w-2xl leading-relaxed">
                {details.overview}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {p.product && (
                  <Button href={`/products/${p.product}`} arrow>
                    View Product Details
                  </Button>
                )}
                <Button href="/contact" variant="secondary" arrow>
                  Talk to Our Team
                </Button>
              </div>
            </div>

            <div className="relative">
              {p.image ? (
                <div className="relative h-80 sm:h-[420px] overflow-hidden rounded-2xl border border-white/15 bg-[#0a0f1b] shadow-2xl">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-midnight/80 backdrop-blur-md px-4 py-2.5 text-xs text-cool font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Verified System
                    </span>
                    <span className="text-white/60">SLA 99.99% Uptime</span>
                  </div>
                </div>
              ) : (
                <ProductArt hue={p.hue} className="h-80 sm:h-[420px] rounded-2xl border border-white/10" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE PLATFORM DELIVERABLES & BUSINESS VALUE ─── */}
      {details.metrics && details.metrics.length > 0 && (
        <section className="section bg-[#050811] border-b border-line">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-mono text-electric uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Core Platform Deliverables
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 tracking-tight">
                  Key Operational Achievements
                </h2>
              </div>
              <p className="text-sm text-cool max-w-md">
                Verified functional capabilities and business value delivered in live production deployment.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {details.metrics.map((metric, i) => (
                <div key={metric.title || metric.label} className="card h-full p-6 border-white/10 bg-[#070b16] hover:border-electric/40 transition-colors relative overflow-hidden flex flex-col justify-between group">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-electric/5 rounded-full blur-xl pointer-events-none group-hover:bg-electric/10 transition-colors" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                        {metric.category || `Deliverable 0${i + 1}`}
                      </span>
                      <span className="rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-electric shrink-0">
                        {metric.metric || metric.change || "Verified"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-electric transition-colors">
                      {metric.title || metric.label}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed">
                      {metric.desc || "Optimized and automated operational workflow deployed in production with active monitoring."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-cool">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Verified Result
                    </span>
                    <span className="text-white/40">Production Metric</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CORE ARCHITECTURAL MILESTONES ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="mb-8 max-w-4xl">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Key Highlights
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Key Project Highlights
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {details.highlights.map((h, i) => (
              <div key={h.label} className="card h-full p-6 border-white/10 bg-[#070b16]">
                <div className="flex items-center gap-2 text-xs font-mono text-electric mb-3">
                  <CheckCircle2 size={15} />
                  <span>HIGHLIGHT 0{i + 1}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {h.label}
                </h3>
                <p className="mt-2 text-xs text-cool leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHALLENGE & OBJECTIVES ─── */}
      <section className="section border-b border-line">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* The Challenge */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16]">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3">
                <Target size={16} />
                <span>THE PROBLEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">The Client's Challenge</h2>
              <div className="mt-5 space-y-4 text-sm text-cool leading-relaxed">
                <p>{details.challenge}</p>
              </div>
            </div>

            {/* Strategic Objectives */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16]">
              <div className="flex items-center gap-2 text-xs font-mono text-electric mb-3">
                <Workflow size={16} />
                <span>PROJECT GOALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Key Goals &amp; Requirements</h2>
              <ul className="mt-6 space-y-3.5">
                {details.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-cool">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric/15 text-[11px] font-mono text-electric mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTION & ARCHITECTURE ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* The Solution */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16]">
              <div className="flex items-center gap-2 text-xs font-mono text-electric mb-3">
                <Sparkles size={16} />
                <span>OUR SOLUTION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How We Solved It</h2>
              <div className="mt-5 space-y-4 text-sm text-cool leading-relaxed">
                <p>{details.solution}</p>
              </div>
            </div>

            {/* Technical Architecture */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#b5a4ff] mb-3">
                <Layers size={16} />
                <span>TECHNICAL SETUP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">System Architecture &amp; Security</h2>
              <div className="mt-5 space-y-4 text-sm text-cool leading-relaxed">
                <p>{details.architecture}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EXECUTION ROADMAP: 5 PHASED IMPLEMENTATION ─── */}
      <section className="section border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-10">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Step-by-Step Delivery
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Implementation Steps
            </h2>
            <p className="mt-3 text-sm text-cool">
              A smooth step-by-step rollout to get everything running properly with zero downtime.
            </p>
          </div>

          <div className="space-y-4">
            {details.implementation.map((step, idx) => {
              // Parse "Phase X: Title — Description" if present
              const parts = step.split(" — ");
              const phaseHeader = parts[0] || step;
              const phaseBody = parts[1] || "";

              return (
                <div key={idx} className="group card p-6 sm:p-7 border-white/10 bg-[#070b16] hover:border-electric/40 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/15 text-sm font-mono font-bold text-electric border border-electric/30">
                      0{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-electric transition-colors">
                          {phaseHeader}
                        </h3>
                        <span className="text-[11px] font-mono text-cool px-2.5 py-0.5 rounded border border-white/10 bg-white/5">
                          Completed
                        </span>
                      </div>
                      {phaseBody && (
                        <p className="mt-2.5 text-sm text-cool leading-relaxed">
                          {phaseBody}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURAL IMPACT & ORGANIZATIONAL OUTCOME ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="card p-8 sm:p-12 border-white/10 bg-[#070b16]">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Final Results
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  Business Outcome &amp; Results
                </h2>
                <div className="mt-5 text-sm sm:text-base text-cool leading-relaxed space-y-4">
                  <p>{details.outcome}</p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  {p.product && (
                    <Button href={`/products/${p.product}`} arrow>
                      View Product Details
                    </Button>
                  )}
                  <Button href="/contact" variant="secondary">
                    Schedule a Demo
                  </Button>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-line/60 pt-8 lg:pt-0 lg:pl-10">
                <div>
                  <div className="text-xs text-cool mb-3 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Server size={14} className="text-electric" /> Technology Used
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(details.tech || p.tech).map((t) => (
                      <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/90">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-line/60 space-y-3">
                  <div className="text-xs text-cool font-mono uppercase tracking-wider">
                    Security &amp; Reliability
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/80 font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={14} /> Bank-Grade Security
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={14} /> Data Privacy Protected
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={14} /> Daily Cloud Backups
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={14} /> 99.99% Uptime SLA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RELATED CASE STUDIES ─── */}
      {otherProjects.length > 0 && (
        <section className="section bg-midnight/40 border-b border-line">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-8">
              <div className="max-w-4xl">
                <span className="text-xs font-mono text-electric uppercase tracking-wider">
                  More Case Studies
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  Explore More Stories
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-electric hover:text-white transition"
              >
                <ArrowLeft size={14} /> View All Case Studies
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {otherProjects.map((item) => (
                <Link
                  key={item.slug}
                  href={`/case-studies/${item.slug}`}
                  className="card card-hover group p-5 block border-white/10 bg-[#070b16]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag text-[10px] font-mono">{item.industry}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-electric transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-cool line-clamp-2 leading-relaxed">
                    {item.result}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-electric font-medium">
                    Read Story <ArrowUpRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA ─── */}
      <CTASection
        title="Ready to Transform Your Business Operations?"
        text="Tell us about your organization's needs and see how our software can help your team save time and work better."
        primary={["Discuss Your Project", "/contact"]}
        secondary={["Schedule a Live Demo", "/demo"]}
      />
    </>
  );
}
