"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  X,
  Layers,
  Sparkles,
  Building2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { products, industries, projects, posts } from "@/lib/data";

export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [active, setActive] = useState(0);
  const [liveProducts, setLiveProducts] = useState(products);
  const router = useRouter();
  const inputRef = useRef(null);

  // Fetch fresh products from live backend / Neon DB
  useEffect(() => {
    if (!open) return;
    fetch("/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data || data?.products;
        if (Array.isArray(list) && list.length > 0) {
          setLiveProducts(list);
        }
      })
      .catch(() => {});
  }, [open]);

  // Construct comprehensive search index
  const index = useMemo(() => {
    const list = [];

    // Products
    liveProducts.forEach((p) => {
      const cat = typeof p.category === "object" && p.category !== null
        ? p.category.name || p.category.slug || "Enterprise"
        : p.category || "Enterprise";
      const tags = Array.isArray(p.tags) ? p.tags.join(" ") : "";
      const priceText = p.startingPrice ? `Starting at $${p.startingPrice}/mo` : "Custom pricing";
      list.push({
        type: "Product",
        category: "Products",
        title: p.name,
        sub: p.tagline || p.description || cat,
        meta: priceText,
        href: `/products/${p.slug}`,
        k: `${p.name} ${cat} ${tags} ${p.tagline || ""} ${p.description || ""}`.toLowerCase(),
      });
    });

    // Solutions
    const solutions = [
      ["Enterprise Architecture", "Multi-tenant cloud infrastructure and high-availability stacks", "/solutions/enterprise"],
      ["AI & Machine Learning", "Predictive modeling, autonomous workflows, and LLM orchestration", "/solutions/ai"],
      ["Workflow Automation", "Zero-code trigger automations, webhooks, and process bots", "/solutions/automation"],
      ["Custom Software Development", "Tailored SaaS development for specialized verticals", "/solutions/custom-software"],
      ["Digital Transformation", "Legacy modernization, data ingestion pipelines, and ERP migration", "/solutions/digital-transformation"],
      ["Cloud Infrastructure", "Private cloud VPCs, database isolation, and global edge CDNs", "/solutions/cloud"],
      ["Mobile Applications", "Native iOS and Android client applications with offline sync", "/solutions/mobile"],
    ];
    solutions.forEach(([title, sub, href]) => {
      list.push({
        type: "Solution",
        category: "Solutions",
        title,
        sub,
        meta: "Enterprise Solution",
        href,
        k: `${title} ${sub} solutions`.toLowerCase(),
      });
    });

    // Industries
    industries.forEach((i) => {
      list.push({
        type: "Industry",
        category: "Industries",
        title: `${i.name} Industry Cloud`,
        sub: i.short || i.problem?.slice(0, 90) || "Industry vertical platform",
        meta: "Specialized Industry",
        href: `/industries/${i.slug}`,
        k: `${i.name} ${i.short || ""} industry`.toLowerCase(),
      });
    });

    // Pricing & Navigation Shortcuts
    list.push({
      type: "Page",
      category: "Solutions",
      title: "Commercial Pricing & Plans",
      sub: "Transparent monthly & annual subscription plans with 20% discount",
      meta: "Billing Matrix",
      href: "/pricing",
      k: "pricing plans cost monthly annual starter enterprise",
    });
    list.push({
      type: "Page",
      category: "Solutions",
      title: "Feature Comparison Matrix",
      sub: "Compare all DEZORYN cloud software products side-by-side",
      meta: "Comparison",
      href: "/compare",
      k: "compare matrix side by side features specifications",
    });
    list.push({
      type: "Page",
      category: "Solutions",
      title: "Request Live Enterprise Demo",
      sub: "Schedule an interactive 30-minute sandbox walkthrough with our solution engineers",
      meta: "Evaluation",
      href: "/demo",
      k: "demo schedule book live presentation walk through",
    });

    // Blog & Insights
    posts.forEach((p) => {
      list.push({
        type: "Article",
        category: "Articles",
        title: p.title,
        sub: p.snippet || p.cat || "Engineering & Cloud Insights",
        meta: p.cat || "Article",
        href: `/blog/${p.slug}`,
        k: `${p.title} ${p.cat || ""} blog article insights`.toLowerCase(),
      });
    });

    // Case Studies
    projects.forEach((pr) => {
      list.push({
        type: "Case Study",
        category: "Articles",
        title: `${pr.name} Case Study`,
        sub: `Client success in ${pr.industry} — ${pr.metrics?.[0]?.value || "99.9% uptime"}`,
        meta: "Customer Success",
        href: `/case-studies/${pr.slug}`,
        k: `${pr.name} ${pr.industry} ${pr.type} case study client`.toLowerCase(),
      });
    });

    return list;
  }, [liveProducts]);

  // Debounced query string
  useEffect(() => {
    const t = setTimeout(() => setDq(q.trim().toLowerCase()), 120);
    return () => clearTimeout(t);
  }, [q]);

  // Focus on open
  useEffect(() => {
    if (open) {
      setQ("");
      setDq("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filtered search results
  const results = useMemo(() => {
    if (!dq) return [];
    const terms = dq.split(/\s+/).filter(Boolean);
    return index
      .filter((item) => terms.every((t) => item.k.includes(t)))
      .slice(0, 10);
  }, [index, dq]);

  useEffect(() => {
    setActive(0);
  }, [dq]);

  const handleSelect = (r) => {
    onClose();
    router.push(r.href);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((prev) => Math.min(prev + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      handleSelect(results[active]);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "Product":
        return "border-sky-500/30 bg-sky-500/10 text-sky-300";
      case "Solution":
        return "border-purple-500/30 bg-purple-500/10 text-purple-300";
      case "Industry":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "Article":
      case "Case Study":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      default:
        return "border-white/10 bg-white/5 text-slate-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Product":
        return <Layers size={15} className="text-sky-400" />;
      case "Solution":
        return <Sparkles size={15} className="text-purple-400" />;
      case "Industry":
        return <Building2 size={15} className="text-amber-400" />;
      default:
        return <BookOpen size={15} className="text-emerald-400" />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 p-3 pt-[8vh] sm:p-4 sm:pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search DEZORYN platform"
        >
          <motion.div
            initial={{ y: -16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#090e1d] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(56,189,248,0.12)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search Input Bar */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#070b17]">
              <Search size={20} className="text-sky-400 shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, solutions, industries, pricing..."
                className="h-10 flex-1 bg-transparent text-[15px] sm:text-base text-white outline-none placeholder:text-slate-400 font-normal"
                aria-label="Search query"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/10 transition"
                  aria-label="Clear input"
                >
                  <X size={15} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            {dq ? (
              <div className="max-h-[58vh] overflow-y-auto p-2 divide-y divide-white/[0.03]">
                {results.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Search size={24} className="mx-auto text-slate-500 mb-2 opacity-50" />
                    <p className="text-sm font-medium text-white">No results found for “{q}”</p>
                  </div>
                ) : (
                  results.map((r, i) => {
                    const isCurrent = i === active;
                    return (
                      <button
                        key={r.href + r.title}
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => handleSelect(r)}
                        className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition cursor-pointer ${
                          isCurrent
                            ? "bg-white/[0.08] border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                            : "hover:bg-white/[0.04] border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`mt-0.5 rounded-lg p-2 border shrink-0 transition ${
                              isCurrent
                                ? "bg-sky-500/20 border-sky-400/40"
                                : "bg-white/[0.04] border-white/10"
                            }`}
                          >
                            {getTypeIcon(r.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                                {r.title}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 ${getTypeBadge(
                                  r.type
                                )}`}
                              >
                                {r.type}
                              </span>
                            </div>
                            <p className="truncate text-xs text-slate-400 mt-0.5 leading-relaxed">
                              {r.sub}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {r.meta && (
                            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                              {r.meta}
                            </span>
                          )}
                          {isCurrent ? (
                            <span className="flex items-center gap-1 rounded bg-sky-500/20 border border-sky-400/30 px-1.5 py-0.5 text-[11px] font-mono text-sky-200">
                              <span>Open</span>
                              <CornerDownLeft size={12} />
                            </span>
                          ) : (
                            <ArrowRight
                              size={14}
                              className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
