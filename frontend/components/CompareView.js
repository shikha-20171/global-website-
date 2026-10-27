"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Minus,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  Layers,
  HelpCircle,
  ShieldCheck,
  Zap,
  Globe2,
} from "lucide-react";
import { useCompare } from "@/components/CompareContext";
import { products, getProduct, formatPrice, startingPrice } from "@/lib/data";
import { getLiveProducts, getLiveComparisonMatrix } from "@/lib/api";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";

const PRESETS = [
  {
    name: "Campus & Education ERPs",
    slugs: ["schooly-core", "coaching-master", "college-master"],
    badge: "Most Popular",
  },
  {
    name: "Enterprise Operations & Governance",
    slugs: ["hrms", "society-management", "legal-docs"],
    badge: "Operations",
  },
  {
    name: "Revenue, CRM & Outreach",
    slugs: ["crm", "super-whatsapp", "real-estate"],
    badge: "Growth",
  },
];

const compareFaqs = [
  [
    "How do we migrate from legacy systems to a DEZORYN platform?",
    "Every deployment includes structured data ingestion pipelines for student, patient, or ledger records. Our technical architects assist with schema mapping and staging sandbox validation.",
  ],
  [
    "Can multiple DEZORYN products be bundled together for our organization?",
    "Yes. Enterprises combining multiple products (for instance, Schooly Core + Super WhatsApp + CRM) receive consolidated billing, shared SSO identity, and cross-platform webhooks.",
  ],
  [
    "Are all compared features available during the 14-day evaluation sandbox?",
    "Yes. Evaluation sandboxes grant full enterprise-tier access so your stakeholders can rigorously test real-world workflows, user permissions, and API endpoints before commercial deployment.",
  ],
];

