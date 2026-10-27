import DocumentationView from "@/components/DocumentationView";
import { getLiveRunbooks } from "@/lib/api";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Platform Documentation & Cloud Architecture — DEZORYN Resources",
  description:
    "Comprehensive technical documentation, multi-tenant database models, REST API specifications, and cloud security benchmarks for DEZORYN software.",
  path: "/resources/docs",
  keywords: [
    "DEZORYN documentation",
    "cloud software architecture",
    "multi-tenant database models",
    "platform runbooks",
    "technical specs",
  ],
});

export default async function DocsPage() {
  let docs = null;
  try {
    // Fetch runbooks
    const res = await getLiveRunbooks();
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      docs = list.map((item) => ({
        title: item.title,
        tag: item.category || "Architecture",
        desc: item.content || item.summary || "Comprehensive system implementation runbook.",
        version: item.version,
        codeSample: item.codeSample,
      }));
    }
  } catch (err) {}

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "Documentation", url: "/resources/docs" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <DocumentationView initialDocs={docs} />
    </>
  );
}
