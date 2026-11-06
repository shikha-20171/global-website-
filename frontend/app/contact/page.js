import { Suspense } from "react";
import { Mail, Clock, Globe2, Building2, HelpCircle, PhoneCall, ShieldCheck } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/Button";
import Breadcrumb from "@/components/Breadcrumb";

import { buildMetadata, generateBreadcrumbSchema, generateContactPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us — Corporate Inquiries & Support | DEZORYN",
  description:
    "Get in touch with DEZORYN TECHNOLOGY. Corporate inquiries, support channels, partnership queries, and office headquarters details.",
  path: "/contact",
  keywords: [
    "contact DEZORYN",
    "customer support",
    "corporate inquiries",
    "headquarters contact",
  ],
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const contactSchema = generateContactPageSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <section className="pb-12 pt-20 sm:pt-24 lg:pb-28 lg:pt-32 relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[600px] rounded-full bg-electric/15 blur-[130px]" />

        <div className="container-x relative">
          {/* Breadcrumb: Desktop only to prevent mobile clutter */}
          <div className="hidden lg:block">
            <Breadcrumb items={[{ label: "Contact Us" }]} />
          </div>

          <div className="mt-2 sm:mt-4 lg:mt-6 grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
            {/* ─── DESKTOP LEFT COLUMN (Hidden on mobile for clean focused form) ─── */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-4 shadow-sm shadow-electric/10">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                <span>GLOBAL CORPORATE HEADQUARTERS &amp; SUPPORT</span>
              </div>

              <h1 className="h-display text-4xl sm:text-6xl text-white">
                Connect With <span className="text-gradient-blue">DEZORYN.</span>
              </h1>

              <p className="lead mt-5 max-w-md text-base sm:text-lg text-cool leading-relaxed">
                Have questions about our technology ecosystem, partnership programs, or need customer support? Our global operations team is here to assist.
              </p>

              <ul className="mt-10 space-y-5 text-sm">
                <li className="flex gap-3">
                  <Mail size={18} className="mt-0.5 text-electric shrink-0" />
                  <div>
                    <div className="text-xs font-mono text-cool uppercase">General &amp; Support Inquiries</div>
                    <div className="text-white font-medium">dezoryntech@gmail.com / support@dezoryn.com</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Building2 size={18} className="mt-0.5 text-electric shrink-0" />
                  <div>
                    <div className="text-xs font-mono text-cool uppercase">Corporate Headquarters</div>
                    <div className="text-white font-medium">Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock size={18} className="mt-0.5 text-electric shrink-0" />
                  <div>
                    <div className="text-xs font-mono text-cool uppercase">Operations Schedule</div>
                    <div className="text-white font-medium">Monday – Friday · 24-Hour Distributed Triage</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Globe2 size={18} className="mt-0.5 text-electric shrink-0" />
                  <div>
                    <div className="text-xs font-mono text-cool uppercase">Global Delivery</div>
                    <div className="text-white font-medium">Serving Enterprise Clients Worldwide from Bhopal HQ</div>
                  </div>
                </li>
              </ul>

              <div className="mt-10 rounded-2xl border border-white/10 bg-[#070b16] p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-electric uppercase tracking-wider">
                  <HelpCircle size={14} />
                  <span>Looking for Commercial Licensing?</span>
                </div>
                <p className="text-xs text-cool leading-relaxed">
                  If you need custom enterprise quotes, volume licensing agreements, or dedicated cloud deployment reviews, please connect with our Sales team.
                </p>
                <div className="flex gap-3 pt-1">
                  <Button href="/contact-sales" variant="secondary" arrow className="text-xs">
                    Contact Enterprise Sales
                  </Button>
                  <Button href="/demo" variant="secondary" className="text-xs">
                    Book Live Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN (Form on desktop & Full clean view on mobile) ─── */}
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              <Suspense fallback={<div className="skeleton h-[520px] rounded-2xl" />}>
                <ContactForm source="general-contact" />
              </Suspense>

              {/* ─── MOBILE VIEW ONLY: WhatsApp Button & Company Details directly under form ─── */}
              <div className="mt-6 lg:hidden space-y-4">
                {/* WhatsApp Direct Contact Button */}
                <a
                  href="https://wa.me/917777804850?text=Hi!%20I%20would%20like%20to%20know%20more,%20Kindly%20share%20me%20the%20details"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-3.5 text-sm font-bold text-emerald-300 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-[0.99]"
                  aria-label="Chat on WhatsApp 7777804850"
                >
                  <svg className="h-5 w-5 fill-current shrink-0 text-emerald-400" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.71 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Chat on WhatsApp: 7777804850</span>
                </a>

                {/* Company Name & Headquarters Card */}
                <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#14213d] to-[#0c1427] p-5 text-center shadow-xl space-y-1.5">
                  <div className="text-base font-extrabold text-white tracking-wide">
                    DEZORYN TECHNOLOGY
                  </div>
                  <div className="text-xs text-sky-400 font-mono">
                    dezoryntech@gmail.com
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                    Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    © {new Date().getFullYear()} DEZORYN TECHNOLOGY. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
