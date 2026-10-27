import InsightsClient from "./InsightsClient";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industry Insights, Research Papers & Whitepapers | DEZORYN",
  description:
    "Download executive research reports, cloud total cost of ownership (TCO) benchmarks, and architectural whitepapers from DEZORYN TECHNOLOGY.",
  path: "/resources/insights",
  keywords: [
    "enterprise software whitepapers",
    "cloud TCO benchmark",
    "SaaS research reports",
    "AI architecture analysis",
    "DEZORYN insights",
  ],
});

export default function InsightsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "Industry Insights", url: "/resources/insights" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <InsightsClient />
    </>
  );
}
