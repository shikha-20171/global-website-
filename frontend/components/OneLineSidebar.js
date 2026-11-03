"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Sparkles,
  Building2,
  DollarSign,
  GitCompare,
  Compass,
  Calendar,
  Search,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    tooltip: "Home Overview",
    exact: true,
  },
  {
    label: "Products",
    href: "/products",
    icon: Layers,
    tooltip: "Products Catalog",
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: Sparkles,
    tooltip: "Enterprise Solutions",
  },
  {
    label: "Industries",
    href: "/industries",
    icon: Building2,
    tooltip: "Industry Clouds",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: Compass,
    tooltip: "SaaS Marketplace",
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: DollarSign,
    tooltip: "Commercial Pricing",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: GitCompare,
    tooltip: "Feature Comparison",
  },
];

const ACTION_ITEMS = [
  {
    label: "Book Demo",
    href: "/demo",
    icon: Calendar,
    tooltip: "Request Live Demo",
    highlight: true,
  },
  {
    label: "Support / Contact",
    href: "/contact-sales",
    icon: Headphones,
    tooltip: "Enterprise Sales & Support",
  },
];

export default function OneLineSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("dezoryn_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (_) {}
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("dezoryn_sidebar_collapsed", String(next));
    } catch (_) {}
  };

  const openSearchPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-search"));
    }
  };

  // Don't render on admin dashboard routes
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  return (
    <aside
      aria-label="Quick Navigation Sidebar"
      className={`fixed left-3.5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center transition-all duration-300 ${
        collapsed ? "w-10 opacity-80 hover:opacity-100" : "w-[52px]"
      }`}
    >
      <div className="relative flex flex-col items-center rounded-2xl border border-white/10 bg-[#060a19]/90 py-3 px-1.5 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.08)] hover:border-sky-400/40 transition-colors">
        {/* Top Logo Glyph */}
        <Link
          href="/"
          className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-400/50 hover:bg-sky-500/10 transition"
          aria-label="DEZORYN Home"
        >
          <img
            src="/logo.png"
            alt="DEZORYN"
            className="h-5 w-5 rounded object-cover transition-transform group-hover:scale-110"
          />
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-white/15 bg-[#0b1329] px-2.5 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all z-50">
            DEZORYN TECHNOLOGY
          </span>
        </Link>

        {/* Divider */}
        <div className="my-2 h-[1px] w-6 bg-white/10" />

        {/* Primary Navigation Icons (One Line Vertical Rail) */}
        <nav className="flex flex-col items-center gap-1.5" aria-label="Sidebar Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  active
                    ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.07] border border-transparent"
                }`}
                aria-label={item.label}
              >
                {/* Active Left Indicator Dot */}
                {active && (
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3.5 w-1 rounded-r-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}

                <Icon size={17} className="transition-transform group-hover:scale-110" />

                {/* Floating Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-lg border border-white/15 bg-[#0b1329] px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all z-50">
                  <span>{item.tooltip}</span>
                  {active && (
                    <span className="rounded bg-sky-400/20 text-sky-300 px-1 py-0.2 text-[9px] font-mono">
                      Active
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-2 h-[1px] w-6 bg-white/10" />

        {/* Quick Search Palette Trigger */}
        <button
          type="button"
          onClick={openSearchPalette}
          className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 hover:border hover:border-sky-400/30 transition cursor-pointer"
          aria-label="Quick Search (Ctrl K)"
        >
          <Search size={16} className="transition-transform group-hover:scale-110" />
          <span className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-lg border border-white/15 bg-[#0b1329] px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all z-50">
            <span>Quick Search</span>
            <kbd className="rounded border border-white/15 bg-white/10 px-1 py-0.2 text-[10px] font-mono text-slate-300">
              ⌘K
            </kbd>
          </span>
        </button>

        {/* Action Items (Demo, Support) */}
        <div className="mt-1 flex flex-col items-center gap-1.5">
          {ACTION_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  item.highlight
                    ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:scale-105"
                    : active
                    ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                }`}
                aria-label={item.label}
              >
                <Icon size={16} />
                <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-white/15 bg-[#0b1329] px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all z-50">
                  {item.tooltip}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Minimal Toggle Collapse Button */}
        <div className="mt-2 pt-2 border-t border-white/10 w-full flex justify-center">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition"
            aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