export default function CompareView() {
  const { ids, toggle, clear } = useCompare();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [liveCatalog, setLiveCatalog] = useState(products);
  const [matrixData, setMatrixData] = useState(null);

  useEffect(() => {
    let mounted = true;
    // [API IMPLEMENTATION] getLiveProducts() -> GET /api/v1/products
    getLiveProducts()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setLiveCatalog(data);
        }
      })
      .catch((err) => {
        console.warn("Compare live catalog notice:", err.message);
      });

    // [API IMPLEMENTATION] getLiveComparisonMatrix() -> GET /api/v1/products/compare
    getLiveComparisonMatrix()
      .then((matrix) => {
        if (mounted && matrix) {
          setMatrixData(matrix);
        }
      })
      .catch((err) => {
        console.warn("Compare live matrix notice:", err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Default to first preset if user hasn't selected at least 2 products
  const activeIds = useMemo(() => {
    if (ids.length >= 2) return ids;
    return PRESETS[0].slugs;
  }, [ids]);

  const list = useMemo(() => {
    return activeIds
      .map((slug) => liveCatalog.find((p) => p.slug === slug) || getProduct(slug))
      .filter(Boolean);
  }, [activeIds, liveCatalog]);

  const applyPreset = (presetSlugs) => {
    clear();
    presetSlugs.forEach((s) => toggle(s));
  };

  const availableToAdd = liveCatalog.filter(
    (p) =>
      !activeIds.includes(p.slug) &&
      (!searchFilter ||
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (typeof p.category === "object" && p.category !== null
          ? p.category.name || p.category.slug || ""
          : p.category || ""
        )
          .toLowerCase()
          .includes(searchFilter.toLowerCase()))
  );

  const rows = [
    {
      group: "Overview & Economics",
      items: [
        ["Category", (p) => <span className="tag text-xs font-mono">{typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "General") : (p.category || "General")}</span>],
        [
          "Starting Price",
          (p) => (
            <div className="font-mono">
              <span className="text-base font-bold text-white">{formatPrice(startingPrice(p))}</span>
              <span className="text-xs text-cool"> / month</span>
            </div>
          ),
        ],
        ["Target Organization", (p) => <span className="text-xs text-cool">{p.size} Enterprise</span>],
        ["Deployment Model", (p) => <span className="text-xs text-cool">{p.deployment} Cloud Multi-Tenant</span>],
      ],
    },
    {
      group: "Intelligence & Capabilities",
      items: [
        [
          "AI Intent & Automation",
          (p) =>
            p.ai ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Check size={16} className="text-emerald-400" />
                <span>Autonomous Workflows</span>
              </div>
            ) : (
              <Minus size={16} className="text-cool/40" />
            ),
        ],
        [
          "Analytics & Reporting",
          (p) =>
            p.modules && (p.modules.includes("Analytics") || p.modules.includes("Reports") || p.features?.some(([n]) => /insight|report|analytic/i.test(n))) ? (
              <div className="flex items-center gap-1.5 text-xs text-white">
                <Check size={16} className="text-electric" />
                <span>Executive Dashboards</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-white">
                <Check size={16} className="text-electric" />
                <span>Standard Reports</span>
              </div>
            ),
        ],
        [
          "Mobile Apps (iOS & Android)",
          (p) =>
            p.features && p.features.some(([n]) => /app|mobile/i.test(n)) ? (
              <div className="flex items-center gap-1.5 text-xs text-white">
                <Check size={16} className="text-electric" />
                <span>Native PWA &amp; Store Apps</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-cool">
                <Check size={16} className="text-electric/70" />
                <span>Responsive Web App</span>
              </div>
            ),
        ],
        [
          "RESTful APIs & Webhooks",
          () => (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check size={16} className="text-emerald-400" />
              <span>Full v1 OpenAPI Support</span>
            </div>
          ),
        ],
        [
          "Key Built-In Modules",
          (p) => (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {p.modules?.slice(0, 4).map((m) => (
                <span key={m} className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] text-cool">
                  {m}
                </span>
              ))}
            </div>
          ),
        ],
        [
          "Ecosystem Integrations",
          (p) => (
            <div className="text-xs text-cool/90">
              {p.integrations?.join(", ") || "Stripe, Slack, Google Cloud"}
            </div>
          ),
        ],
      ],
    },
    {
      group: "Security & Service Level",
      items: [
        [
          "Multi-Tenant Isolation",
          () => (
            <div className="flex items-center gap-1.5 text-xs text-white font-mono">
              <ShieldCheck size={15} className="text-electric" />
              <span>Logical Schema Guarded</span>
            </div>
          ),
        ],
        [
          "SLA & High Availability",
          () => (
            <div className="flex items-center gap-1.5 text-xs text-cool">
              <Zap size={14} className="text-amber-400" />
              <span>99.9% Uptime Commitment</span>
            </div>
          ),
        ],
      ],
    },
  ];

  return (
    <section className="pb-28 pt-32">
      <div className="container-x">
        <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Compare" }]} />

        {/* ─── HEADER ─── */}
        <div className="max-w-3xl mt-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-[#9db8ff] shadow-sm shadow-electric/10">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <Layers size={13} className="text-electric" />
            <span>PRODUCT ARCHITECTURE &amp; FEATURE MATRIX</span>
          </div>
          <h1 className="h-display text-4xl sm:text-6xl text-white">
            Compare Enterprise Platforms
          </h1>
          <p className="lead mt-4 text-cool">
            Evaluate DEZORYN cloud software side-by-side. Inspect multi-tenant architecture, pricing tiers, built-in AI modules, and integration capabilities.
          </p>
        </div>

        {/* ─── PRESET SWITCHERS ─── */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-white/10 py-5">
          <span className="text-xs font-mono text-cool mr-2">Featured Comparison Presets:</span>
          {PRESETS.map((pr) => (
            <button
              key={pr.name}
              onClick={() => applyPreset(pr.slugs)}
              className="group rounded-lg border border-white/15 bg-graphite/70 px-3.5 py-2 text-xs font-medium text-white transition duration-200 hover:border-electric/50 hover:bg-graphite hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{pr.name}</span>
              <span className="rounded bg-electric/20 px-1.5 py-0.5 text-[10px] font-mono text-[#9db8ff]">
                {pr.badge}
              </span>
            </button>
          ))}

          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-electric/40 bg-electric/10 px-3.5 py-2 text-xs font-medium text-electric transition hover:bg-electric hover:text-white"
          >
            <Plus size={14} />
            <span>Add Products ({list.length}/4)</span>
          </button>
        </div>

        {/* ─── PRODUCT SELECTOR POPDOWN ─── */}
        {selectorOpen && (
          <div className="my-6 rounded-xl border border-electric/30 bg-[#070b16] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <h3 className="text-sm font-bold text-white">Select Products to Add to Comparison</h3>
                <p className="text-xs text-cool mt-0.5">Click any product to add it to your current comparison matrix.</p>
              </div>
              <button
                onClick={() => setSelectorOpen(false)}
                className="text-cool hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter products by name or industry..."
                className="h-9 w-full max-w-sm rounded-lg border border-line bg-graphite/80 px-3 text-xs text-white placeholder:text-cool/60 outline-none focus:border-electric"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-60 overflow-y-auto pr-2">
              {availableToAdd.map((prod) => (
                <button
                  key={prod.slug}
                  onClick={() => {
                    toggle(prod.slug);
                    if (list.length >= 3) setSelectorOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-graphite/40 p-2.5 text-left transition hover:border-electric hover:bg-graphite"
                >
                  <img
                    src={prod.image || "/products/schooly-core.jpg"}
                    alt={prod.name}
                    className="h-10 w-10 rounded object-cover border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{prod.name}</div>
                    <div className="text-[10px] text-cool truncate">{typeof prod.category === "object" && prod.category !== null ? (prod.category.name || prod.category.slug || "General") : (prod.category || "General")} · {formatPrice(startingPrice(prod))}/mo</div>
                  </div>
                  <Plus size={14} className="text-electric" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── COMPARISON MATRIX TABLE ─── */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#070b16] shadow-2xl">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            {/* Header with Product Cards */}
            <thead>
              <tr className="border-b border-white/10 bg-graphite/60">
                <th className="p-6 text-left align-top w-64">
                  <span className="text-xs font-mono text-cool uppercase tracking-wider block">
                    Product Architecture
                  </span>
                  <div className="text-lg font-bold text-white mt-1">Feature Breakdown</div>
                  <p className="text-xs text-cool mt-1 leading-relaxed">
                    Showing {list.length} platforms side-by-side.
                  </p>
                </th>

                {list.map((p) => (
                  <th key={p.slug} className="p-6 text-left align-top border-l border-white/10 w-72">
                    <div className="relative overflow-hidden rounded-lg mb-3 border border-white/10 bg-midnight">
                      <img
                        src={p.image || "/products/schooly-core.jpg"}
                        alt={p.name}
                        className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 tag bg-midnight/90 backdrop-blur-md text-[9px] font-mono border border-white/10">
                        {typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "General") : (p.category || "General")}
                      </span>
                    </div>

                    <div className="font-bold text-base text-white">{p.name}</div>
                    <p className="text-xs text-cool mt-1 line-clamp-2 font-normal leading-relaxed">
                      {p.tagline}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-electric hover:underline"
                      >
                        <span>Full Specs</span>
                        <ArrowRight size={12} />
                      </Link>
                      <button
                        onClick={() => toggle(p.slug)}
                        className="text-xs text-cool hover:text-red-400 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body Groups */}
            <tbody>
              {rows.map((group, gIdx) => (
                <tbody key={group.group}>
                  <tr className="bg-white/[0.02] border-t border-white/10">
                    <td
                      colSpan={list.length + 1}
                      className="px-6 py-2.5 text-xs font-mono text-electric font-semibold uppercase tracking-wider"
                    >
                      {group.group}
                    </td>
                  </tr>

                  {group.items.map(([label, renderFn], rIdx) => (
                    <tr
                      key={label}
                      className="border-t border-white/5 transition hover:bg-white/[0.015]"
                    >
                      <td className="p-5 text-xs font-medium text-cool border-r border-white/5">
                        {label}
                      </td>
                      {list.map((p) => (
                        <td key={p.slug} className="p-5 border-r border-white/5 last:border-r-0">
                          {renderFn(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}

              {/* Bottom Action Row */}
              <tr className="border-t border-white/10 bg-graphite/40">
                <td className="p-6 text-xs text-cool">Action / Deployment</td>
                {list.map((p) => (
                  <td key={p.slug} className="p-6 border-l border-white/10">
                    <Link
                      href={`/start-trial?product=${p.slug}`}
                      className="btn btn-primary w-full text-xs shadow-md shadow-electric/25"
                    >
                      Start Free Trial
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── BUYER'S FAQ ─── */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Procurement &amp; Evaluation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Software Evaluation FAQ
            </h2>
          </div>
          <FAQ items={compareFaqs} />
        </div>
      </div>
    </section>
  );
}
