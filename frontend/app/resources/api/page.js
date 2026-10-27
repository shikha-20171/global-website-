import ApiClient from "./ApiClient";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "API Developer Documentation & Webhook Specifications | DEZORYN",
  description:
    "Official developer reference, REST API endpoints, JWT authentication tokens, and webhook callback documentation for DEZORYN cloud platforms.",
  path: "/resources/api",
  keywords: [
    "DEZORYN API",
    "REST API documentation",
    "cloud developer API",
    "enterprise webhook integrations",
    "API specifications",
    "SaaS endpoints",
  ],
});

export default function ApiDeveloperPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "API Documentation", url: "/resources/api" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ApiClient />
    </>
  );
}
