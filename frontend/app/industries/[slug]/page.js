import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { getIndustry, getProduct, products, projects, industries } from "@/lib/data";
import { getLiveIndustryBySlug } from "@/lib/api";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import {
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Layers,
  HelpCircle,
  ShieldCheck,
  Activity,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }) {
  let ind = null;
  try {
    // Fetch industry by slug
    const liveInd = await getLiveIndustryBySlug(params.slug);
    if (liveInd) {
      ind = { ...getIndustry(params.slug), ...liveInd };
    }
  } catch (e) {}
  if (!ind) ind = getIndustry(params.slug);
  if (!ind) {
    return buildMetadata({
      title: "Industry Solution | DEZORYN",
      path: `/industries/${params.slug}`,
    });
  }

  const title = ind.seoTitle || `${ind.name} Enterprise Technology & SaaS Solutions | DEZORYN`;
  const description =
    ind.seoDescription ||
    `${ind.solution || ind.description} Explore specialized software platforms engineered for ${ind.name}.`;

  return buildMetadata({
    title,
    description,
    path: `/industries/${params.slug}`,
    keywords: [
      `${ind.name} software`,
      `${ind.name} SaaS platform`,
      "vertical enterprise software",
      "industry automation",
      "DEZORYN",
    ],
  });
}

// Domain-specific regulatory and architectural benchmarks
const industryBenchmarks = {
  education: {
    standards: ["FERPA & COPPA Aligned", "Multi-Campus Schema Isolation", "99.99% Examination Peak Uptime"],
    impactMetrics: [
      { value: "65%", label: "Reduction in Administrative Hours" },
      { value: "100%", label: "Parent Fee Collection Visibility" },
      { value: "< 2 min", label: "Automated Report Card Generation" },
    ],
  },
  healthcare: {
    standards: ["HL7 / FHIR Data Ready", "AES-256 Medical Records Vault", "Physician vs Nursing RBAC"],
    impactMetrics: [
      { value: "40%", label: "Shorter Outpatient Wait Times" },
      { value: "Zero", label: "Prescription Handwriting Errors" },
      { value: "100%", label: "HIPAA-Aligned Audit Logging" },
    ],
  },
  "real-estate": {
    standards: ["Transactional Unit-Hold Locking", "RERA Milestone Demand Notes", "Broker Channel Attribution"],
    impactMetrics: [
      { value: "Zero", label: "Double-Booking Conflicts" },
      { value: "3x", label: "Faster Broker Commission Cycles" },
      { value: "+32%", label: "Collection Speed on Demand Letters" },
    ],
  },
  "residential-communities": {
    standards: ["OTP Gatekeeper Visitor Clearance", "Automated Utility Meter Billing", "Committee Financial Auditing"],
    impactMetrics: [
      { value: "98%", label: "On-Time Dues Collection Rate" },
      { value: "100%", label: "Verified Perimeter Visitor Logs" },
      { value: "< 4 hrs", label: "Average Ticket Resolution Time" },
    ],
  },
  manufacturing: {
    standards: ["Multi-Level BOM Material Tracking", "ISO 9001 Stage-Gate Quality Checks", "Preventive Machine Telemetry"],
    impactMetrics: [
      { value: "-45%", label: "Unplanned Machinery Downtime" },
      { value: "100%", label: "Batch & Serial Traceability" },
      { value: "+28%", label: "Assembly Shift Utilization" },
    ],
  },
  retail: {
    standards: ["Offline-Resilient POS Cache Engine", "PCI-DSS Payment Gateways", "Sub-10ms Barcode Stock Synchronization"],
    impactMetrics: [
      { value: "< 5 sec", label: "Average Checkout Scan Time" },
      { value: "Zero", label: "Out-of-Stock Discrepancies" },
      { value: "+22%", label: "Customer Repeat Loyalty Purchases" },
    ],
  },
  finance: {
    standards: ["GAAP & IFRS Compliant Ledgers", "Automated Bank Reconciliations", "Granular Maker-Checker Approval Gates"],
    impactMetrics: [
      { value: "80%", label: "Faster Month-End Book Closing" },
      { value: "100%", label: "Audit-Ready Historical Trail" },
      { value: "Zero", label: "Unreconciled Bank Discrepancies" },
    ],
  },
  hospitality: {
    standards: ["Mobile Real-Time Room Turnover", "Consolidated Room Folio Charging", "24/7 Front-Desk Redundancy"],
    impactMetrics: [
      { value: "-50%", label: "Guest Check-in Queue Time" },
      { value: "15 min", label: "Turnover Between Departing & Arriving" },
      { value: "100%", label: "Capture of Dining & Spa Folio Charges" },
    ],
  },
  logistics: {
    standards: ["Offline Electronic Proof of Delivery (e-POD)", "Sub-10ms Consignment Tracking", "Dynamic Freight Rate Engines"],
    impactMetrics: [
      { value: "Zero", label: "Proof-of-Delivery Disputes" },
      { value: "+30%", label: "Fleet Routing Efficiency" },
      { value: "Same-Day", label: "Freight Invoicing upon Delivery" },
    ],
  },
  "professional-services": {
    standards: ["Real-time Budget Burn Tracking", "Granular Client NDA Storage", "Timesheet Sign-Off Approvals"],
    impactMetrics: [
      { value: "+18%", label: "Project Profitability Margin" },
      { value: "100%", label: "Billable Hour Capture Accuracy" },
      { value: "Instant", label: "Invoice Generation from Milestones" },
    ],
  },
};

