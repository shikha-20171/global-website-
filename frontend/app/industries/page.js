import IndustriesClient from "./IndustriesClient";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Industry Solutions — Vertical Software Architectures | DEZORYN",
  description:
    "Explore DEZORYN's specialized vertical SaaS and enterprise software engineered for education, healthcare, logistics, manufacturing, retail, and real estate.",
  path: "/industries",
  keywords: [
    "industry software solutions",
    "vertical SaaS",
    "education management software",
    "hospital management system",
    "manufacturing ERP",
    "supply chain software",
    "real estate management software",
  ],
});

export default function IndustriesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Industries", url: "/industries" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <IndustriesClient />
    </>
  );
}
