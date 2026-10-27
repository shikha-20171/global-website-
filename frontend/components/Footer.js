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