export default async function IndustryDetailPage({ params }) {
  let ind = null;
  try {
    // Fetch industry by slug
    const liveInd = await getLiveIndustryBySlug(params.slug);
    if (liveInd) {
      ind = {
        ...getIndustry(params.slug),
        ...liveInd,
        name: liveInd.name || getIndustry(params.slug)?.name,
        solution: liveInd.description || liveInd.solution || getIndustry(params.slug)?.solution,
      };
    }
  } catch (e) {
  }
  if (!ind) ind = getIndustry(params.slug);
  if (!ind) notFound();

  const directProds = (ind.products || []).map(getProduct).filter(Boolean);
  const matchedProds = (products || []).filter(
    (p) =>
      Array.isArray(p.industries) &&
      p.industries.includes(ind.slug) &&
      !directProds.some((dp) => dp.slug === p.slug)
  );
  const prods = [...directProds, ...matchedProds];
  const cases = projects.filter((p) => p.industry.toLowerCase() === ind.name.toLowerCase()).slice(0, 2);
  const benchmark = industryBenchmarks[ind.slug] || {
    standards: ["Multi-Tenant Cloud Isolation", "RESTful v1 JSON Endpoints", "99.9% Uptime Commitment"],
    impactMetrics: [
      { value: "-50%", label: "Operational Overhead" },
      { value: "100%", label: "Compliance & Audit Readiness" },
      { value: "Days", label: "Deployment vs Months" },
    ],
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Industries", url: "/industries" },
    { name: ind.name, url: `/industries/${params.slug}` },
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
      <section className="relative overflow-hidden pb-20 pt-28 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />
        
        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Industries", href: "/industries" },
              { label: ind.name },
            ]}
          />

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/40 bg-electric/15 text-electric shadow-[0_0_20px_rgba(47,107,255,0.25)]">
                  <Icon name={ind.icon} size={24} />
                </span>
                <span className="text-xs font-mono text-electric uppercase tracking-wider rounded-full border border-electric/30 bg-electric/10 px-3 py-1">
                  {ind.name} Domain Architecture
                </span>
              </div>

              <h1 className="h-display text-4xl sm:text-6xl text-white">
                Software for {ind.name}.
              </h1>

              <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
                {ind.solution}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {prods.length > 0 ? (
                  <Button href="#software-platforms" arrow>
                    Explore {prods.length} Software {prods.length === 1 ? "Platform" : "Platforms"}
                  </Button>
                ) : (
                  <Button href="/demo" arrow>
                    Book an Industry Demo
                  </Button>
                )}
                <Button href="/demo" variant="secondary">
                  Schedule Solutions Briefing
                </Button>
                <Button href="/contact-sales" variant="ghost" arrow>
                  Talk to a Solutions Architect
                </Button>
              </div>

              {prods.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs font-mono text-cool/80 mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-electric" />
                    <span>Specialized {ind.name} Software ({prods.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prods.map((p) => (
                      <a
                        key={p.slug}
                        href={`#platform-${p.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#0b1120] hover:bg-electric/20 border border-white/10 hover:border-electric/40 text-cool hover:text-white transition-all shadow-sm"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                        <span>{p.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Benchmark Standards Badge Strip */}
            <div className="rounded-xl border border-white/10 bg-[#070b16] p-5 max-w-sm w-full space-y-3 shadow-xl">
              <span className="text-xs font-mono text-electric uppercase tracking-wider block border-b border-white/5 pb-2">
                Domain Architectural Standards
              </span>
              {benchmark.standards.map((std, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-white">
                  <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>{std}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-cool">
                <span>Tenant Isolation: Enforced</span>
                <span className="text-emerald-400">99.9% SLA</span>
              </div>
            </div>
          </div>

          {/* Quantitative Impact Metrics Ticker */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {benchmark.impactMetrics.map((met, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {met.value}
                </div>
                <div className="text-xs text-cool leading-tight">
                  {met.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM VS SOLUTION ─── */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card h-full p-8 border-white/10 bg-[#070b16] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>INDUSTRY OPERATIONAL CHALLENGE</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">The Core Bottleneck</h2>
                  <p className="mt-4 text-sm sm:text-base text-cool leading-relaxed font-normal">
                    {ind.problem}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-cool/60">
                  Impact: Fragmented data, human transcription mistakes &amp; audit vulnerabilities.
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="card h-full border-electric/40 bg-[#070e24] p-8 shadow-[0_0_30px_rgba(47,107,255,0.15)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-electric mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                    <span>THE DEZORYN PURPOSE-BUILT SOLUTION</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Unified Domain Ecosystem</h2>
                  <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                    {ind.solution}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-emerald-400">
                  Result: Single source of truth, automated reconciliations &amp; sub-50ms query times.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── READY-TO-DEPLOY PRODUCTS FOR THIS INDUSTRY ─── */}
      {prods.length > 0 && (
        <section id="software-platforms" className="section border-b border-line scroll-mt-20">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-electric mb-2">
                  <Sparkles size={14} />
                  <span>AVAILABLE SOFTWARE ECOSYSTEM</span>
                </div>
                <h2 className="h-section mt-1">
                  Software Built for {ind.name}
                </h2>
                <p className="lead mt-3 text-cool max-w-2xl">
                  Explore {prods.length} specialized, production-ready platforms engineered for {ind.name} operations, governance, and institutional scale.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cool/60 hidden sm:inline">
                  {prods.length} Active {prods.length === 1 ? "Platform" : "Platforms"}
                </span>
                <Button href="/marketplace" variant="secondary" arrow>
                  View Full Marketplace
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prods.map((p, i) => (
                <div key={p.slug} id={`platform-${p.slug}`} className="scroll-mt-28">
                  <ProductCard product={p} compare={false} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 5-STEP OPERATIONAL LIFECYCLE (INTERACTIVE ANIMATED PIPELINE) ─── */}
      <section className="section border-b border-line">
        <div className="container-x">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-electric mb-2">
              <Activity size={14} />
              <span>END-TO-END OPERATIONAL LIFECYCLE</span>
            </div>
            <h2 className="h-section max-w-xl">Coordinated Operational Flow</h2>
            <p className="lead mt-3 text-cool max-w-xl">
              How DEZORYN software orchestrates departmental handovers from initial intake to final audited reporting.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            {ind.workflow.map((w, i) => {
              const name = typeof w === "object" ? w.name : w;
              const action = typeof w === "object" ? w.action : "Automated milestone trigger and role-based data verification.";
              const outcome = typeof w === "object" ? w.outcome : "State: Verified";
              return (
                <Reveal key={name} delay={i * 0.08}>
                  <div className="card card-hover group relative flex h-full flex-col justify-between p-5 border-white/10 bg-[#070b16] transition-all hover:border-electric/50 hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/15 text-xs font-mono text-electric font-bold border border-electric/30">
                          0{i + 1}
                        </span>
                        {i < ind.workflow.length - 1 && (
                          <span className="hidden sm:block text-xs font-mono text-cool/40 group-hover:text-electric transition-colors">
                            →
                          </span>
                        )}
                      </div>
                      <span className="text-base font-bold text-white tracking-tight group-hover:text-electric transition-colors block leading-snug">
                        {name}
                      </span>
                      <p className="mt-2.5 text-xs text-cool/90 leading-relaxed">
                        {action}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                      <span className="line-clamp-1">{outcome}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CORE SOFTWARE MODULES (NEW DEDICATED SECTION) ─── */}
      {ind.coreModules && ind.coreModules.length > 0 && (
        <section className="section bg-midnight/50 border-b border-line">
          <div className="container-x">
            <div className="mb-10">
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Software Architecture
              </span>
              <h2 className="h-section max-w-xl mt-1">
                Core Software Modules for {ind.name}
              </h2>
              <p className="lead mt-3 text-cool max-w-xl">
                Pre-engineered functional modules that eliminate manual spreadsheets and legacy software silos.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ind.coreModules.map((mod, idx) => (
                <Reveal key={mod.title} delay={idx * 0.05}>
                  <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16] transition-all hover:border-electric/40 hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric text-xs font-mono font-bold">
                          M{idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {mod.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-cool leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-electric">
                      <span>Module Status</span>
                      <span className="text-emerald-400">Active &amp; Supported</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURES SECTION ─── */}
      {ind.features && ind.features.length > 0 && (
        <section className="section bg-midnight/30 border-b border-line">
          <div className="container-x">
            <div className="mb-10">
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Domain Capabilities
              </span>
              <h2 className="h-section max-w-4xl mt-1">
                Specialized Administrative Capabilities
              </h2>
              <p className="lead mt-3 text-cool max-w-2xl">
                Deep functional features configured around the compliance and daily realities of your sector.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ind.features.map(([title, desc], idx) => (
                <Reveal key={title} delay={idx * 0.05}>
                  <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16] transition-all hover:border-electric/40 hover:-translate-y-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric mb-4">
                      <Zap size={18} />
                    </span>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                    <p className="mt-2 text-xs text-cool leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── MEASURABLE BENEFITS ─── */}
      {ind.benefits && ind.benefits.length > 0 && (
        <section className="section bg-midnight/30 border-b border-line">
          <div className="container-x">
            <div className="mb-10">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Measurable Impact
              </span>
              <h2 className="h-section max-w-4xl mt-1">
                Business &amp; Operational Benefits
              </h2>
              <p className="lead mt-3 text-cool max-w-2xl">
                Reliable operational outcomes delivered through automation, centralized data, and role-based accountability.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ind.benefits.map(([title, desc], idx) => (
                <Reveal key={title} delay={idx * 0.05}>
                  <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16] transition-all hover:border-emerald-500/40 hover:-translate-y-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
                      <CheckCircle2 size={18} />
                    </span>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                    <p className="mt-2 text-xs text-cool leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CASE STUDIES FOR THIS INDUSTRY ─── */}
      {cases.length > 0 && (
        <section className="section bg-midnight/40 border-b border-line">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-8">
              <div>
                <span className="text-xs font-mono text-electric uppercase tracking-wider">
                  Real Implementations
                </span>
                <h2 className="h-section mt-1">Verified Case Studies</h2>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-electric hover:text-white transition"
              >
                All Case Studies →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="card card-hover group overflow-hidden block border-white/10 bg-[#070b16] transition-all hover:border-electric/50"
                >
                  {c.image && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-cool mb-2 font-mono">
                      <span className="tag text-[10px]">{c.type} Architecture</span>
                      <span className="inline-flex items-center gap-1 text-electric group-hover:text-white">
                        Read Case Study <ArrowUpRight size={13} />
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-electric transition-colors">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-xs text-cool leading-relaxed">{c.result}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── DOMAIN-SPECIFIC FAQ ─── */}
      <section className="section border-b border-line">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {ind.name} Solutions FAQ
            </h2>
          </div>
          <FAQ items={ind.faq || []} />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <CTASection
        title={`Ready to Modernize Your ${ind.name} Operations?`}
        text={`Discuss your workflows with our solutions architects or schedule an interactive walkthrough tailored to ${ind.name.toLowerCase()} organizations.`}
        primary={["Book a Demo", "/demo"]}
        secondary={["Talk to an Expert", "/contact-sales"]}
      />
    </>
  );
}
