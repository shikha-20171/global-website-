import PortfolioView from "@/components/PortfolioView";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio — Selected Client Projects & Software | DEZORYN TECHNOLOGY",
  description:
    "Explore DEZORYN's portfolio of web platforms, mobile applications, and enterprise software engineered for real-world businesses across education, healthcare, real estate, and retail.",
  path: "/portfolio",
  keywords: [
    "DEZORYN portfolio",
    "client software projects",
    "enterprise software development",
    "web platform engineering",
    "mobile app portfolio",
  ],
});

export default function PortfolioPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PortfolioView />
    </>
  );
}
