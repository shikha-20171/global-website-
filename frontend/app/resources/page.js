import ResourcesClient from "./ResourcesClient";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Resources, Blueprints & Implementation Runbooks | DEZORYN",
  description:
    "Curated technical blueprints, enterprise SaaS evaluation frameworks, implementation runbooks, and developer guides from DEZORYN TECHNOLOGY.",
  path: "/resources",
  keywords: [
    "enterprise software resources",
    "SaaS architecture blueprints",
    "implementation runbooks",
    "developer API documentation",
    "DEZORYN knowledge base",
  ],
});

export default function ResourcesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ResourcesClient />
    </>
  );
}
