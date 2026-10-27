import { Suspense } from "react";
import { Mail, Clock, Globe2, ShieldCheck, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/Button";
import Breadcrumb from "@/components/Breadcrumb";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Enterprise Sales & Solution Architects | DEZORYN",
  description:
    "Consult directly with DEZORYN solutions architects for enterprise SaaS licensing, bespoke system architecture, volume pricing, and custom SLAs.",
  path: "/contact-sales",
  keywords: [
    "enterprise software sales",
    "consult solution architect",
    "custom software pricing",
    "SaaS licensing inquiry",
  ],
});

export default function ContactSalesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Company", url: "/company" },
    { name: "Contact Sales", url: "/contact-sales" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="pb-28 pt-32 relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[600px] rounded-full bg-electric/15 blur-[130px]" />

      <div className="container-x relative">
        <Breadcrumb items={[{ label: "Company", href: "/company" }, { label: "Contact Sales" }]} />

        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-4 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>ENTERPRISE SOLUTIONS &amp; COMMERCIAL INQUIRIES</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Engineer Your <span className="text-gradient-blue">Enterprise Platform.</span>
            </h1>

            <p className="lead mt-5 max-w-md text-base sm:text-lg text-cool leading-relaxed">
              Consult with DEZORYN solution architects to design custom multi-tenant software, tailor domain business rules, or structure enterprise volume pricing.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Dedicated Solutions Architect assigned to your account",
                "Guaranteed commercial proposal within 1 business day",
                "Custom tenant schema isolation and encryption reviews",
                "99.9% uptime SLA commitments with priority incident response",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <ul className="mt-8 space-y-4 text-sm border-t border-white/10 pt-6">
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 text-electric shrink-0" />
                <div>
                  <div className="text-xs font-mono text-cool uppercase">Enterprise Sales Desk</div>
                  <div className="text-white font-medium">sales@dezoryn.com</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 text-electric shrink-0" />
                <div>
                  <div className="text-xs font-mono text-cool uppercase">SLA Response Window</div>
                  <div className="text-white font-medium">Within 4 business hours for enterprise RFPs</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Globe2 size={18} className="mt-0.5 text-electric shrink-0" />
                <div>
                  <div className="text-xs font-mono text-cool uppercase">Commercial Standard</div>
                  <div className="text-white font-medium">Transparent USD ($) billing with wire/ACH and international credit support</div>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#070b16] p-6 shadow-xl">
              <div className="text-xs font-mono text-electric uppercase tracking-wider">
                Need an Immediate Product Walkthrough?
              </div>
              <p className="text-xs text-cool mt-1 leading-relaxed">
                Schedule a dedicated 30-minute demonstration with our senior product engineering leads.
              </p>
              <div className="mt-4">
                <Button href="/demo" variant="secondary" arrow>
                  Schedule Interactive Demo
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <Suspense fallback={<div className="skeleton h-[560px] rounded-xl" />}>
              <ContactForm source="enterprise-sales" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  </>
);
}
