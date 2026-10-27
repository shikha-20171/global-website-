import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ProductArt from "@/components/ProductArt";
import CTASection from "@/components/CTASection";
import { projects } from "@/lib/data";
import { caseStudiesDetails } from "@/lib/caseStudiesData";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
} from "lucide-react";

export default function ProjectDetailView({ params, initialProject }) {
  const p = initialProject || projects.find((x) => x.slug === params.slug);
  if (!p) notFound();

  const details = caseStudiesDetails[params.slug];

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Portfolio", href: "/portfolio" },
              { label: p.name },
            ]}
          />

          <div className="mt-6 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="tag border-electric/30 bg-electric/10 text-electric font-mono text-xs">
                  {p.industry}
                </span>
                <span className="tag text-xs font-mono">{p.type} System</span>
                <span className="tag border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
                  Production Deployed
                </span>
              </div>

              <h1 className="h-display text-3xl sm:text-5xl lg:text-6xl text-white">
                {p.name}
              </h1>

              <p className="lead mt-5 text-base sm:text-lg text-cool max-w-2xl leading-relaxed">
                {p.result}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/case-studies/${p.slug}`}
                  className="btn btn-primary h-11 px-6 text-xs font-medium inline-flex items-center gap-2"
                >
                  <span>Read Full Architectural Blueprint</span>
                  <ArrowUpRight size={14} />
                </Link>
                {p.product && (
                  <Link
                    href={`/products/${p.product}`}
                    className="btn btn-secondary h-11 px-6 text-xs font-medium"
                  >
                    Explore SaaS Platform
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0a0f1b] shadow-2xl">
                {p.image ? (
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                  </div>
                ) : (
                  <ProductArt hue={p.hue} className="h-72 sm:h-80" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCOPE & DELIVERABLES ─── */}
      <section className="section bg-midnight/50 border-b border-line">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Project Scope
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Engineering &amp; Deliverables
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">
                Key software components, APIs, and multi-tenant services engineered for this deployment.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#070b16] p-5">
                <div className="text-xs font-mono text-white mb-2">Technology Stack</div>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded border border-line bg-white/5 px-2.5 py-1 text-xs font-mono text-cool">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              <div className="card p-6 border-white/10 bg-[#070b16]">
                <div className="flex items-center gap-2 text-xs font-mono text-electric mb-2">
                  <ShieldCheck size={16} /> Data Security &amp; Tenant Isolation
                </div>
                <h3 className="font-semibold text-white text-base">Multi-Tenant Partitioning</h3>
                <p className="mt-2 text-xs text-cool leading-relaxed">
                  Strict logical boundaries protect organizational databases, user sessions, and regulatory audit ledgers.
                </p>
              </div>

              <div className="card p-6 border-white/10 bg-[#070b16]">
                <div className="flex items-center gap-2 text-xs font-mono text-electric mb-2">
                  <Zap size={16} /> High Concurrency
                </div>
                <h3 className="font-semibold text-white text-base">Event-Driven Workflows</h3>
                <p className="mt-2 text-xs text-cool leading-relaxed">
                  Microservices handle peak transaction throughput, automated communications, and scheduled data exports with zero lag.
                </p>
              </div>

              <div className="card p-6 border-white/10 bg-[#070b16]">
                <div className="flex items-center gap-2 text-xs font-mono text-electric mb-2">
                  <Globe2 size={16} /> Global Cloud Deployment
                </div>
                <h3 className="font-semibold text-white text-base">Global Edge Acceleration</h3>
                <p className="mt-2 text-xs text-cool leading-relaxed">
                  Deployed on multi-region cloud infrastructure with sub-second response times worldwide and automated failover.
                </p>
              </div>

              <div className="card p-6 border-white/10 bg-[#070b16]">
                <div className="flex items-center gap-2 text-xs font-mono text-electric mb-2">
                  <Cpu size={16} /> Operational Automation
                </div>
                <h3 className="font-semibold text-white text-base">Role-Based Administration</h3>
                <p className="mt-2 text-xs text-cool leading-relaxed">
                  Granular permission matrices for administrators, operational staff, and external client portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CASE STUDY SUMMARY SECTION ─── */}
      {details && (
        <section className="section bg-midnight/30 border-b border-line">
          <div className="container-x">
            <div className="max-w-4xl">
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Case Study Overview
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Strategic Challenge &amp; Solution
              </h2>
              <p className="mt-4 text-sm text-cool leading-relaxed">
                {details.challenge}
              </p>
              <div className="mt-6 rounded-xl border border-electric/30 bg-electric/10 p-5">
                <div className="text-xs font-mono text-electric mb-1 font-semibold">Implemented Solution</div>
                <p className="text-xs text-white/90 leading-relaxed">{details.solution}</p>
              </div>

              <div className="mt-8">
                <Link
                  href={`/case-studies/${p.slug}`}
                  className="btn btn-secondary h-10 px-5 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>View Full Architectural Milestones</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA ─── */}
      <CTASection
        title={`Deploy Similar Infrastructure for Your Business`}
        text="Discuss your organizational goals with our enterprise solutions team."
        primary={["Talk to an Expert", "/contact-sales"]}
        secondary={["Explore SaaS Marketplace", "/marketplace"]}
      />
    </>
  );
}
