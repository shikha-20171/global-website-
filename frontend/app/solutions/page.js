import Link from "next/link";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ProductArt from "@/components/ProductArt";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { enterpriseSections, aiCapabilities, whatWeBuild } from "@/lib/data";
import {
  Layers,
  Cpu,
  Workflow,
  Code2,
  Cloud,
  Smartphone,
  Globe2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
  Zap,
} from "lucide-react";

import { buildMetadata, generateBreadcrumbSchema, generateItemListSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Enterprise Solutions — AI Automation, Cloud & Custom Software | DEZORYN",
  description:
    "Explore DEZORYN's enterprise solutions: AI workflow automation, resilient cloud infrastructure, custom ERP systems, and modern digital transformation platforms.",
  path: "/solutions",
  keywords: [
    "enterprise software solutions",
    "AI automation solutions",
    "cloud infrastructure engineering",
    "custom ERP development",
    "workflow automation",
    "enterprise digital transformation",
  ],
});

const automationFeatures = [
  {
    title: "Event-Driven Triggers",
    desc: "Automate cross-departmental operations based on status changes, payment completions, or document uploads.",
  },
  {
    title: "Document & Invoice Processing",
    desc: "Intelligent OCR and structured data extraction to process POs, receipts, and identity documents without manual data entry.",
  },
  {
    title: "Approval Hierarchies",
    desc: "Configurable multi-level approval matrices for expense authorizations, leave approvals, and purchase orders.",
  },
  {
    title: "Third-Party Sync & Webhooks",
    desc: "Bi-directional real-time data sync with ERPs, CRMs, communication channels (Slack, WhatsApp), and payment gateways.",
  },
];

const customSoftwareFeatures = [
  {
    title: "Bespoke ERP & Operations Suites",
    desc: "Tailored business logic mapped precisely to your organizational chart, billing formulas, and departmental protocols.",
  },
  {
    title: "Granular Role-Based Access (RBAC)",
    desc: "Zero-trust permission hierarchies ensuring employees, managers, and auditors only access authorized data slices.",
  },
  {
    title: "API-First Architecture",
    desc: "Clean, documented RESTful and GraphQL endpoints engineered for future system integrations and third-party interoperability.",
  },
  {
    title: "Enterprise Audit Trails",
    desc: "Immutable logs tracking all data creation, modification, and export events for institutional regulatory compliance.",
  },
];

const cloudFeatures = [
  {
    title: "Multi-Tenant Cloud Isolation",
    desc: "Logical or physical tenant separation with dedicated database schemas, connection pooling, and tenant encryption keys.",
  },
  {
    title: "High Availability & Failover",
    desc: "Multi-availability zone replication with automated health checks, geo-routing, and 99.99% uptime SLA engineering.",
  },
  {
    title: "Automated Backup & Disaster Recovery",
    desc: "Point-in-time recovery, automated daily database snapshots, and rapid replication protocols to safeguard enterprise data.",
  },
  {
    title: "Performance Monitoring & Telemetry",
    desc: "Continuous distributed tracing, latency profiling, and edge telemetry to maintain sub-100ms response benchmarks.",
  },
];

const mobileFeatures = [
  {
    title: "Cross-Platform & Native Apps",
    desc: "Fluid iOS and Android applications built with React Native and native modules for maximum frame rates and low battery draw.",
  },
  {
    title: "Offline-First Sync Engine",
    desc: "Local encrypted caching with automatic conflict resolution when field agents reconnect to cellular or Wi-Fi networks.",
  },
  {
    title: "Push Notifications & Alerts",
    desc: "Instant transactional alerts, shift updates, and verification codes integrated with APNs and Firebase Cloud Messaging.",
  },
  {
    title: "Biometric & Secure Authentication",
    desc: "FaceID, fingerprint recognition, and secure enclave token storage for enterprise-grade mobile security.",
  },
];

