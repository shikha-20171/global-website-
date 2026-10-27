"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { products, CATEGORIES, BUSINESS_SIZES, DEPLOYMENTS, industries, startingPrice } from "@/lib/data";
import { getLiveProducts } from "@/lib/api";

const PRICE = [["Any", [0, 1e9]], ["Under $35", [0, 34]], ["$35 – $45", [35, 45]], ["Over $45", [46, 1e9]]];

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-line bg-graphite px-3 text-sm outline-none focus:border-electric">
        <option value="">{label}</option>
        {options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    </label>
  );
}

export default function MarketplaceView() {
  const [liveProducts, setLiveProducts] = useState(products);
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [cat, setCat] = useState("All");
  const [f, setF] = useState({ industry: "", size: "", price: "", deployment: "" });
  const [toggles, setToggles] = useState({ ai: false, trial: false, cloud: false });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // [API IMPLEMENTATION] getLiveProducts() -> GET /api/v1/products
    getLiveProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Marketplace live data notice:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { const t = setTimeout(() => setDq(q.trim().toLowerCase()), 180); return () => clearTimeout(t); }, [q]);

  const list = useMemo(() => liveProducts.filter((p) => {
    const pCat = typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "") : (p.category || "");
    if (cat !== "All" && pCat !== cat) return false;
    if (f.industry && !p.industries.includes(f.industry)) return false;
    if (f.size && p.size !== f.size) return false;
    if (f.deployment && p.deployment !== f.deployment) return false;
    if (f.price) { const [lo, hi] = PRICE[+f.price][1]; const s = startingPrice(p); if (s < lo || s > hi) return false; }
    if (toggles.ai && !p.ai) return false;
    if (toggles.cloud && p.deployment === "On-premise") return false;
    if (dq && !`${p.name} ${p.description} ${pCat} ${Array.isArray(p.tags) ? p.tags.join(" ") : ""}`.toLowerCase().includes(dq)) return false;
    return true;
  }), [liveProducts, cat, f, toggles, dq]);

  const active = cat !== "All" || Object.values(f).some(Boolean) || Object.values(toggles).some(Boolean) || q;
  const reset = () => { setCat("All"); setF({ industry: "", size: "", price: "", deployment: "" }); setToggles({ ai: false, trial: false, cloud: false }); setQ(""); };
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const Toggle = ({ k, label }) => (
    <button onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))} aria-pressed={toggles[k]} className={`h-10 rounded-lg border px-3 text-sm transition ${toggles[k] ? "border-electric bg-electric/15 text-white" : "border-line text-cool hover:text-white"}`}>{label}</button>
  );

  return (
    <>
      <div className="relative mx-auto max-w-2xl group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-indigo-500/20 blur-lg opacity-40 group-hover:opacity-80 transition duration-500" />
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, solutions, industries, or keywords..."
            aria-label="Search marketplace"
            className="input h-14 rounded-xl pl-12 pr-12 text-base border-white/10 bg-[#070d1e]/90 backdrop-blur-xl focus:border-[#60a5fa] focus:ring-2 focus:ring-[#3b82f6]/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cool hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`relative shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
              cat === c
                ? "text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                : "text-cool hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {cat === c && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] border border-[#60a5fa]/50"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10">{c}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="mt-3 flex items-center gap-2 text-sm text-[#60a5fa] font-medium hover:text-white transition lg:hidden"
      >
        <SlidersHorizontal size={15} />
        <span>Filters &amp; Refinements</span>
      </button>
      <div className={`mt-3 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid ${filtersOpen ? "grid" : "hidden"} lg:grid-cols-8`}>
        <div className="col-span-1 lg:col-span-2"><Select label="Industry" value={f.industry} onChange={set("industry")} options={industries.map((i) => ({ v: i.slug, l: i.name }))} /></div>
        <Select label="Business Size" value={f.size} onChange={set("size")} options={BUSINESS_SIZES} />
        <Select label="Pricing" value={f.price} onChange={set("price")} options={PRICE.slice(1).map(([l], i) => ({ v: String(i + 1), l }))} />
        <Select label="Deployment" value={f.deployment} onChange={set("deployment")} options={DEPLOYMENTS} />
        <Toggle k="ai" label="AI Enabled" /><Toggle k="cloud" label="Cloud" /><Toggle k="trial" label="Free Trial" />
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-cool">
        <span aria-live="polite">{loading ? "Loading products…" : `${list.length} product${list.length === 1 ? "" : "s"}`}</span>
        {active && <button onClick={reset} className="text-electric hover:text-white">Reset filters</button>}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="card overflow-hidden p-2"><div className="skeleton h-36 rounded-lg" /><div className="space-y-3 p-4"><div className="skeleton h-5 w-1/2 rounded" /><div className="skeleton h-3 w-full rounded" /><div className="skeleton h-3 w-2/3 rounded" /><div className="skeleton h-10 w-full rounded" /></div></div>)}
        </div>
      ) : list.length === 0 ? (
        <div className="card mt-5 py-20 text-center"><p className="font-medium">No products match these filters.</p><p className="mt-1 text-sm text-cool">Remove a filter or search with a different keyword.</p><button onClick={reset} className="btn btn-secondary mt-5">Reset filters</button></div>
      ) : (
        <motion.div layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}</AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
