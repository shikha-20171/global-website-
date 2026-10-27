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
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || mobile ? "border-b border-line bg-ink/90 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main" onMouseLeave={() => setMenu(null)}>
            {nav.map((n) => (
              <div key={n.label} className="relative" onMouseEnter={() => setMenu(n.mega || null)}>
                <Link href={n.href} className={`flex items-center gap-1 rounded-md px-3 py-2 text-[13px] transition ${path === n.href ? "text-white" : "text-white/70 hover:text-white"}`}>
                  {n.label}{n.mega && <ChevronDown size={12} className={`transition-transform ${menu === n.mega ? "rotate-180" : ""}`} />}
                </Link>
                <AnimatePresence>
                  {menu && menu === n.mega && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.16 }}
                      className="absolute left-0 top-full pt-3">
                      <div className="rounded-xl border border-line bg-graphite/95 shadow-2xl backdrop-blur-xl"><Mega id={menu} liveProducts={liveProducts} liveIndustries={liveIndustries} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link href="/pricing" className={`rounded-md px-3 py-2 text-[13px] ${path === "/pricing" ? "text-white" : "text-white/70 hover:text-white"}`}>Pricing</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearch(true)} className="hidden h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/5 hover:text-white lg:flex" aria-label="Search (Ctrl K)"><Search size={17} /></button>
            <Link href="/demo" className="btn btn-primary h-9 px-3.5 sm:px-4 text-[13px]">Get Started</Link>
            <button onClick={() => setMobile(!mobile)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 lg:hidden text-white" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile}>{mobile ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#020617]/98 pt-20 pb-safe safe-bottom scroll-touch overscroll-contain lg:hidden"
          >
            <nav className="container-x pb-20 safe-bottom" aria-label="Mobile Navigation">
              <button
                onClick={() => {
                  setMobile(false);
                  setSearch(true);
                }}
                className="mb-5 flex h-12 w-full items-center gap-3 rounded-xl border border-line bg-white/[0.03] px-4 text-sm text-cool hover:border-white/25 active:bg-white/[0.08] transition"
              >
                <Search size={16} />
                <span>Search products, solutions…</span>
              </button>

              <div className="divide-y divide-line/60">
                <Link href="/" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Home
                </Link>

                {/* Solutions Accordion */}
                <div className="py-2">
                  <button
                    onClick={() => toggleMobileSec("solutions")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium text-white/90"
                    aria-expanded={mobileSection === "solutions"}
                  >
                    <span>Solutions</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 text-cool ${mobileSection === "solutions" ? "rotate-180 text-electric" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "solutions" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pl-3 pb-2 space-y-1">
                        {solutionLinks.map(([title, href]) => (
                          <Link key={title} href={href} onClick={() => setMobile(false)} className="block py-2 text-sm text-cool hover:text-white flex items-center justify-between">
                            <span>{title}</span>
                            <span className="text-xs text-electric">→</span>
                          </Link>
                        ))}
                        <Link href="/solutions" onClick={() => setMobile(false)} className="block pt-2 text-xs font-medium text-electric hover:underline">
                          Browse Solutions Overview →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Products Accordion */}
                <div className="py-2">
                  <button
                    onClick={() => toggleMobileSec("products")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium text-white/90"
                    aria-expanded={mobileSection === "products"}
                  >
                    <span>Products</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 text-cool ${mobileSection === "products" ? "rotate-180 text-electric" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "products" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pl-3 pb-2 space-y-1">
                        {products.slice(0, 5).map((p) => (
                          <Link key={p.slug} href={`/products/${p.slug}`} onClick={() => setMobile(false)} className="block py-1.5 text-sm text-cool hover:text-white">
                            <div className="font-medium text-white/80">{p.name}</div>
                            <div className="text-[11px] text-cool/70 truncate">{p.tagline}</div>
                          </Link>
                        ))}
                        <Link href="/marketplace" onClick={() => setMobile(false)} className="block pt-2 text-xs font-medium text-electric hover:underline">
                          View all {products.length} products in Marketplace →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Nav Links */}
                <Link href="/marketplace" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Marketplace
                </Link>

                {/* Industries Accordion */}
                <div className="py-2">
                  <button
                    onClick={() => toggleMobileSec("industries")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium text-white/90"
                    aria-expanded={mobileSection === "industries"}
                  >
                    <span>Industries</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 text-cool ${mobileSection === "industries" ? "rotate-180 text-electric" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileSection === "industries" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pl-3 pb-2 space-y-1">
                        {industries.map((i) => (
                          <Link key={i.slug} href={`/industries/${i.slug}`} onClick={() => setMobile(false)} className="flex items-center gap-2 py-2 text-sm text-cool hover:text-white">
                            <Icon name={i.icon} size={14} className="text-electric" />
                            <span>{i.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/pricing" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Pricing
                </Link>

                <Link href="/portfolio" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Portfolio
                </Link>

                <Link href="/resources" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Resources
                </Link>

                <Link href="/company" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Company
                </Link>

                <Link href="/careers" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white flex items-center justify-between">
                  <span>Careers</span>
                  <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">We&apos;re Hiring</span>
                </Link>

                <Link href="/contact" onClick={() => setMobile(false)} className="block py-3 text-lg font-medium text-white/90 hover:text-white">
                  Contact Sales
                </Link>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/demo" onClick={() => setMobile(false)} className="btn btn-primary h-12 w-full justify-center text-sm font-semibold">
                  Get Started / Request Demo
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal open={search} onClose={() => setSearch(false)} />
    </>
  );
}
