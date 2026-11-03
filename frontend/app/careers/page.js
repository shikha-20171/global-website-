import CareersClient from "./CareersClient";
import { getDbCareers } from "@/lib/neonDb";
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

export default async function CareersPage() {
  let dbJobs = null;
  try {
    const list = await getDbCareers();
    if (Array.isArray(list) && list.length > 0) {
      dbJobs = list;
    }
  } catch (_) {}

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
      <CareersClient initialJobs={dbJobs} />
    </>
  );
}
