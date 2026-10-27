"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { products, industries, projects, posts } from "@/lib/data";

const INDEX = [
  ...products.map((p) => {
    const pCat = typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "") : (p.category || "");
    const pTags = Array.isArray(p.tags) ? p.tags.join(" ") : "";
    return { type: "Product", title: p.name, sub: p.description, href: `/products/${p.slug}`, k: `${p.name} ${pCat} ${pTags}` };
  }),
  ...industries.map((i) => ({ type: "Industry", title: i.name, sub: i.short, href: `/industries/${i.slug}`, k: i.name + i.short })),
  ...[
    ["Enterprise Solutions", "/solutions/enterprise"],
    ["AI Solutions", "/solutions/ai"],
    ["Automation", "/solutions/automation"],
    ["Custom Software", "/solutions/custom-software"],
    ["Digital Transformation", "/solutions/digital-transformation"],
    ["Cloud Infrastructure", "/solutions/cloud"],
    ["Mobile Solutions", "/solutions/mobile"],
  ].map(([title, href]) => ({ type: "Solution", title, sub: "Enterprise solutions", href, k: title })),
  ...projects.map((p) => ({ type: "Project", title: p.name, sub: p.industry, href: `/case-studies/${p.slug}`, k: `${p.name} ${p.industry} ${p.type}` })),
  ...posts.map((p) => ({ type: "Blog", title: p.title, sub: p.cat, href: `/blog/${p.slug}`, k: p.title + p.cat })),
];

export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const input = useRef(null);

  // debounce
  useEffect(() => { const t = setTimeout(() => setDq(q.trim().toLowerCase()), 150); return () => clearTimeout(t); }, [q]);
  useEffect(() => { if (open) { setQ(""); setDq(""); setActive(0); setTimeout(() => input.current?.focus(), 50); } }, [open]);
  const results = useMemo(() => (dq ? INDEX.filter((r) => r.k.toLowerCase().includes(dq)).slice(0, 8) : INDEX.slice(0, 6)), [dq]);
  useEffect(() => setActive(0), [dq]);

  const go = (r) => { onClose(); router.push(r.href); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) go(results[active]);
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
          <motion.div initial={{ y: -16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, opacity: 0 }} className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-graphite shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="text-cool" />
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search products, solutions, industries..." className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-cool/70" aria-label="Search" />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-cool">ESC</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-cool">No results for “{q}”. Try a product, industry or solution name.</li>}
              {results.map((r, i) => (
                <li key={r.href + r.title}>
                  <button onMouseEnter={() => setActive(i)} onClick={() => go(r)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? "bg-electric/15" : ""}`}>
                    <span className="min-w-0"><span className="block truncate text-sm font-medium">{r.title}</span><span className="block truncate text-xs text-cool">{r.sub}</span></span>
                    <span className="flex shrink-0 items-center gap-2"><span className="tag">{r.type}</span>{i === active && <CornerDownLeft size={14} className="text-cool" />}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
