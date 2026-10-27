"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu, X, ChevronDown } from "lucide-react";
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

function Mega({ id, liveProducts = products, liveIndustries = industries }) {
  if (id === "products") {
    const list = liveProducts.length > 0 ? liveProducts : products;
    return (
      <div className="grid w-[640px] grid-cols-2 gap-1 p-3">
        {list.slice(0, 6).map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="rounded-lg p-3 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">{p.name}</span><span className="text-xs text-cool">from {formatPrice(startingPrice(p))}</span></div>
            <div className="mt-0.5 line-clamp-1 text-xs text-cool">{p.description}</div>
          </Link>
        ))}
        <Link href="/marketplace" className="col-span-2 mt-1 rounded-lg bg-electric/10 px-3.5 py-2.5 text-sm text-[#9db8ff] hover:bg-electric/20">Browse all {list.length} products in the Marketplace →</Link>
      </div>
    );
  }
  if (id === "solutions")
    return (
      <div className="w-[320px] p-2">
        {solutionLinks.map(([l, h]) => <Link key={l} href={h} className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/[0.05] hover:text-white">{l}</Link>)}
      </div>
    );
  const indList = liveIndustries.length > 0 ? liveIndustries : industries;
  return (
    <div className="grid w-[520px] grid-cols-2 gap-1 p-2">
      {indList.map((i) => (
        <Link key={i.slug} href={`/industries/${i.slug}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/[0.05] hover:text-white"><Icon name={i.icon} size={16} className="text-electric" />{i.name}</Link>
      ))}
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

  useEffect(() => {
    let mounted = true;
    // [API IMPLEMENTATION] getLiveProducts() -> GET /api/v1/products
    getLiveProducts().then((p) => {
      if (mounted && Array.isArray(p) && p.length > 0) setLiveProducts(p);
    }).catch(() => {});

    // [API IMPLEMENTATION] getLiveIndustries() -> GET /api/v1/industries
    getLiveIndustries().then((ind) => {
      if (mounted && Array.isArray(ind) && ind.length > 0) setLiveIndustries(ind);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setMobile(false); setMenu(null); setMobileSection(null); }, [path]);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);
  useEffect(() => {
    const k = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  if (path?.startsWith("/admin")) return null;

  const toggleMobileSec = (id) => {
    setMobileSection((prev) => (prev === id ? null : id));
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
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main" onMouseLeave={() => setMenu(null)}>
            {nav.map((n) => (
              <div key={n.label} className="relative" onMouseEnter={() => setMenu(n.mega || null)}>
                <Link
                  href={n.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-[13px] transition ${
                    path === n.href ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {n.label}
                  {n.mega && (
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${menu === n.mega ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {menu && menu === n.mega && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-0 top-full pt-3"
                    >
                      <div className="rounded-xl border border-line bg-graphite/95 shadow-2xl backdrop-blur-xl">
                        <Mega id={menu} liveProducts={liveProducts} liveIndustries={liveIndustries} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              href="/pricing"
              className={`rounded-md px-3 py-2 text-[13px] ${
                path === "/pricing" ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearch(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/5 hover:text-white lg:flex"
              aria-label="Search (Ctrl K)"
            >
              <Search size={17} />
            </button>
            <Link href="/demo" className="btn btn-primary h-9 px-3.5 sm:px-4 text-[13px]">
              Get Started
            </Link>
            <button
              onClick={() => setMobile(!mobile)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 active:scale-95 transition lg:hidden"
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
            className="fixed inset-0 z-40 flex flex-col bg-[#030712] pt-16 overflow-hidden lg:hidden"
            style={{ backgroundColor: "#030712" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              {/* Search Bar Shortcut */}
              <button
                onClick={() => {
                  setMobile(false);
                  setSearch(true);
                }}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-xs text-cool hover:border-white/20 active:bg-white/[0.08] transition shadow-inner"
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
                <Link
                  href="/"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Home</span>
                  <span className="text-xs text-cool font-mono">01</span>
                </Link>

                {/* Solutions Accordion */}
                <div className="pt-0.5">
                  <button
                    onClick={() => toggleMobileSec("solutions")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
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
                        {solutionLinks.map(([title, href]) => (
                          <Link
                            key={title}
                            href={href}
                            onClick={() => setMobile(false)}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-cool hover:bg-white/5 hover:text-white transition"
                          >
                            <span>{title}</span>
                            <span className="text-electric font-mono text-xs">→</span>
                          </Link>
                        ))}
                        <Link
                          href="/solutions"
                          onClick={() => setMobile(false)}
                          className="block rounded-lg bg-electric/10 px-3 py-2 text-center text-xs font-semibold text-blue-400 hover:bg-electric/20 transition mt-1"
                        >
                          Browse All Enterprise Solutions →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Products Accordion */}
                <div className="pt-0.5">
                  <button
                    onClick={() => toggleMobileSec("products")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
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
                        {(liveProducts.length > 0 ? liveProducts : products).slice(0, 7).map((p) => (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            onClick={() => setMobile(false)}
                            className="block rounded-lg px-3 py-2 text-xs hover:bg-white/5 transition"
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
                          </Link>
                        ))}
                        <Link
                          href="/marketplace"
                          onClick={() => setMobile(false)}
                          className="block rounded-lg bg-electric/10 px-3 py-2 text-center text-xs font-semibold text-blue-400 hover:bg-electric/20 transition mt-1"
                        >
                          View All {liveProducts.length > 0 ? liveProducts.length : products.length} Products in Marketplace →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Industries Accordion */}
                <div className="pt-0.5">
                  <button
                    onClick={() => toggleMobileSec("industries")}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
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
                        {(liveIndustries.length > 0 ? liveIndustries : industries).map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            onClick={() => setMobile(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-cool hover:bg-white/5 hover:text-white transition"
                          >
                            <Icon name={ind.icon} size={14} className="text-electric shrink-0" />
                            <span>{ind.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Standalone Navigation Links */}
                <Link
                  href="/pricing"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/pricing" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Pricing &amp; Plans</span>
                  <span className="text-xs text-cool font-mono">USD</span>
                </Link>

                <Link
                  href="/marketplace"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/marketplace" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Software Marketplace</span>
                  <span className="text-xs text-cool font-mono">11+</span>
                </Link>

                <Link
                  href="/portfolio"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/portfolio" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Portfolio &amp; Case Studies</span>
                  <span className="text-xs text-cool font-mono">ROI</span>
                </Link>

                <Link
                  href="/resources"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/resources" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Resources &amp; Blog</span>
                  <span className="text-xs text-cool">Articles</span>
                </Link>

                <Link
                  href="/company"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/company" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Company &amp; Leadership</span>
                  <span className="text-xs text-cool">About</span>
                </Link>

                <Link
                  href="/careers"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/careers" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Careers</span>
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    We&apos;re Hiring
                  </span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobile(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    path === "/contact" ? "bg-electric/15 text-white font-semibold" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span>Contact Sales</span>
                  <span className="text-xs text-electric">Helpdesk</span>
                </Link>
              </nav>

              {/* Bottom CTAs */}
              <div className="pt-2 pb-6 space-y-2.5">
                <Link
                  href="/demo"
                  onClick={() => setMobile(false)}
                  className="btn btn-primary h-12 w-full justify-center text-sm font-bold shadow-lg shadow-blue-600/30"
                >
                  Book an Interactive Product Demo
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobile(false)}
                  className="btn btn-secondary h-11 w-full justify-center text-xs font-semibold text-white/90"
                >
                  Talk to a Solutions Architect
                </Link>
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