import { getLiveSolutions } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SolutionsPage() {
  let liveSolutions = [];
  try {
    // Fetch solutions
    const res = await getLiveSolutions();
    if (Array.isArray(res) && res.length > 0) {
      liveSolutions = res;
    }
  } catch (err) {
    console.warn("Solutions live fetch notice:", err.message);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Solutions", url: "/solutions" },
  ]);

  const solutionsListSchema = generateItemListSchema(
    "DEZORYN Enterprise Solutions",
    enterpriseSections.map((s) => ({
      name: s.title,
      url: `/solutions/${s.slug}`,
    })),
    "/solutions"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsListSchema) }}
      />
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[100px]" />
        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Solutions" }]} />
          <div className="max-w-5xl mt-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-[#9db8ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>CAPABILITIES &amp; ENGINEERING</span>
            </div>
            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Solutions Engineered for <span className="text-gradient-blue">Complexity &amp; Scale.</span>
            </h1>
            <p className="lead mt-5 max-w-3xl">
              From multi-tenant SaaS products to bespoke enterprise software, AI workflows, and resilient cloud architectures — we engineer technology that powers modern organizations.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                ["Enterprise Software", "#enterprise"],
                ["AI Solutions", "#ai"],
                ["Automation", "#automation"],
                ["Custom Software", "#custom"],
                ["Cloud Infrastructure", "#cloud"],
                ["Mobile Applications", "#mobile"],
                ["Web Platforms", "#web"],
                ["Digital Transformation", "#transformation"],
              ].map(([t, h]) => (
                <a
                  key={t}
                  href={h}
                  className="tag h-8 px-3 text-xs transition hover:border-electric/60 hover:text-white hover:bg-electric/10"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE ENTERPRISE ARCHITECTURE BLUEPRINTS DIRECTORY ─── */}
      {liveSolutions.length > 0 && (
        <section className="section bg-midnight/40 border-b border-line">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-10">
              <div>
                <span className="text-xs font-mono text-electric uppercase tracking-wider">
                  Verified Architecture Blueprints
                </span>
                <h2 className="h-section mt-1">
                  Active Enterprise Solution Specifications ({liveSolutions.length})
                </h2>
              </div>
              <Button href="/contact-sales" variant="secondary" arrow>
                Consult Solutions Architect
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {liveSolutions.map((sol, idx) => (
                <Reveal key={sol.slug} delay={idx * 0.05}>
                  <Link
                    href={`/solutions/${sol.slug}`}
                    className="card card-hover group flex flex-col justify-between p-6 border-white/10 bg-[#070b16] transition-all hover:border-electric/50 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric">
                          <Layers size={20} />
                        </span>
                        <span className="tag text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                          Active Blueprint
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-electric transition-colors">
                        {sol.name}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-cool/70">{sol.tagline}</p>
                      <p className="mt-3 text-xs text-cool leading-relaxed line-clamp-3">
                        {sol.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-electric">
                      <span>Explore Specification</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 1. ENTERPRISE SOFTWARE (#enterprise) ─── */}
      <section id="enterprise" className="section scroll-mt-20 bg-midnight/60">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
                <Layers size={14} />
                <span>ENTERPRISE ARCHITECTURE</span>
              </div>
              <Reveal>
                <h2 className="h-section max-w-4xl">
                  Built for Complexity. Designed for Scale.
                </h2>
              </Reveal>
              <p className="lead mt-3 max-w-xl">
                Modular, auditable, and resilient systems engineered around your exact organizational hierarchies and security benchmarks.
              </p>
            </div>
            <Button href="/contact?solution=Enterprise Software" arrow>
              Build With DEZORYN
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enterpriseSections.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) * 0.05}>
                <div className="card card-hover group relative h-full p-6 border-white/10 bg-[#070b16]/95 hover:border-sky-400/50 hover:shadow-[0_20px_45px_rgba(56,189,248,0.2)] transition-all duration-300 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_#38bdf8]" />
                  <h3 className="font-semibold text-white text-base group-hover:text-sky-300 transition-colors">{t}</h3>
                  <p className="mt-2 text-sm text-cool leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. AI SOLUTIONS (#ai) ─── */}
      <section id="ai" className="section scroll-mt-20 border-t border-line">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-[#b5a4ff]">
              <Cpu size={14} className="text-sky-400 animate-pulse" />
              <span>INTELLIGENT SYSTEMS &amp; NEURAL AGENTS</span>
            </div>
            <Reveal>
              <h2 className="h-section">
                Intelligence Built Into Your Business.
              </h2>
            </Reveal>
            <p className="lead mt-4">
              Embed domain-specific AI models, predictive algorithms, and automated assistants directly into your operational software to accelerate decision-making.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {aiCapabilities.map(([t, d]) => (
                <div key={t} className="card card-hover group relative p-5 border-white/10 bg-[#070b16]/95 hover:border-sky-400/50 hover:shadow-[0_15px_35px_rgba(56,189,248,0.2)] transition-all duration-300 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500 via-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon name="Sparkles" size={16} className="text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="mt-3 text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">{t}</div>
                  <p className="mt-1 text-xs text-cool leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button href="/contact?solution=AI" arrow>
                Discuss AI Integration
              </Button>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute -inset-6 rounded-3xl bg-violet/10 blur-3xl" />
              <ProductArt
                hue={262}
                variant={2}
                image="/resources/agentic-ai.jpg"
                title="AI Machine Learning Intelligence Console"
                className="relative h-80 sm:h-[28rem] rounded-2xl shadow-2xl shadow-sky-500/20 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Cyber Radar Scanline on AI Visual */}
              <div className="pointer-events-none absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-cyber-scan" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 3. AUTOMATION (#automation) ─── */}
      <section id="automation" className="section scroll-mt-20 bg-midnight/60 border-t border-line">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-sky-400">
                <Workflow size={14} className="animate-spin-slow" />
                <span>WORKFLOW AUTOMATION PIPELINES</span>
              </div>
              <h2 className="h-section max-w-2xl">
                Automate Repetitive Operational Friction.
              </h2>
              <p className="lead mt-3 max-w-xl">
                Replace brittle manual spreadsheets and repetitive tasks with event-driven automation pipelines that connect your teams, customers, and data.
              </p>
            </div>
            <Button href="/contact?solution=Automation" variant="secondary" arrow>
              Explore Automation
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {automationFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card card-hover group relative h-full p-6 border-white/10 bg-[#070b16]/95 hover:border-sky-400/50 hover:shadow-[0_20px_45px_rgba(56,189,248,0.2)] transition-all duration-300 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_#38bdf8]" />
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-400 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
                    <Zap size={18} />
                  </span>
                  <h3 className="font-semibold text-white text-base group-hover:text-sky-300 transition-colors">{f.title}</h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. CUSTOM SOFTWARE DEVELOPMENT (#custom) ─── */}
      <section id="custom" className="section scroll-mt-20 border-t border-line">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
                <Code2 size={14} />
                <span>BESPOKE ENGINEERING</span>
              </div>
              <h2 className="h-section max-w-2xl">
                Custom Software Built Around Your Workflow.
              </h2>
              <p className="lead mt-3 max-w-xl">
                When off-the-shelf software falls short, we engineer custom business management platforms tailored to your administrative rules, reporting structures, and specialized requirements.
              </p>
            </div>
            <Button href="/contact?solution=Custom Software" arrow>
              Start Custom Project
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {customSoftwareFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric mb-4">
                    <CheckCircle2 size={18} />
                  </span>
                  <h3 className="font-semibold text-white text-base">{f.title}</h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. CLOUD INFRASTRUCTURE & SYSTEMS (#cloud) ─── */}
      <section id="cloud" className="section scroll-mt-20 bg-midnight/60 border-t border-line">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
                <Cloud size={14} />
                <span>CLOUD INFRASTRUCTURE</span>
              </div>
              <h2 className="h-section max-w-2xl">
                Multi-Tenant Architecture Engineered for High Availability.
              </h2>
              <p className="lead mt-3 max-w-xl">
                Scalable cloud deployments designed for low latency, isolated data partitioning, automated backups, and 99.99% operational continuity worldwide.
              </p>
            </div>
            <Button href="/contact?solution=Cloud" variant="secondary" arrow>
              Consult Cloud Architects
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cloudFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric mb-4">
                    <Database size={18} />
                  </span>
                  <h3 className="font-semibold text-white text-base">{f.title}</h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. MOBILE APPLICATIONS (#mobile) ─── */}
      <section id="mobile" className="section scroll-mt-20 border-t border-line">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
                <Smartphone size={14} />
                <span>MOBILE APPLICATIONS</span>
              </div>
              <h2 className="h-section max-w-2xl">
                Native-Feeling iOS &amp; Android Apps.
              </h2>
              <p className="lead mt-3 max-w-xl">
                Extend your core software platform to mobile devices with responsive user interfaces, real-time push notifications, offline syncing, and biometric authentication.
              </p>
            </div>
            <Button href="/contact?solution=Mobile App" arrow>
              Build Mobile App
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mobileFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card card-hover h-full p-6 border-white/10 bg-[#070b16]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric mb-4">
                    <Smartphone size={18} />
                  </span>
                  <h3 className="font-semibold text-white text-base">{f.title}</h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. WEB PLATFORMS (#web) & 8. DIGITAL TRANSFORMATION (#transformation) ─── */}
      <section id="web" className="section scroll-mt-20 bg-midnight/60 border-t border-line">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Web Platforms */}
          <div className="card p-8 border-white/10 bg-[#070b16]">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
              <Globe2 size={14} />
              <span>WEB PLATFORMS &amp; PORTALS</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">
              High-Performance Web Platforms
            </h3>
            <p className="text-sm text-cool mt-3 leading-relaxed">
              Fast, accessible, and SEO-optimized digital platforms, enterprise portals, and client-facing interfaces engineered with modern Next.js and React architectures.
            </p>
            <ul className="mt-6 space-y-2 text-xs text-cool">
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-electric shrink-0" />
                <span>Zero Cumulative Layout Shift (CLS) and sub-second First Contentful Paint.</span>
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-electric shrink-0" />
                <span>Full WCAG 2.1 AA keyboard and screen reader accessibility compliance.</span>
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-electric shrink-0" />
                <span>Dynamic server-side rendering with edge caching for global performance.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/contact?solution=Web Platforms" variant="secondary" arrow>
                Discuss Web Platform
              </Button>
            </div>
          </div>

          {/* Digital Transformation */}
          <div id="transformation" className="card scroll-mt-20 p-8 border-white/10 bg-[#070b16]">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-[#b5a4ff]">
              <RefreshCw size={14} />
              <span>DIGITAL TRANSFORMATION</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">
              Modernize Legacy Systems Safely
            </h3>
            <p className="text-sm text-cool mt-3 leading-relaxed">
              Comprehensive strategy, phased database migration, and rollout plans to transition fragmented legacy desktop tools and paper processes to scalable cloud software without operational downtime.
            </p>
            <ul className="mt-6 space-y-2 text-xs text-cool">
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-[#b5a4ff] shrink-0" />
                <span>Zero-loss database extraction, sanitization, and structured cloud ingestion.</span>
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-[#b5a4ff] shrink-0" />
                <span>Dual-run parallel validation to guarantee accounting and records accuracy.</span>
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <CheckCircle2 size={14} className="text-[#b5a4ff] shrink-0" />
                <span>Comprehensive staff training, role migration, and post-launch SLA support.</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/contact?solution=Digital Transformation" arrow>
                Plan Transformation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <CTASection
        primary={["Contact Sales", "/contact"]}
        secondary={["Explore Products", "/marketplace"]}
        title="Let's Design Your Solution."
        text="Discuss your organizational requirements, current architecture, or migration objectives with our technology specialists."
      />
    </>
  );
}
