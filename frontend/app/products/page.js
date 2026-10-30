import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { products, formatPrice, startingPrice } from "@/lib/data";
import { ArrowUpRight, Check, Sparkles, Filter, Layers } from "lucide-react";
import api from "@/lib/axios";

import { buildMetadata, generateBreadcrumbSchema, generateItemListSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Enterprise SaaS Products & Cloud Software Catalog | DEZORYN TECHNOLOGY",
  description:
    "Explore DEZORYN's specialized enterprise SaaS platforms, multi-tenant cloud software, education ERPs, healthcare systems, and automated operations suites.",
  path: "/products",
  keywords: [
    "Enterprise SaaS Catalog",
    "School Management Software",
    "Healthcare ERP",
    "Real Estate CRM",
    "Society Management Platform",
    "Multi-Tenant Cloud Software",
    "DEZORYN Products",
  ],
});

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let liveProducts = products;
  try {
    // Direct Axios API call inside Products page
    const res = await api.get("/api/v1/products");
    const list = res.data?.data || res.data?.products || (Array.isArray(res.data) ? res.data : null);
    if (Array.isArray(list) && list.length > 0) {
      liveProducts = list;
    }
  } catch (err) {
    console.warn("Using baseline catalog due to API notice:", err?.message || err);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ]);

  const itemListSchema = generateItemListSchema(
    "DEZORYN Enterprise SaaS Products",
    liveProducts.map((p) => ({
      name: p.name,
      url: `/products/${p.slug}`,
    })),
    "/products"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-32 pb-16 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[100px]" />

        <div className="container-x relative">
          <div className="max-w-5xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#1e40af]/30 px-3.5 py-1 text-xs font-mono text-[#bfdbfe] shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
              <span>SAAS PRODUCT ECOSYSTEM</span>
            </div>

            <h1 className="h-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white break-words">
              Software Built to Solve{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
                Real Business
              </span>{" "}
              Problems.
            </h1>

            <p className="lead mt-5 text-base sm:text-lg text-cool max-w-3xl leading-relaxed">
              Explore our comprehensive portfolio of specialized software platforms designed to streamline operations, eliminate administrative friction, and scale modern organizations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/marketplace" arrow>
                Explore SaaS Marketplace
              </Button>
              <Button href="/compare" variant="secondary" arrow>
                Compare Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SAAS ARCHITECTURE & ECOSYSTEM TAXONOMY ─── */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Underlying Platform Architecture
            </span>
            <h2 className="h-section mt-1">
              Every SaaS Engine Shares Four Core Architectural Benchmarks
            </h2>
            <p className="lead mt-3 text-cool">
              Rather than disjointed point solutions, DEZORYN SaaS products are engineered on a standardized high-throughput foundation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "ShieldCheck",
                title: "Tenant Schema Isolation",
                desc: "PostgreSQL row-level security and schema-per-tenant isolation prevent cross-tenant data leaks by design.",
                badge: "Data Security",
              },
              {
                icon: "Zap",
                title: "Instant Sandbox Provisioning",
                desc: "Spin up a live, fully configured organization workspace in under 60 seconds with zero manual database setup.",
                badge: "Zero-Latency Setup",
              },
              {
                icon: "Code2",
                title: "OpenAPI v3 & Webhook Events",
                desc: "Every product exposes standardized RESTful endpoints and cryptographically signed HMAC-SHA256 webhooks.",
                badge: "Interoperability",
              },
              {
                icon: "Layers",
                title: "Modular Feature Tiers",
                desc: "Scale smoothly from Starter to Enterprise tiers with automated USD billing and dynamic role hierarchies.",
                badge: "Seamless Scale",
              },
            ].map((arch, idx) => (
              <div
                key={arch.title}
                className="group card card-hover relative flex flex-col justify-between p-6 border-white/10 bg-[#070b16]/95 transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_20px_45px_rgba(56,189,248,0.2)] hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Top Glowing Laser Border Beam */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_#38bdf8]" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="tag text-[10px] font-mono text-sky-400 border-sky-400/30 bg-sky-500/10">
                      {arch.badge}
                    </span>
                    <span className="text-xs font-mono text-white/30 group-hover:text-sky-400/70 transition-colors">0{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {arch.title}
                  </h3>
                  <p className="mt-2 text-xs text-cool leading-relaxed">
                    {arch.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALL PRODUCTS GRID ─── */}
      <section className="section bg-midnight/50">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-line pb-6">
            <div>
              <span className="text-xs font-mono text-[#93c5fd] uppercase tracking-wider">
                Full Software Directory
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                All Available SaaS Platforms ({liveProducts.length})
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#93c5fd] hover:text-white transition"
              >
                <Layers size={14} />
                <span>Product Comparison Matrix →</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveProducts.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 0.04}>
                <ProductCard product={p} index={idx} compare={true} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <CTASection
        title="Ready to Transform Your Business?"
        text="Discuss your organizational requirements with our technology specialists or start a free trial with zero setup latency."
        primary={["Talk to an Expert", "/contact"]}
        secondary={["Explore Marketplace", "/marketplace"]}
      />
    </>
  );
}
