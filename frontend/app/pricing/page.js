import PricingView from "@/components/PricingView";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Transparent SaaS Pricing & Enterprise Plans | DEZORYN",
  description:
    "Explore transparent USD pricing for DEZORYN cloud SaaS platforms and custom enterprise solutions. Tiered subscriptions with no hidden fees and instant sandbox access.",
  path: "/pricing",
  keywords: [
    "SaaS pricing",
    "enterprise software cost",
    "cloud software subscription",
    "transparent pricing plans",
    "DEZORYN pricing",
  ],
});

export default function PricingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PricingView />
    </>
  );
}
