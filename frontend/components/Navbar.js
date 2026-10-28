"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import Logo from "./Logo";
import SearchModal from "./SearchModal";
import Icon from "./Icon";
import { nav, products, industries, formatPrice, startingPrice } from "@/lib/data";
import { getLiveProducts, getLiveIndustries } from "@/lib/api";

const solutionLinks = [
  ["Enterprise Solutions", "/solutions/enterprise"],
  ["AI Solutions", "/solutions/ai"],
  ["Automation", "/solutions/automation"],
  ["Custom Software", "/solutions/custom-software"],
  ["Digital Transformation", "/solutions/digital-transformation"],
  ["Cloud Solutions", "/solutions/cloud"],
  ["Mobile Solutions", "/solutions/mobile"],
];

function Mega({ id, liveProducts = products, liveIndustries = industries, onClose }) {
  if (id === "products") {
    const list = liveProducts.length > 0 ? liveProducts : products;
    return (
      <div className="w-[660px] p-3">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-cool/70">
            Enterprise SaaS Platforms ({list.length})
          </span>
          <Link
            href="/products"
            onClick={onClose}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            All Products Page →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {list.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              onClick={onClose}
              className="rounded-lg p-2.5 hover:bg-white/[0.06] transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/95 group-hover:text-blue-300 transition">
                  {p.name}
                </span>
                <span className="text-[11px] text-cool font-mono">
                  from {formatPrice(startingPrice(p))}
                </span>
              </div>
              <div className="mt-0.5 line-clamp-1 text-xs text-cool/70">
                {p.tagline || p.description}
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/marketplace"
          onClick={onClose}
          className="mt-2 flex items-center justify-between rounded-lg bg-electric/15 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-electric/25 transition"
        >
          <span>Explore All {list.length} Products in Software Marketplace</span>
          <span className="font-mono">→</span>
        </Link>
      </div>
    );
  }

  if (id === "solutions") {
    return (
      <div className="w-[340px] p-3">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-cool/70">
            Solutions Architecture
          </span>
          <Link
            href="/solutions"
            onClick={onClose}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            All Solutions →
          </Link>
        </div>
        <div className="space-y-0.5">
          {solutionLinks.map(([l, h]) => (
            <Link
              key={l}
              href={h}
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/[0.06] hover:text-white transition group"
            >
              <span>{l}</span>
              <span className="text-xs text-cool group-hover:text-blue-400 transition font-mono">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const indList = liveIndustries.length > 0 ? liveIndustries : industries;
  return (
    <div className="w-[540px] p-3">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-cool/70">
          Industry Verticals ({indList.length})
        </span>
        <Link
          href="/industries"
          onClick={onClose}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          All Industries →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {indList.map((i) => (
          <Link
            key={i.slug}
            href={`/industries/${i.slug}`}
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/[0.06] hover:text-white transition group"
          >
            <Icon name={i.icon} size={15} className="text-electric group-hover:scale-110 transition shrink-0" />
            <span className="truncate">{i.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [search, setSearch] = useState(false);
  const [liveProducts, setLiveProducts] = useState(products);
  const [liveIndustries, setLiveIndustries] = useState(industries);
  const path = usePathname();
  const router = useRouter();
  const navRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getLiveProducts()
      .then((p) => {
        if (mounted && Array.isArray(p) && p.length > 0) setLiveProducts(p);
      })
      .catch(() => {});

    getLiveIndustries()
      .then((ind) => {
        if (mounted && Array.isArray(ind) && ind.length > 0) setLiveIndustries(ind);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    setMobile(false);
    setMenu(null);
    setMobileSection(null);
  }, [path]);

  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  // Click outside listener for desktop mega menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const k = (e) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))
      ) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  if (path?.startsWith("/admin")) return null;

  const toggleMobileSec = (id) => {
    setMobileSection((prev) => (prev === id ? null : id));
  };

  const handleNav = (href) => {
    setMobile(false);
    setMenu(null);
    if (path === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobile
            ? "border-b border-white/10 bg-[#030712] shadow-2xl backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
        style={scrolled || mobile ? { backgroundColor: "#030712" } : {}}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div onClick={() => handleNav("/")}>
            <Logo />
          </div>

          {/* ─── DESKTOP NAVIGATION BAR ─── */}
          <nav
            ref={navRef}
            className="hidden items-center gap-1 xl:flex"
            aria-label="Main"
          >
            {nav.map((n) => {
              const isMega = Boolean(n.mega);
              const isOpen = menu === n.mega;
              const isActive = path === n.href || (isMega && path.startsWith(n.href));

              if (isMega) {
                return (
                  <div
                    key={n.label}
                    className="relative"
                    onMouseEnter={() => setMenu(n.mega)}
                  >
                    <button
                      type="button"
                      onClick={() => setMenu(isOpen ? null : n.mega)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] transition cursor-pointer select-none ${
                        isActive || isOpen ? "text-white font-semibold" : "text-white/70 hover:text-white"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{n.label}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-electric" : ""}`}
                      />
                    </button>

                    {/* Desktop Dropdown with transparent hover bridge */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full pt-2 z-50"
                        >
                          <div className="rounded-xl border border-white/10 bg-[#070e24]/95 shadow-2xl backdrop-blur-2xl">
                            <Mega
                              id={n.mega}
                              liveProducts={liveProducts}
                              liveIndustries={liveIndustries}
                              onClose={() => setMenu(null)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => handleNav(n.href)}
                  className={`flex items-center rounded-md px-3 py-2 text-[13px] transition cursor-pointer ${
                    isActive ? "text-white font-semibold" : "text-white/70 hover:text-white"
                  }`}
                >
                  {n.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleNav("/pricing")}
              className={`rounded-md px-3 py-2 text-[13px] transition cursor-pointer ${
                path === "/pricing" ? "text-white font-semibold" : "text-white/70 hover:text-white"
              }`}
            >
              Pricing
            </button>
          </nav>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setMobile(false);
                setMenu(null);
                setSearch(true);
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/5 hover:text-white xl:flex cursor-pointer transition"
              aria-label="Search (Ctrl K)"
            >
              <Search size={17} />
            </button>
            <button
              type="button"
              onClick={() => handleNav("/demo")}
              className="btn btn-primary h-9 px-3.5 sm:px-4 text-[13px] cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobile(!mobile)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 active:scale-95 transition xl:hidden cursor-pointer"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── FULL-SCREEN HIGH-DEPTH MOBILE NAVIGATION DRAWER ─── */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-[#030712] pt-16 overflow-hidden xl:hidden"

            style={{ backgroundColor: "#030712" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              {/* Search Bar Shortcut */}
              <button
                type="button"
                onClick={() => {
                  setMobile(false);
                  setSearch(true);
                }}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-xs text-cool hover:border-white/20 active:bg-white/[0.08] transition shadow-inner cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Search size={15} className="text-electric" />
                  <span>Search products, solutions, docs…</span>
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-cool/80">
                  Ctrl K
                </span>
              </button>

              {/* Navigation Items */}
              <nav className="divide-y divide-white/5 rounded-2xl border border-white/5 bg-white/[0.02] p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleNav("/")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Home</span>
                  <span className="text-xs text-cool font-mono">01</span>
                </button>

                {/* Solutions Accordion */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleMobileSec("solutions")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer ${
                      mobileSection === "solutions" ? "bg-white/5 text-white" : "text-white/85 hover:bg-white/5"
                    }`}
                    aria-expanded={mobileSection === "solutions"}
                  >
                    <span className="flex items-center gap-2">
                      <span>Solutions</span>
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                        {solutionLinks.length}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-cool ${
                        mobileSection === "solutions" ? "rotate-180 text-electric" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "solutions" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden px-2 pb-2 pt-1 space-y-1"
                      >
                        <button
                          type="button"
                          onClick={() => handleNav("/solutions")}
                          className="flex w-full items-center justify-between rounded-lg bg-electric/15 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-electric/25 transition cursor-pointer"
                        >
                          <span>Explore All Solutions Architecture</span>
                          <span className="font-mono">→</span>
                        </button>
                        {solutionLinks.map(([title, href]) => (
                          <button
                            key={title}
                            type="button"
                            onClick={() => handleNav(href)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-cool hover:bg-white/5 hover:text-white transition cursor-pointer text-left"
                          >
                            <span>{title}</span>
                            <span className="text-electric font-mono text-xs">→</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Products Accordion */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleMobileSec("products")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer ${
                      mobileSection === "products" ? "bg-white/5 text-white" : "text-white/85 hover:bg-white/5"
                    }`}
                    aria-expanded={mobileSection === "products"}
                  >
                    <span className="flex items-center gap-2">
                      <span>Products</span>
                      <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400 border border-purple-500/20">
                        {liveProducts.length > 0 ? liveProducts.length : products.length}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-cool ${
                        mobileSection === "products" ? "rotate-180 text-electric" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "products" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden px-2 pb-2 pt-1 space-y-1"
                      >
                        <button
                          type="button"
                          onClick={() => handleNav("/products")}
                          className="flex w-full items-center justify-between rounded-lg bg-electric/15 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-electric/25 transition cursor-pointer"
                        >
                          <span>Open All Products Catalog</span>
                          <span className="font-mono">→</span>
                        </button>
                        {(liveProducts.length > 0 ? liveProducts : products).slice(0, 7).map((p) => (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => handleNav(`/products/${p.slug}`)}
                            className="block w-full text-left rounded-lg px-3 py-2 text-xs hover:bg-white/5 transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white/95">{p.name}</span>
                              <span className="text-[10px] text-cool font-mono">
                                from {formatPrice(startingPrice(p))}
                              </span>
                            </div>
                            <div className="text-[11px] text-cool/70 truncate mt-0.5">
                              {p.tagline || p.description}
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleNav("/marketplace")}
                          className="block w-full rounded-lg bg-electric/10 px-3 py-2 text-center text-xs font-semibold text-blue-400 hover:bg-electric/20 transition mt-1 cursor-pointer"
                        >
                          View All {liveProducts.length > 0 ? liveProducts.length : products.length} Products in Marketplace →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Industries Accordion */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleMobileSec("industries")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer ${
                      mobileSection === "industries" ? "bg-white/5 text-white" : "text-white/85 hover:bg-white/5"
                    }`}
                    aria-expanded={mobileSection === "industries"}
                  >
                    <span className="flex items-center gap-2">
                      <span>Industries</span>
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                        {liveIndustries.length > 0 ? liveIndustries.length : industries.length}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-cool ${
                        mobileSection === "industries" ? "rotate-180 text-electric" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "industries" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden px-2 pb-2 pt-1 space-y-1"
                      >
                        <button
                          type="button"
                          onClick={() => handleNav("/industries")}
                          className="flex w-full items-center justify-between rounded-lg bg-electric/15 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-electric/25 transition cursor-pointer"
                        >
                          <span>Explore All Industry Verticals</span>
                          <span className="font-mono">→</span>
                        </button>
                        {(liveIndustries.length > 0 ? liveIndustries : industries).map((ind) => (
                          <button
                            key={ind.slug}
                            type="button"
                            onClick={() => handleNav(`/industries/${ind.slug}`)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-cool hover:bg-white/5 hover:text-white transition cursor-pointer text-left"
                          >
                            <Icon name={ind.icon} size={14} className="text-electric shrink-0" />
                            <span>{ind.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Standalone Navigation Links */}
                <button
                  type="button"
                  onClick={() => handleNav("/pricing")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/pricing" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Pricing &amp; Plans</span>
                  <span className="text-xs text-cool font-mono">USD</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/marketplace")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/marketplace" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Software Marketplace</span>
                  <span className="text-xs text-cool font-mono">11+</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/portfolio")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/portfolio" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Portfolio &amp; Case Studies</span>
                  <span className="text-xs text-cool font-mono">ROI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/resources")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/resources" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Resources &amp; Blog</span>
                  <span className="text-xs text-cool">Articles</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/company")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/company" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Company &amp; Leadership</span>
                  <span className="text-xs text-cool">About</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/careers")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/careers" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Careers</span>
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    We&apos;re Hiring
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav("/contact")}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer text-left ${
                    path === "/contact" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Contact Sales</span>
                  <span className="text-xs text-electric">Helpdesk</span>
                </button>
              </nav>

              {/* Bottom CTAs */}
              <div className="pt-2 pb-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleNav("/demo")}
                  className="btn btn-primary h-12 w-full justify-center text-sm font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Book an Interactive Product Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleNav("/contact")}
                  className="btn btn-secondary h-11 w-full justify-center text-xs font-semibold text-white/90 cursor-pointer"
                >
                  Talk to a Solutions Architect
                </button>
                <div className="pt-2 text-center text-[11px] text-cool/60">
                  DEZORYN TECHNOLOGY PRIVATE LIMITED • Global SaaS
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={search} onClose={() => setSearch(false)} />
    </>
  );
}
