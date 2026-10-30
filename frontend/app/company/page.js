import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import CompanyHeroVisual from "@/components/CompanyHeroVisual";
import CompanyWhyChooseCards from "@/components/CompanyWhyChooseCards";
import CompanyTechStackCards from "@/components/CompanyTechStackCards";
import api from "@/lib/axios";
import {
  Building2,
  Target,
  Eye,
  Gem,
  Cpu,
  ShieldCheck,
  Globe2,
  Users,
  CheckCircle2,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  Database,
  Cloud,
  Star,
} from "lucide-react";

import { modernTechStack } from "@/lib/data";
import { buildMetadata, generateBreadcrumbSchema, generateAboutPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About DEZORYN — Enterprise Software & Cloud Infrastructure | DEZORYN",
  description:
    "Learn about DEZORYN TECHNOLOGY. Discover our mission to build a global ecosystem of intelligent SaaS platforms, enterprise architecture, and secure cloud infrastructure.",
  path: "/company",
  keywords: [
    "about DEZORYN",
    "DEZORYN TECHNOLOGY",
    "enterprise software company",
    "cloud infrastructure provider",
    "SaaS engineering organization",
  ],
});

const corePillars = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To make powerful technology accessible, scalable, and intelligent for businesses everywhere.",
    tag: "Mission",
    color: "from-blue-500/20 via-blue-500/10 to-transparent",
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "To build a global ecosystem of software products that powers the next generation of businesses.",
    tag: "Vision",
    color: "from-violet-500/20 via-violet-500/10 to-transparent",
    accent: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  },
  {
    icon: Gem,
    title: "Our Values",
    desc: "Architectural craftsmanship, zero unnecessary complexity, customer transparency, and a global technology mindset.",
    tag: "Values",
    color: "from-sky-500/20 via-sky-500/10 to-transparent",
    accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  },
];

const whyDezoryn = [
  {
    title: "Purpose-Built for Real Workflows",
    desc: "We do not sell generic one-size-fits-all software. Every platform is designed around the actual administrative workflows of its respective domain.",
  },
  {
    title: "Maintainable & Modular Architecture",
    desc: "Our systems are built on clean, modular services that avoid monolithic lock-in, enabling organizations to scale smoothly over decades.",
  },
  {
    title: "Enterprise Security & RBAC by Default",
    desc: "Zero-trust access hierarchies, encrypted database partitions, and immutable audit logs are built into our foundation, never retrofitted.",
  },
  {
    title: "Continuous Innovation & AI Integration",
    desc: "We continuously evolve our SaaS platforms with intelligent automation, predictive insights, and streamlined user interfaces.",
  },
];

