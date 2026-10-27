import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { ShieldCheck, FileText, Lock, RefreshCw, Cookie, ArrowRight, ArrowUpRight } from "lucide-react";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Legal & Regulatory Compliance — Privacy, Terms & Security | DEZORYN",
  description:
    "Official corporate compliance documentation: Privacy Policy, Terms of Service, Enterprise Security, SLA Commitments, and Cookie Policy.",
  path: "/legal",
  keywords: [
    "DEZORYN terms",
    "privacy policy",
    "enterprise security policy",
    "legal compliance",
  ],
});

const documents = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    desc: "International data collection, processing disclosures, GDPR/CCPA alignment, and user rights.",
    icon: ShieldCheck,
    updated: "October 1, 2026",
    badge: "GDPR / CCPA",
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    desc: "Commercial terms governing the use of the DEZORYN platform, SaaS marketplaces, and enterprise software.",
    icon: FileText,
    updated: "October 1, 2026",
    badge: "Master Agreement",
  },
  {
    slug: "security",
    title: "Enterprise Security Policy",
    desc: "Architectural security controls, tenant schema isolation, AES-256 encryption, and vulnerability management.",
    icon: Lock,
    updated: "October 1, 2026",
    badge: "SOC 2 Aligned",
  },
  {
    slug: "refund",
    title: "Subscription & Refund Policy",
    desc: "Transparent subscription billing cycles in USD, cancellation procedures, and refund eligibility standards.",
    icon: RefreshCw,
    updated: "October 1, 2026",
    badge: "Billing Terms",
  },
  {
    slug: "cookies",
    title: "Cookie & Tracking Policy",
    desc: "Essential session authentication tokens, UI preferences, and privacy-preserving performance telemetry.",
    icon: Cookie,
    updated: "October 1, 2026",
    badge: "Telemetry",
  },
];

export const dynamic = "force-dynamic";

export default function LegalIndexPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Legal & Compliance", url: "/legal" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="relative overflow-hidden pb-20 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Legal & Compliance" }]} />

          <div className="max-w-3xl mt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-4">
              <ShieldCheck size={13} className="text-electric" />
              <span>REGULATORY GOVERNANCE &amp; TRUST</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Legal &amp; Compliance Center
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Transparent enterprise governance, tenant privacy protections, and commercial terms. All DEZORYN cloud applications adhere to international security and multi-tenant isolation benchmarks.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <Reveal key={doc.slug} delay={idx * 0.05}>
                  <Link
                    href={`/legal/${doc.slug}`}
                    className="group card card-hover flex h-full flex-col justify-between overflow-hidden p-6 border-white/10 bg-[#070b16] transition-all duration-300 hover:border-electric/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-electric/10"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 border border-electric/25 text-electric transition-transform duration-300 group-hover:scale-110">
                          <Icon size={24} />
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-cool">
                          {doc.badge}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-white group-hover:text-electric transition-colors">
                        {doc.title}
                      </h2>
                      <p className="mt-3 text-xs text-cool leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 flex items-center justify-between text-xs border-t border-line/60">
                      <span className="text-[11px] font-mono text-cool/70">Updated: {doc.updated}</span>
                      <span className="inline-flex items-center gap-1 text-electric font-medium transition-transform duration-300 group-hover:translate-x-1">
                        View document <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Need a Custom Data Processing Agreement or Enterprise SLA?"
        text="Our legal and compliance team provides enterprise DPAs, security attestations, and bespoke service level agreements under mutual NDA."
        primary={["Contact Legal & Compliance", "/contact-sales"]}
        secondary={["View Security Policy", "/legal/security"]}
      />
    </>
  );
}
