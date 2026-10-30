import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CTASection from "@/components/CTASection";
import { products, CATEGORIES } from "@/lib/data";
import { Layers, ArrowRight } from "lucide-react";

const toSlug = (cat) => cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const ALIASES = {
  residential: "Real Estate",
  "residential-communities": "Real Estate",
  "hr-workforce": "HR",
  marketing: "Communication",
  legal: "Security",
  "legal-compliance": "Security",
  media: "Operations",
  "media-publishing": "Operations",
  "security-proctoring": "Security",
  "infrastructure-devops": "Operations",
  devops: "Operations",
  "finance-accounting": "Finance",
  business: "Business Management",
  "business-management": "Business Management",
  saas: "Business Management",
};

const resolveCategory = (slug) => {
  if (ALIASES[slug]) return ALIASES[slug];
  return CATEGORIES.find((c) => toSlug(c) === slug);
};

export const generateStaticParams = () => [
  ...CATEGORIES.map((cat) => ({ slug: toSlug(cat) })),
  ...Object.keys(ALIASES).map((slug) => ({ slug })),
];

import { buildMetadata, generateBreadcrumbSchema, generateItemListSchema } from "@/lib/seo";

export function generateMetadata({ params }) {
  const category = resolveCategory(params.slug);
  return category
    ? buildMetadata({
        title: `${category} SaaS Products — Marketplace | DEZORYN`,
        description: `Explore verified ${category.toLowerCase()} software products, enterprise platforms, and cloud solutions from DEZORYN TECHNOLOGY.`,
        path: `/marketplace/category/${params.slug}`,
        keywords: [
          `${category} SaaS`,
          `${category} software`,
          "enterprise cloud software",
          "DEZORYN marketplace",
        ],
      })
    : {};
}

import api from "@/lib/axios";

export default async function MarketplaceCategoryPage({ params }) {
  const category = resolveCategory(params.slug);
  if (!category) notFound();

  let allProducts = products;
  try {
    // Direct Axios API call inside Marketplace Category page
    const res = await api.get("/api/v1/products");
    const live = res.data?.data || res.data?.products || (Array.isArray(res.data) ? res.data : null);
    if (Array.isArray(live) && live.length > 0) {
      allProducts = live;
    }
  } catch (err) {
    console.warn("Marketplace category live notice:", err?.message || err);
  }

  const matchingProducts = allProducts.filter((p) => {
    const catName =
      typeof p.category === "object" && p.category !== null
        ? p.category.name || p.category.slug || ""
        : p.category || "";
    return catName.toLowerCase() === category.toLowerCase();
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Marketplace", url: "/marketplace" },
    { name: `${category} Software`, url: `/marketplace/category/${params.slug}` },
  ]);

  const categoryProductsSchema = generateItemListSchema(
    `${category} SaaS Software`,
    matchingProducts.map((p) => ({
      name: p.name,
      url: `/products/${p.slug}`,
    })),
    `/marketplace/category/${params.slug}`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryProductsSchema) }}
      />
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Marketplace", href: "/marketplace" },
              { label: "Categories", href: "/marketplace" },
              { label: category },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>MARKETPLACE CATEGORY</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              {category} Software
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Explore specialized cloud platforms, tools, and SaaS solutions engineered for {category.toLowerCase()} operations.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section bg-midnight/40">
        <div className="container-x">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
            <span className="text-xs font-mono text-cool">
              Showing <span className="text-white font-bold">{matchingProducts.length}</span> platforms in {category}
            </span>
            <Link
              href="/marketplace"
              className="text-xs font-mono text-electric hover:underline inline-flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {matchingProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchingProducts.map((p, i) => (
                <ProductCard key={p.slug} p={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="card py-16 text-center text-cool">
              <p className="text-base text-white">New products in {category} are currently in development.</p>
              <Link href="/marketplace" className="btn btn-secondary mt-4 h-9 px-4 text-xs">
                Browse Other Marketplace Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title={`Looking for Custom ${category} Software?`}
        text={`Discuss your specific ${category.toLowerCase()} workflow requirements or explore bespoke extensions with our systems architects.`}
        primary={["Discuss Your Requirements", "/contact-sales"]}
        secondary={["View All Categories", "/marketplace"]}
      />
    </>
  );
}
