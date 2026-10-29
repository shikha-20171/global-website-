import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { Compass, Target, Globe2, ShieldCheck, Cpu, Sparkles, Layers, ArrowRight } from "lucide-react";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mission, Vision & Engineering Principles | DEZORYN",
  description:
    "Our mission is to make resilient enterprise technology accessible, scalable, and intelligent for organizations worldwide through precision cloud software.",
  path: "/mission",
  keywords: [
    "DEZORYN mission",
    "software engineering principles",
    "cloud technology vision",
    "enterprise software standards",
  ],
});

const pillars = [
  {
    icon: Compass,
    title: "Global Technology Ecosystem",
    desc: "Building integrated SaaS platforms that eliminate manual friction, modernize legacy workflows, and power modern global commerce.",
  },
  {
    icon: Target,
    title: "Precision Engineering",
    desc: "Designing resilient, multi-tenant digital infrastructure with bank-grade security, enterprise compliance, and low-latency worldwide availability.",
  },
  {
    icon: Sparkles,
    title: "Applied Intelligence",
    desc: "Embedding practical AI and automation into everyday operational software so businesses can operate faster with fewer manual errors.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Reliability",
    desc: "Providing predictable, scalable systems with transparent USD pricing, long-term architectural stability, and dedicated customer alignment.",
  },
];

import { getLiveCompanyProfile } from "@/lib/api";

export default async function MissionPage() {
  let profile = null;
  try {
    // Fetch company profile
    profile = await getLiveCompanyProfile();
  } catch (err) {}

  const missionText = profile?.mission || "To make powerful technology accessible, scalable and intelligent for businesses everywhere.";
  const visionText = profile?.vision || "To build a global ecosystem of software products that powers the next generation of businesses.";
  const tagline = profile?.tagline || "Technology That Moves Businesses Forward.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Company", url: "/company" },
    { name: "Mission & Principles", url: "/mission" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-20 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Company", href: "/company" },
              { label: "Mission & Vision" },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>CORE PURPOSE &amp; PHILOSOPHY</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              {tagline}
            </h1>

            <p className="lead mt-6 text-base sm:text-lg text-cool leading-relaxed">
              We build intelligent SaaS platforms, enterprise software, and digital solutions designed to help organizations operate, scale, and compete globally.
            </p>
          </div>
        </div>
      </section>

      {/* ─── MISSION & VISION STATEMENTS ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric/15 blur-3xl" />
              <div>
                <span className="text-xs font-mono text-electric uppercase tracking-wider">
                  Our Mission
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                  Accessible, Scalable &amp; Intelligent.
                </h2>
                <blockquote className="mt-6 text-lg sm:text-xl font-medium text-white/95 leading-relaxed border-l-2 border-electric pl-5">
                  “{missionText}”
                </blockquote>
                <p className="mt-4 text-xs sm:text-sm text-cool leading-relaxed">
                  We demystify modern cloud software by replacing costly, fragile custom builds with production-tested, multi-tenant SaaS platforms that deploy in minutes.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-line/60 flex items-center gap-2 text-xs font-mono text-cool">
                <span>01 / CORE MISSION</span>
              </div>
            </div>

            {/* Vision */}
            <div className="card p-8 sm:p-10 border-white/10 bg-[#070b16] relative overflow-hidden flex flex-col justify-between">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/15 blur-3xl" />
              <div>
                <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">
                  Our Vision
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                  The Global Software Ecosystem.
                </h2>
                <blockquote className="mt-6 text-lg sm:text-xl font-medium text-white/95 leading-relaxed border-l-2 border-violet-500 pl-5">
                  “{visionText}”
                </blockquote>
                <p className="mt-4 text-xs sm:text-sm text-cool leading-relaxed">
                  From educational campuses and healthcare clinics to real estate enterprises and retail networks, we empower companies with unified digital infrastructure.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-line/60 flex items-center gap-2 text-xs font-mono text-cool">
                <span>02 / STRATEGIC HORIZON</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUIDING PILLARS ─── */}
      <section className="section bg-midnight/30 border-b border-line">
        <div className="container-x">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Engineering Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              How We Build &amp; Operate
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-cool">
              Our products are engineered around clarity, restraint, and enterprise performance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card p-6 border-white/10 bg-[#070b16]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/30 mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGY HORIZON 2030 ROADMAP ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Strategic Horizon
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              The 2030 Technology Roadmap
            </h2>
            <p className="mt-3 text-sm text-cool leading-relaxed">
              How DEZORYN is architecting the next decade of intelligent computing, automated enterprise workflows, and sovereign cloud infrastructure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                phase: "Phase 01: 2026–2027",
                title: "Unified Domain Micro-SaaS",
                desc: "Scaling 20 domain-specific platforms across healthcare, education, and real estate with instant multi-tenant provisioning and automated USD billing.",
                status: "Active Deployment",
                tag: "Current Phase",
              },
              {
                phase: "Phase 02: 2027–2028",
                title: "Autonomous Agentic Workflows",
                desc: "Embedding specialized AI agents into back-office ledgers, inventory scheduling, and compliance auditing to eliminate 90% of manual data transcription.",
                status: "Lab Development",
                tag: "AI Integration",
              },
              {
                phase: "Phase 03: 2029–2030",
                title: "Decentralized Edge Sovereignty",
                desc: "Zero-latency multi-region edge mesh allowing multinational clients to physically store customer records inside their home regulatory boundaries.",
                status: "Research & R&D",
                tag: "Sovereign Cloud",
              },
            ].map((r, idx) => (
              <div
                key={r.phase}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#070b16] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/50 hover:shadow-[0_15px_35px_-10px_rgba(47,107,255,0.25)] flex flex-col justify-between"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-electric to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-electric font-semibold uppercase tracking-wider">
                      {r.phase}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-mono text-cool">
                      {r.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-electric transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">
                    {r.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-cool/60">Milestone Status:</span>
                  <span className="text-emerald-400 font-medium">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Align With Our Long-Term Vision"
        text="Partner with DEZORYN as we engineer the next generation of scalable, intelligent cloud architecture."
        primary={["Join the Mission", "/careers"]}
        secondary={["Read Architecture Research", "/resources/insights"]}
      />
    </>
  );
}
