import CareersClient from "./CareersClient";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Careers — Engineering, AI & Cloud Architecture | DEZORYN",
  description:
    "Explore engineering, AI, and cloud architecture careers at DEZORYN TECHNOLOGY. Centrally based in Bhopal, Madhya Pradesh, India and operating worldwide.",
  path: "/careers",
  keywords: [
    "DEZORYN careers",
    "software engineering jobs",
    "cloud architect careers",
    "AI engineer jobs Bhopal",
    "tech careers India",
  ],
});

export default function CareersPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Careers", url: "/careers" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CareersClient />
    </>
  );
}
