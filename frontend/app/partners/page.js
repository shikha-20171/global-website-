import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { Handshake, Building2, Code2, Globe2, CheckCircle2, ArrowRight } from "lucide-react";
import { getLivePartners } from "@/lib/api";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Partner Program — Solution Partners & Alliances | DEZORYN",
  description:
    "Join the DEZORYN Partner Program. Explore channel partnerships, system integration alliances, and technology co-development opportunities.",
  path: "/partners",
  keywords: [
    "technology partner program",
    "SaaS channel partners",
    "system integrator partnerships",
    "software alliances",
    "DEZORYN partners",
  ],
});

const programs = [
  {
    title: "Solution & Implementation Partners",
    desc: "For IT consultants and agencies who integrate, configure, and deploy DEZORYN SaaS platforms for enterprise clients.",
    benefits: ["Generous revenue sharing & margins", "Priority technical onboarding & sandbox", "Dedicated partner success manager"],
    icon: Building2,
  },
  {
    title: "Technology Alliances",
    desc: "For software vendors, API providers, and cloud infrastructure platforms seeking deep bidirectional integrations.",
    benefits: ["Featured marketplace listing", "Co-marketing & joint webinars", "Direct engineering collaboration channels"],
    icon: Code2,
  },
  {
    title: "Global Channel Distributors",
    desc: "For international distributors and brokers with specialized industry networks across regional enterprise markets.",
    benefits: ["Exclusive regional licensing opportunities", "White-glove pre-sales collateral", "Localized marketing assistance"],
    icon: Globe2,
  },
];

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  let displayPrograms = programs;
  try {
    // Fetch live partner tracks
    const live = await getLivePartners();
    const list = live?.partners || (Array.isArray(live) ? live : null);
    if (Array.isArray(list) && list.length > 0) {
      displayPrograms = list.map((p, idx) => ({
        title: p.title || p.name,
        desc: p.description || p.desc || "",
        logoUrl: p.logoUrl || null,
        benefits: p.benefits || [
          "Generous commercial incentives",
          "Dedicated partner onboarding",
          "Direct enterprise engineering access",
        ],
        icon: [Building2, Code2, Globe2][idx % 3],
      }));
    }
  } catch (e) {}

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Company", url: "/company" },
    { name: "Partners", url: "/partners" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Company", href: "/company" }, { label: "Partners" }]} />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs text-[#9db8ff] mb-5">
              <Handshake size={13} className="text-electric" />
              <span>Global Partner Ecosystem</span>
            </div>
            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Grow Your Business With <span className="text-gradient-blue">Modern Technology.</span>
            </h1>
            <p className="lead mt-5 max-w-2xl">
              Collaborate with a modern technology company. Deliver intelligent SaaS products, enterprise systems, and automation platforms to your clients worldwide.
            </p>
            <div className="mt-8 flex gap-3">
              <Button href="/contact?solution=Partnership" arrow>Apply as Partner</Button>
              <Button href="/marketplace" variant="secondary">Explore Products</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Tracks */}
      <section className="section bg-midnight/60">
        <div className="container-x">
          <h2 className="h-section max-w-xl">Choose Your Partnership Track</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {displayPrograms.map((p, i) => {
              const IconComponent = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="card card-hover flex h-full flex-col justify-between p-8">
                    <div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric mb-6 overflow-hidden">
                        {p.logoUrl ? (
                          <img
                            src={p.logoUrl}
                            alt={p.title}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <IconComponent size={22} />
                        )}
                      </span>
                      <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                      <p className="mt-3 text-sm text-cool leading-relaxed">{p.desc}</p>
                      <div className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                        {p.benefits.map((b) => (
                          <div key={b} className="flex items-center gap-2 text-xs text-white/90">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <Button href="/contact?solution=Partnership" variant="secondary" className="w-full">
                        Become a Partner
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Partner With DEZORYN?"
        lead="Contact our global alliance team to explore commercial terms, API integration opportunities, and regional expansion."
      />
    </>
  );
}
