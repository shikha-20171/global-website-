"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus, ArrowRight, Sparkles } from "lucide-react";
import ProductArt from "./ProductArt";
import { useCompare, MAX_COMPARE } from "./CompareContext";
import { formatPrice, startingPrice } from "@/lib/data";

export default function ProductCard({ product, p: propP, compare = true, index = 0 }) {
  const p = product || propP;
  if (!p) return null;
  const { ids, toggle } = useCompare();
  const on = ids.includes(p.slug);
  const full = !on && ids.length >= MAX_COMPARE;
  const catName =
    typeof p.category === "object" && p.category !== null
      ? p.category.name || p.category.slug || "Enterprise"
      : p.category || "Enterprise";

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.35) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card card-hover group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(59,130,246,0.22)] border border-white/10 hover:border-sky-400/50 bg-[#060a19]/90"
    >
      {/* Top Animated Laser Beam on Card */}
      <div
        className={`absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 transition-opacity duration-300 ${
          isHovered ? "opacity-100 shadow-[0_0_15px_#38bdf8]" : "opacity-0"
        }`}
      />

      {/* Ambient Radial Corner Flare */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-sky-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-20" />

      <div className="flex h-full flex-col">
        <Link href={`/products/${p.slug}`} className="block p-2 pb-0" aria-label={`${p.name} product page`}>
          {p.image ? (
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1b]">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060a19] via-black/30 to-transparent" />

              {/* Cyber Radar Scanline on Image */}
              <div className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-cyber-scan" />

              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
                <span className="rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10.5px] font-medium text-white/95 backdrop-blur-md shadow-sm">
                  {catName}
                </span>
                {p.ai && (
                  <span className="rounded-full border border-sky-400/40 bg-sky-500/20 px-2.5 py-0.5 text-[10.5px] font-medium text-sky-200 backdrop-blur-md shadow-sm flex items-center gap-1">
                    <Sparkles size={10} className="text-sky-300" />
                    <span>AI</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <ProductArt hue={p.hue} variant={index} compact className="h-36 transition duration-500 group-hover:scale-[1.02]" />
          )}
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-sky-300">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-cool line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <span className="tag text-[11px] bg-white/[0.04] border-white/10">{catName}</span>
            <span className="tag text-[11px] bg-white/[0.04] border-white/10">{p.deployment === "Cloud" ? "Cloud SaaS" : p.deployment}</span>
            {p.ai && <span className="tag text-[11px] border-sky-400/40 bg-sky-500/10 text-sky-300">AI Powered</span>}
          </div>

          <div className="mt-auto pt-5 border-t border-white/5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-cool">Starting at</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#60a5fa] transition-colors">
                {formatPrice(startingPrice(p))}
              </span>
              <span className="text-xs text-cool font-mono">/month</span>
            </div>

            <div className="mt-4">
              <Link
                href={`/products/${p.slug}`}
                className="btn btn-secondary w-full h-10 flex items-center justify-center font-medium group-hover:border-[#60a5fa] group-hover:bg-blue-600/20 transition-all gap-1.5 text-sm"
              >
                <span>View Product</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {compare && (
              <button
                onClick={() => toggle(p.slug)}
                disabled={full}
                aria-pressed={on}
                className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs transition duration-200 ${
                  on
                    ? "bg-blue-600/20 text-[#93c5fd] border border-blue-500/40 font-medium"
                    : "text-cool hover:text-white hover:bg-white/[0.03]"
                } disabled:opacity-40`}
              >
                {on ? <Check size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                {on ? "Added to compare" : full ? `Compare limit is ${MAX_COMPARE}` : "Add to compare"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

