"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import FooterMark from "./FooterMark";
import { subscribeNewsletter } from "@/lib/api";
import { CheckCircle2, ArrowRight } from "lucide-react";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // [API IMPLEMENTATION] subscribeNewsletter() -> POST /api/v1/newsletter/subscribe
      await subscribeNewsletter(email, "website_footer");
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-electric/10 border border-electric/30 text-xs text-electric">
        <CheckCircle2 size={15} className="shrink-0" />
        <span>Subscribed! Check your inbox for updates.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <div className="relative flex items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
          className="h-9 w-full rounded-lg border border-line bg-graphite/80 pl-3 pr-9 text-xs text-white placeholder-cool/60 outline-none transition focus:border-electric focus:ring-1 focus:ring-electric"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Submit newsletter subscription"
          className="absolute right-1 h-7 w-7 rounded-md bg-electric hover:bg-electric/90 text-white flex items-center justify-center transition disabled:opacity-50"
        >
          <ArrowRight size={13} />
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
    </form>
  );
}

const cols = [
  [
    "Company",
    [
      ["About", "/company"],
      ["Mission & Vision", "/mission"],
      ["Careers", "/careers"],
      ["Partners", "/partners"],
      ["Contact Sales", "/contact-sales"],
    ],
  ],
  [
    "Products",
    [
      ["Products", "/products"],
      ["Marketplace", "/marketplace"],
      ["Pricing", "/pricing"],
      ["Portfolio", "/portfolio"],
      ["Case Studies", "/case-studies"],
    ],
  ],
  [
    "Solutions",
    [
      ["Enterprise", "/solutions/enterprise"],
      ["AI Solutions", "/solutions/ai"],
      ["Automation", "/solutions/automation"],
      ["Custom Software", "/solutions/custom-software"],
      ["Digital Transformation", "/solutions/digital-transformation"],
      ["Cloud Infrastructure", "/solutions/cloud"],
      ["Mobile Solutions", "/solutions/mobile"],
    ],
  ],
  [
    "Industries",
    [
      ["Education", "/industries/education"],
      ["Healthcare", "/industries/healthcare"],
      ["Real Estate", "/industries/real-estate"],
      ["Manufacturing", "/industries/manufacturing"],
    ],
  ],
  [
    "Resources",
    [
      ["Blog", "/blog"],
      ["Insights", "/resources/insights"],
      ["Guides", "/resources/guides"],
      ["Documentation", "/resources/docs"],
      ["Developer APIs", "/resources/api"],
      ["FAQs", "/faq"],
    ],
  ],
  [
    "Legal",
    [
      ["Privacy Policy", "/legal/privacy"],
      ["Terms & Conditions", "/legal/terms"],
      ["Security Policy", "/legal/security"],
      ["Refund Policy", "/legal/refund"],
      ["Cookie Policy", "/legal/cookies"],
      ["Acceptable Use", "/legal/acceptable-use"],
    ],
  ],
];

export default function Footer() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-line bg-midnight">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-cool leading-relaxed">
              Software products, enterprise platforms, and digital solutions for modern businesses.
            </p>

            {/* ─── WHATSAPP CONTACT (SINGLE PLACE, SIMPLE DESIGN) ─── */}
            <div className="mt-4">
              <a
                href="https://wa.me/917777804850?text=Hi!%20I%20would%20like%20to%20know%20more,%20Kindly%20share%20me%20the%20details"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                aria-label="WhatsApp 7777804850"
              >
                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.71 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp: 7777804850</span>
              </a>
            </div>

            <div className="mt-6 max-w-xs">
              <span className="text-[11px] font-mono text-cool uppercase tracking-wider block mb-2">
                Subscribe to Engineering Updates
              </span>
              <NewsletterForm />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {cols.map(([t, links]) => (
              <div key={t}>
                <h4 className="text-sm font-semibold text-white tracking-tight">{t}</h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map(([l, h]) => (
                    <li key={l}>
                      <Link href={h} className="text-xs text-cool transition hover:text-white">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between items-center gap-2 border-t border-line pt-6 text-xs text-cool sm:flex-row">
          <span>© {new Date().getFullYear()} DEZORYN TECHNOLOGY. All rights reserved.</span>
          <span>Technology That Moves Businesses Forward.</span>
        </div>
        <FooterMark />
      </div>
    </footer>
  );
}
