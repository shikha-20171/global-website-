import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products, getProduct } from "@/lib/data";
import api from "@/lib/axios";
import {
  buildMetadata,
  generateSoftwareApplicationSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  let p = null;
  try {
    // Direct Axios call for product metadata
    const res = await api.get(`/api/v1/products/${params.slug}`);
    const live = res.data?.data || res.data?.product || res.data;
    if (live && (live.slug || live.name)) p = live;
  } catch (err) {}
  if (!p) p = getProduct(params.slug);
  if (!p) return {};

  return buildMetadata({
    title: `${p.name} — ${p.tagline} | DEZORYN TECHNOLOGY`,
    description: p.description,
    path: `/products/${p.slug}`,
    keywords: [
      p.name,
      p.category || "Enterprise SaaS",
      ...(Array.isArray(p.tags) ? p.tags : []),
      "DEZORYN SaaS Platform",
    ],
    openGraph: {
      type: "website",
      image: p.image || undefined,
    },
  });
}

export default async function Page({ params }) {
  let p = null;
  try {
    // Direct Axios call inside page
    const res = await api.get(`/api/v1/products/${params.slug}`);
    const live = res.data?.data || res.data?.product || res.data;
    if (live && (live.slug || live.name)) {
      p = {
        ...getProduct(params.slug),
        ...live,
      };
    }
  } catch (err) {
  }
  if (!p) p = getProduct(params.slug);
  if (!p) notFound();

  const softwareLd = generateSoftwareApplicationSchema(p);
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: p.name, url: `/products/${p.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetail product={p} />
    </>
  );
}
