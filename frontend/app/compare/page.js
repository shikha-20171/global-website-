import CompareView from "@/components/CompareView";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compare SaaS Products & Features Side by Side | DEZORYN",
  description:
    "Compare DEZORYN cloud software products side by side across security, database isolation, pricing, compliance, and enterprise feature sets.",
  path: "/compare",
  keywords: [
    "compare SaaS products",
    "software feature comparison",
    "enterprise software specs",
    "cloud software matrix",
  ],
});

export default function ComparePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare Products", url: "/compare" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CompareView />
    </>
  );
}
