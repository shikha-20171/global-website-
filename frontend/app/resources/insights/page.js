import InsightsClient from "./InsightsClient";
import { getDbInsights } from "@/lib/neonDb";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

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

export default async function InsightsPage() {
  let dbInsights = null;
  try {
    const list = await getDbInsights();
    if (Array.isArray(list) && list.length > 0) {
      dbInsights = list;
    }
  } catch (_) {}

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
      <InsightsClient initialInsights={dbInsights} />
    </>
  );
}
