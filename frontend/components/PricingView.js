"use client";
import { useState, useEffect } from "react";
import { Cloud, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";
import FAQ from "./FAQ";
import Button from "./Button";
import Reveal from "./Reveal";
import { products } from "@/lib/data";
import { getLiveProducts, getLivePricingPlans } from "@/lib/api";

const included = [[ShieldCheck, "Secure & Reliable", "Enterprise-grade security"], [Cloud, "Cloud Based", "Access from anywhere"], [RefreshCw, "Regular Updates", "Always up to date"], [Headphones, "Global Support", "We're here to help"]];
const enterprise = ["Unlimited/custom users", "Advanced security", "Custom integrations", "Dedicated support", "SLA", "Custom deployment", "Enterprise analytics", "Dedicated account management"];
const faq = [
  ["Can I switch between monthly and annual billing?", "Yes. Annual billing includes a 20% saving compared with paying monthly."],
  ["Which currency do you charge in?", "Prices are shown in USD. Additional currencies will be added later."],
  ["What does Enterprise include?", "Custom users, advanced security, integrations, dedicated support, SLA and deployment options."],
  ["Is there a free trial?", "Free trial availability is confirmed per product. Choose a product to start."],
];

export default function PricingView({ productSlug }) {
  const [liveProducts, setLiveProducts] = useState(products);
  const [cycle, setCycle] = useState("monthly");
  const [slug, setSlug] = useState(productSlug || products[0].slug);

  useEffect(() => {
    let mounted = true;
    // [API IMPLEMENTATION] getLiveProducts() & getLivePricingPlans() -> GET /api/v1/products & GET /api/v1/pricing
    Promise.allSettled([getLiveProducts(), getLivePricingPlans()]).then(
      ([prodResult, planResult]) => {
        if (!mounted) return;
        let prods = products;
        if (prodResult.status === "fulfilled" && Array.isArray(prodResult.value) && prodResult.value.length > 0) {
          prods = prodResult.value;
        }

        if (planResult.status === "fulfilled" && planResult.value) {
          const tiers =
            planResult.value.plans ||
            planResult.value.productSpecificTiers ||
            planResult.value.defaultTiers ||
            (Array.isArray(planResult.value) ? planResult.value : []);
          if (Array.isArray(tiers) && tiers.length > 0) {
            prods = prods.map((prod) => {
              const matchingPlans = tiers.filter(
                (t) => t.productId === prod.id || t.productSlug === prod.slug || t.product?.slug === prod.slug
              );
              if (matchingPlans.length > 0) {
                return {
                  ...prod,
                  plans: matchingPlans.map((mp) => {
                    const monthly = Number(mp.monthlyPriceUsd ?? mp.monthly_price_usd ?? mp.price ?? 49);
                    const annual = Number(mp.annualPriceUsd ?? mp.annual_price_usd ?? mp.annual ?? Math.round(monthly * 0.8));
                    return {
                      id: mp.id || mp.slug || `plan-${monthly}`,
                      name: mp.name,
                      for: mp.for || mp.description || "For modern enterprise teams",
                      price: monthly,
                      monthlyPriceUsd: monthly,
                      monthly_price_usd: monthly,
                      annual: annual,
                      annualPriceUsd: annual,
                      annual_price_usd: annual,
                      features: Array.isArray(mp.features) ? mp.features : [],
                      highlight: Boolean(mp.isHighlighted || mp.highlighted),
                      highlighted: Boolean(mp.isHighlighted || mp.highlighted),
                    };
                  }),
                };
              }
              return prod;
            });
          }
        }
        setLiveProducts(prods);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const product = liveProducts.find((p) => p.slug === slug) || liveProducts[0] || products[0];
  const plans = (Array.isArray(product?.plans) && product.plans.length > 0)
    ? product.plans
    : ((products.find((p) => p.slug === slug)?.plans) || products[0]?.plans || []);

  const [hoveredIdx, setHoveredIdx] = useState(null);

  const defaultPopularIdx = plans.findIndex((p) => p.highlighted || p.highlight || p.isHighlighted || p.id === "business" || p.slug === "business");
  const activePlanIdx = hoveredIdx !== null ? hoveredIdx : (defaultPopularIdx !== -1 ? defaultPopularIdx : 1);

  return (
    <section className="pb-12 pt-32">
      <div className="container-x">
        <div className="text-center">
          <h1 className="h-display text-4xl sm:text-6xl text-white">
            Simple. Transparent. <span className="text-gradient-blue">Scalable.</span>
          </h1>
          <p className="lead mt-4">Pick a plan that fits today. Move up when you grow.</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <BillingToggle cycle={cycle} setCycle={setCycle} />
            {!productSlug && (
              <label className="flex items-center gap-2 text-sm text-cool">Pricing for
                <select value={slug} onChange={(e) => setSlug(e.target.value)} className="h-9 rounded-lg border border-line bg-graphite px-3 text-sm text-white outline-none focus:border-electric">
                  {liveProducts.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
              </label>
            )}
          </div>
        </div>
        <div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch py-4"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {plans.map((pl, i) => (
            <div key={pl.id || i} className="h-full">
              <PricingCard
                plan={pl}
                cycle={cycle}
                product={product?.slug}
                index={i}
                isActive={i === activePlanIdx}
                isHoveredDirectly={i === hoveredIdx}
                isAnyHovered={hoveredIdx !== null}
                onHover={() => setHoveredIdx(i)}
                onLeave={() => {}}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-cool">All plans billed in USD ($) with transparent enterprise invoicing.</p>

        <Reveal>
          <div className="mt-16 grid gap-8 rounded-2xl border border-line p-8 sm:p-12 lg:grid-cols-2" style={{ background: "radial-gradient(60% 100% at 100% 0%, rgba(124,92,255,.2), transparent 70%), #0a1020" }}>
            <div>
              <h2 className="h-section">Need a Custom Solution?</h2>
              <p className="lead mt-3">Enterprise pricing is tailored to your users, security and deployment needs.</p>
              <div className="mt-6"><Button href="/contact?solution=Enterprise Software" arrow>Talk to Sales</Button></div>
            </div>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">{enterprise.map((e) => <li key={e} className="flex items-center gap-2 text-white/85"><span className="h-1.5 w-1.5 rounded-full bg-electric" />{e}</li>)}</ul>
          </div>
        </Reveal>

        <div className="mt-20">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">All Plans Include</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {included.map(([I, t, d]) => <div key={t} className="card p-5"><I size={22} className="text-electric" /><div className="mt-4 text-sm font-medium">{t}</div><div className="text-xs text-cool">{d}</div></div>)}
          </div>
        </div>
        <div id="faq" className="mx-auto mt-20 max-w-4xl scroll-mt-24"><h2 className="mb-6 text-2xl sm:text-4xl font-extrabold text-white">Pricing FAQ</h2><FAQ items={faq} /></div>
      </div>
    </section>
  );
}
