import FAQView, { allFaqs } from "@/components/FAQView";
import { getLiveFaqs } from "@/lib/api";
import { buildMetadata, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions — Deployment, Security & Pricing | DEZORYN",
  description:
    "Comprehensive answers regarding DEZORYN cloud SaaS platforms, multi-tenant isolation, enterprise data security, global USD pricing, and SLAs.",
  path: "/faq",
  keywords: [
    "DEZORYN FAQ",
    "cloud software questions",
    "SaaS security FAQ",
    "enterprise software deployment FAQ",
  ],
});

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  let liveItems = null;
  try {
    const res = await getLiveFaqs();
    const faqs = res?.faqs || (Array.isArray(res) ? res : null);
    if (Array.isArray(faqs) && faqs.length > 0) {
      liveItems = faqs.map((f) => [f.question, f.answer]);
    }
  } catch (err) {
    // Graceful fallback to default curated FAQs
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  const activeFaqList = (liveItems && liveItems.length > 0) ? liveItems : allFaqs;
  const faqSchema = generateFAQSchema(
    activeFaqList.map(([q, a]) => ({ q, a }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <FAQView items={liveItems} />
    </>
  );
}
