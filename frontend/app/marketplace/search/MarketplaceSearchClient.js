"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CTASection from "@/components/CTASection";
import { Search, Filter, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { products, CATEGORIES, BUSINESS_SIZES, DEPLOYMENTS } from "@/lib/data";
import { getLiveProducts } from "@/lib/api";

function SearchContent() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [cat, setCat] = useState(sp.get("category") || "All");
  const [size, setSize] = useState("All");
  const [deploy, setDeploy] = useState("All");
  const [liveProducts, setLiveProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Fetch products
    getLiveProducts()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setLiveProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Search live products notice:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = liveProducts.filter((p) => {
    const pCat =
      typeof p.category === "object" && p.category !== null
        ? p.category.name || p.category.slug || ""
        : p.category || "";
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(q.toLowerCase())) ||
      (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())));
    const matchCat = cat === "All" || pCat.toLowerCase() === cat.toLowerCase();
    const matchSize = size === "All" || p.size === size;
    const matchDeploy = deploy === "All" || p.deployment === deploy;
    return matchQ && matchCat && matchSize && matchDeploy;
  });

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Marketplace", href: "/marketplace" },
              { label: "Search & Discover" },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <h1 className="h-display text-3xl sm:text-5xl font-bold text-white">
              Search the SaaS Marketplace
            </h1>
            <p className="lead mt-3 text-sm sm:text-base text-cool">
              Filter through verified multi-tenant cloud software platforms by industry domain, deployment mode, and organizational size.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="mt-8 relative max-w-2xl">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keyword, product name, or capability (e.g., student roster, hospital EHR, payroll)..."
              className="w-full rounded-xl border border-line bg-midnight/90 pl-11 pr-4 py-3.5 text-sm text-white placeholder-cool/60 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric shadow-lg"
            />
            <Search size={18} className="pointer-events-none absolute left-4 top-4 text-cool" />
          </div>

          {/* Filter Matrix */}
          <div className="mt-6 flex flex-wrap gap-4 items-center text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-cool/70 font-mono">Category:</span>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="rounded-lg border border-line bg-midnight px-2.5 py-1.5 text-xs text-white focus:border-electric focus:outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Business Size */}
            <div className="flex items-center gap-1.5">
              <span className="text-cool/70 font-mono">Organization Size:</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="rounded-lg border border-line bg-midnight px-2.5 py-1.5 text-xs text-white focus:border-electric focus:outline-none"
              >
                <option value="All">All Sizes</option>
                {BUSINESS_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Deployment Mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-cool/70 font-mono">Deployment:</span>
              <select
                value={deploy}
                onChange={(e) => setDeploy(e.target.value)}
                className="rounded-lg border border-line bg-midnight px-2.5 py-1.5 text-xs text-white focus:border-electric focus:outline-none"
              >
                <option value="All">All Hosting Modes</option>
                {DEPLOYMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {(q || cat !== "All" || size !== "All" || deploy !== "All") && (
              <button
                onClick={() => { setQ(""); setCat("All"); setSize("All"); setDeploy("All"); }}
                className="text-electric hover:underline font-mono text-xs ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="section">
        <div className="container-x">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-mono text-cool">
              Found <span className="text-white font-bold">{filtered.length}</span> verified software platforms
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((prod) => (
                <ProductCard key={prod.slug} product={prod} />
              ))}
            </div>
          ) : (
            <div className="card py-16 text-center text-cool">
              <p className="text-base text-white">No products matched your exact filter query.</p>
              <p className="text-xs text-cool mt-1">Try broadening your search term or clearing filters.</p>
              <button
                onClick={() => { setQ(""); setCat("All"); setSize("All"); setDeploy("All"); }}
                className="btn btn-secondary mt-4 h-9 px-4 text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Can't Find Your Exact Software Requirement?"
        text="Our solutions team can configure custom modular feature packs or engineer bespoke workflow extensions for your organization."
        primary={["Discuss Custom SaaS Needs", "/contact-sales"]}
        secondary={["Compare All Products", "/compare"]}
      />
    </>
  );
}

export default function MarketplaceSearchClient() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 container-x text-cool">Loading search engine...</div>}>
      <SearchContent />
    </Suspense>
  );
}
