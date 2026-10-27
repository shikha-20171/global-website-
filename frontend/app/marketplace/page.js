import MarketplaceView from "@/components/MarketplaceView";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";
import { ShoppingBag, Sparkles, Filter, Layers } from "lucide-react";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "SaaS Marketplace — Production Cloud Software | DEZORYN",
  description:
    "Explore enterprise-grade SaaS platforms across education, healthcare, real estate, ERP, HR, and business automation. Transparent USD pricing with instant sandbox activation.",
  path: "/marketplace",
  keywords: [
    "SaaS marketplace",
    "cloud software provisioning",
    "enterprise software marketplace",
    "multi-tenant SaaS",
    "business automation software",
  ],
});

export default function MarketplacePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="pb-28 pt-32 relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Marketplace" }]} />

          <div className="mb-12 mt-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <ShoppingBag size={13} className="text-electric" />
              <span>COMMERCIAL SAAS MARKETPLACE (SRS §15)</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              SaaS <span className="text-gradient-blue">Marketplace.</span>
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Find, evaluate, and launch production-ready SaaS platforms built for modern organizations. Complete with transparent monthly/annual USD billing, automated onboarding, and multi-tenant isolation.
            </p>
          </div>

          <MarketplaceView />
        </div>
      </section>

      <CTASection
        title="Need an Enterprise Multi-Product Bundle?"
        text="Organizations deploying multiple DEZORYN platforms qualify for unified single-sign-on (SSO), consolidated billing, and volume margin discounts."
        primary={["Discuss Volume Licensing", "/contact-sales"]}
        secondary={["Compare Product Capabilities", "/compare"]}
      />
    </>
  );
}
