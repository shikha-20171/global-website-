import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";
import Button from "@/components/Button";
import { BookOpen, Code2, ShieldCheck, Cpu, Terminal, ArrowUpRight } from "lucide-react";

export const docSections = [
  {
    title: "Platform Architecture & System Topology",
    tag: "Core Systems",
    desc: "Overview of DEZORYN microservices, PostgreSQL tenant partitioning, Redis caching layers, and cloud edge CDN configuration.",
  },
  {
    title: "Multi-Tenant Data Isolation Standards",
    tag: "Security & Privacy",
    desc: "Detailed technical specification on row-level security (RLS), schema-per-tenant options, and automated daily encrypted snapshot cycles.",
  },
  {
    title: "Authentication & Role-Based Permissions",
    tag: "Identity & RBAC",
    desc: "Integrating SAML 2.0, OpenID Connect, OAuth 2.0 bearer tokens, and session token renewal intervals.",
  },
  {
    title: "Webhooks & Event-Driven Subscriptions",
    tag: "Integrations",
    desc: "Configuring HMAC-SHA256 signature verification, retry backoff algorithms, and payload structures for real-time events.",
  },
  {
    title: "Database Backup & Disaster Recovery Runbook",
    tag: "DevOps & SRE",
    desc: "Recovery Time Objective (RTO) and Recovery Point Objective (RPO) guarantees with multi-zone AWS & GCP failover testing.",
  },
  {
    title: "Frontend Design System & Tokens",
    tag: "Design Architecture",
    desc: "Typography, color variables, micro-animations, accessible contrast standards, and WCAG 2.2 AA compliance principles.",
  },
];

export default function DocumentationView({ initialDocs }) {
  const sections = initialDocs && initialDocs.length > 0 ? initialDocs : docSections;

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Documentation" },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>TECHNICAL RUNBOOKS &amp; ARCHITECTURE</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Platform Documentation
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Explore comprehensive engineering documentation, data isolation runbooks, and enterprise integration blueprints.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((doc, idx) => (
              <div
                key={idx}
                className="card p-6 border-white/10 bg-[#070b16] flex flex-col justify-between"
              >
                <div>
                  <span className="tag text-[10px] font-mono text-electric border-electric/30 bg-electric/10 mb-3 inline-block">
                    {doc.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{doc.title}</h3>
                  <p className="text-xs text-cool leading-relaxed">{doc.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/60">
                  <Link
                    href="/contact-sales"
                    className="text-xs font-mono text-electric hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Request Technical Spec</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-[#070b16] p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Need an Enterprise Architecture Walkthrough?</h3>
                <p className="mt-1 text-xs text-cool">
                  Our Principal Architects can provide custom data-flow diagrams and infrastructure whitepapers for your procurement team.
                </p>
              </div>
              <Button href="/contact-sales" arrow>
                Request Architecture Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