const engineeringStandards = [
  {
    title: "Pragmatic Engineering Over Hype",
    desc: "We select robust, battle-tested technologies and design systems for predictable performance, fast load times, and low maintenance overhead.",
    tag: "Architecture",
  },
  {
    title: "API-First & Interoperable",
    desc: "Every DEZORYN product is engineered with standardized APIs and event webhooks, enabling seamless integration with existing enterprise stacks.",
    tag: "Connectivity",
  },
  {
    title: "Data Sovereignty & Privacy",
    desc: "Strict compliance with regional data residency guidelines, isolated tenant storage, and transparent data ownership policies.",
    tag: "Security",
  },
];

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  let profile = null;
  try {
    // Direct Axios API call inside Company page
    const res = await api.get("/api/v1/company");
    profile = res.data?.data || res.data?.profile || res.data;
  } catch (err) {
    console.warn("Company live profile notice:", err?.message || err);
  }

  const pillars = [
    {
      icon: Target,
      title: "Our Mission",
      desc: profile?.mission || corePillars[0].desc,
      tag: "Mission",
      color: "from-blue-500/20 via-blue-500/10 to-transparent",
      accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
      icon: Eye,
      title: "Our Vision",
      desc: profile?.vision || corePillars[1].desc,
      tag: "Vision",
      color: "from-violet-500/20 via-violet-500/10 to-transparent",
      accent: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    },
    {
      icon: Gem,
      title: "Our Values",
      desc: typeof profile?.values === "string" ? profile.values : (Array.isArray(profile?.values) ? profile.values.map((v) => (typeof v === "object" ? `${v.title || ""}: ${v.desc || ""}` : v)).join(" • ") : corePillars[2].desc),
      tag: "Values",
      color: "from-sky-500/20 via-sky-500/10 to-transparent",
      accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Company", url: "/company" },
  ]);
  const aboutSchema = generateAboutPageSchema();

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {aboutSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        />
      )}
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[100px] animate-pulse" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-[300px] w-[400px] rounded-full bg-violet/10 blur-[90px]" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Company" }]} />

          {/* 2-Column Hero: Headline + 3D Holographic Orbit Stage */}
          <div className="mt-4 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-[#9db8ff] shadow-[0_0_15px_rgba(47,107,255,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                <span>GLOBAL CORPORATE PROFILE</span>
              </div>

              <h1 className="h-display text-4xl sm:text-6xl text-white leading-tight">
                Building the Digital Future{" "}
                <span className="text-gradient-blue">
                  From India to the World.
                </span>
              </h1>

              <p className="lead mt-5 max-w-xl text-cool/90 leading-relaxed font-normal">
                DEZORYN TECHNOLOGY is a global technology organization engineering specialized SaaS products, enterprise platforms, and digital solutions designed to help modern businesses operate, scale, and compete worldwide.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact" arrow>
                  Contact Sales
                </Button>
                <Button href="/portfolio" variant="secondary" arrow>
                  Explore Portfolio
                </Button>
              </div>
            </div>

            {/* 3D Holographic Interactive Orbit Stage */}
            <div className="relative">
              <CompanyHeroVisual />
            </div>
          </div>

          {/* Core Architectural Focus Badges */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["SaaS Marketplace", "20 Specialized Products"],
              ["Industry Domains", "10 Vertical Solutions"],
              ["Cloud Architecture", "Multi-Tenant & Isolated"],
              ["Global Standard", "USD Billing & Global Reach"],
            ].map(([title, subtitle], idx) => (
              <Reveal key={title} delay={idx * 0.06}>
                <div className="group relative overflow-hidden rounded-xl border border-line bg-graphite/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-[0_10px_30px_-10px_rgba(47,107,255,0.35)]">
                  {/* Subtle top laser glow line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-electric/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="text-base font-bold text-white tracking-tight">
                    {title}
                  </div>
                  <div className="mt-1 text-xs text-electric font-mono flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-electric animate-pulse" />
                    <span>{subtitle}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section className="section bg-midnight/60 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-electric/5 blur-[120px]" />

        <div className="container-x relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-electric">
                <Building2 size={14} className="animate-pulse" />
                <span>WHO WE ARE</span>
              </div>
              <h2 className="h-section">
                An International Technology Organization.
              </h2>
              <p className="lead mt-4 text-cool">
                Unlike conventional software agencies that bill for hours, DEZORYN TECHNOLOGY builds reusable product infrastructure, enterprise platforms, and scalable digital solutions. We combine product design excellence with deep enterprise engineering to create software that solves real operational friction.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  {
                    title: "Product-Centric Innovation",
                    desc: "We design, maintain, and continuously enhance our own proprietary SaaS product catalog across education, healthcare, real estate, and finance.",
                  },
                  {
                    title: "Enterprise Engineering Rigor",
                    desc: "We construct bespoke business systems with role-based permissions, automated audit logs, and zero-loss data replication.",
                  },
                  {
                    title: "Global Scalability",
                    desc: "Our platforms are architected from Day 1 for multi-tenant isolation, international currency support, and edge deployment.",
                  },
                ].map((item, idx) => (
                  <Reveal key={item.title} delay={idx * 0.08}>
                    <div className="group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-white/5 hover:bg-white/[0.02]">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-electric/30 bg-electric/10 text-electric shadow-[0_0_10px_rgba(47,107,255,0.2)] transition-transform duration-200 group-hover:scale-110">
                        <CheckCircle2 size={15} />
                      </div>
                      <p className="text-sm text-cool leading-relaxed">
                        <strong className="text-white">{item.title}: </strong>
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 4 Spotlight Interactive Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Cpu,
                  title: "Less Noise, More Intelligence",
                  desc: "We eliminate bloated menus, redundant forms, and complex configurations in favor of streamlined, intuitive interfaces.",
                },
                {
                  icon: ShieldCheck,
                  title: "Security-First Mindset",
                  desc: "Data encryption, tenant boundaries, and least-privilege administrative access are fundamental design constraints.",
                },
                {
                  icon: Layers,
                  title: "Modular Building Blocks",
                  desc: "Every product is assembled from tested, reusable components, reducing deployment timelines and regression risks.",
                },
                {
                  icon: Globe2,
                  title: "World-Ready Infrastructure",
                  desc: "Centralized multi-currency models, global time zone support, and low-latency edge caching for clients worldwide.",
                },
              ].map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <Reveal key={card.title} delay={idx * 0.07}>
                    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#070b16] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/50 hover:bg-[#081024] hover:shadow-[0_15px_35px_-10px_rgba(47,107,255,0.3)]">
                      {/* Laser beam top indicator */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-electric to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric shadow-[0_0_15px_rgba(47,107,255,0.2)] transition-transform duration-300 group-hover:scale-110 group-hover:border-electric group-hover:shadow-[0_0_20px_rgba(47,107,255,0.5)]">
                        <IconComponent size={22} />
                      </div>
                      <h3 className="font-bold text-white text-base transition-colors group-hover:text-[#b9ccff]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs text-cool leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MISSION, VISION & VALUES ─── */}
      <section className="section border-t border-line relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-electric/10 blur-[140px]" />

        <div className="container-x relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Foundational Principles
            </span>
            <h2 className="h-section mt-2">Mission, Vision &amp; Values</h2>
            <p className="lead mt-3 text-cool">
              The core principles guiding our product development, architectural decisions, and client partnerships.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p, idx) => {
              const IconComponent = p.icon;
              return (
                <Reveal key={p.title} delay={idx * 0.08}>
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#070b16]/95 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-sky-400/50 hover:shadow-[0_25px_60px_rgba(56,189,248,0.22)]">
                    {/* Top Animated Laser Border Beam */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_15px_#38bdf8]" />

                    {/* Inner glowing radial sweep */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${p.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] ${p.accent}`}
                        >
                          <IconComponent size={22} />
                        </span>
                        <span className="tag text-[10.5px] font-mono border-white/15 bg-white/5">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-white transition-colors duration-300 group-hover:text-sky-300">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm text-cool leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cool/70">
                      <span className="uppercase text-[10px] tracking-wider text-slate-400">FOUNDATIONAL</span>
                      <span className="text-sky-400 font-semibold group-hover:text-white group-hover:translate-x-1.5 transition-all">
                        PILLAR 0{idx + 1} →
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE DEZORYN ─── */}
      <section className="section bg-midnight/60 border-t border-line relative overflow-hidden">
        <div className="container-x relative z-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Competitive Advantage
              </span>
              <h2 className="h-section mt-2 max-w-xl">
                Why Organizations <span className="text-gradient-blue">Choose DEZORYN</span>
              </h2>
              <p className="lead mt-3 text-cool max-w-xl">
                Our approach delivers software that simplifies daily management rather than creating administrative bottlenecks.
              </p>
            </div>
            <Button href="/marketplace" variant="secondary" arrow>
              Browse Products
            </Button>
          </div>

          <CompanyWhyChooseCards items={whyDezoryn} />
        </div>
      </section>

      {/* ─── OUR MODERN TECHNOLOGY STACK ─── */}
      <section className="section bg-midnight/50 border-t border-line relative overflow-hidden">
        {/* Soft atmospheric gradient glows */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[800px] rounded-full bg-electric/10 blur-[150px]" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-[350px] w-[350px] rounded-full bg-violet/10 blur-[120px]" />

        <div className="container-x relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Engineering Architecture
            </span>
            <h2 className="h-section mt-2 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Modern <span className="text-gradient-blue">Technology Stack</span>
            </h2>
            <p className="lead mt-4 text-cool text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We leverage cutting-edge technologies and proven frameworks to build robust, scalable, and maintainable applications that stand the test of time.
            </p>
          </div>

          <CompanyTechStackCards items={modernTechStack} />
        </div>
      </section>

      {/* ─── CORPORATE HEADQUARTERS ─── */}
      <section className="section bg-midnight/40 border-t border-line relative overflow-hidden">
        <div className="container-x relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Operating Headquarters
            </span>
            <h2 className="h-section mt-2">
              Corporate Headquarters &amp; Engineering Center
            </h2>
            <p className="lead mt-3 text-cool">
              DEZORYN TECHNOLOGY operates centrally from Bhopal, Madhya Pradesh, India — architecting, building, and deploying world-class SaaS products and digital infrastructure for modern businesses worldwide.
            </p>
          </div>

          <div className="mt-10 max-w-2xl">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#070b16] p-8 transition-all duration-300 hover:border-electric/40 hover:shadow-[0_20px_50px_rgba(47,107,255,0.2)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-electric to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-mono text-electric font-semibold">
                  Global Headquarters
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>
              <h3 className="font-extrabold text-white text-2xl group-hover:text-[#b9ccff] transition-colors">
                Bhopal, Madhya Pradesh, India
              </h3>
              <div className="mt-1 text-sm text-electric font-mono">Central Technology &amp; R&amp;D Hub</div>
              <p className="mt-4 text-sm text-cool leading-relaxed font-sans">
                Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-cool/90">
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Core Focus:</strong>
                  SaaS Platform Development, AI &amp; Cloud Infrastructure, Enterprise Solutions.
                </div>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Global Client Reach:</strong>
                  Worldwide Delivery &amp; Support across North America, Europe, Middle East &amp; Asia.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEADERSHIP & ENGINEERING PHILOSOPHY ─── */}
      <section className="section bg-midnight/40 border-t border-line relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />

        <div className="container-x relative z-10">
          <div className="max-w-4xl">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Leadership &amp; Standards
            </span>
            <h2 className="h-section mt-2">
              Engineering Leadership &amp; Governance
            </h2>
            <p className="lead mt-3 text-cool">
              Our engineering organization operates under strict governance benchmarks ensuring reliable product delivery, data privacy, and maintainable software standards across all client engagements.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {engineeringStandards.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 0.06}>
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#070b16] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/40 hover:bg-[#081024] hover:shadow-[0_15px_35px_-10px_rgba(47,107,255,0.3)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-electric to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="mb-3 flex items-center justify-between">
                    <span className="tag text-[10px] font-mono border-electric/30 bg-electric/10 text-electric">
                      {s.tag}
                    </span>
                    <span className="text-xs font-mono text-white/30">0{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-white text-base transition-colors group-hover:text-[#b9ccff]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-line bg-gradient-to-r from-graphite/60 via-midnight/80 to-graphite/60 p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-electric/15 blur-2xl" />
            <div className="relative z-10">
              <div className="font-bold text-white text-base">
                Looking to collaborate or build with our team?
              </div>
              <p className="text-xs text-cool mt-1">
                Explore partnership tracks or discover career openings at DEZORYN TECHNOLOGY.
              </p>
            </div>
            <div className="flex gap-3 relative z-10">
              <Button href="/partners" variant="secondary" arrow className="text-xs h-9">
                Partners Program
              </Button>
              <Button href="/careers" variant="secondary" arrow className="text-xs h-9">
                View Careers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <CTASection
        primary={["Discuss Your Project", "/contact"]}
        secondary={["Book a Demo", "/demo"]}
        title="Ready to Move Your Business Forward?"
        text="Discuss your organizational challenges with our systems architects and discover how DEZORYN can streamline your operations."
      />
    </>
  );
}
