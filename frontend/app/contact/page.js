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
      <section className="pb-28 pt-32 relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[600px] rounded-full bg-electric/15 blur-[130px]" />

      <div className="container-x relative">
        <Breadcrumb items={[{ label: "Contact Us" }]} />

        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          <div>
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
                  <div className="text-white font-medium">support@dezoryn.com</div>
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

          <div className="relative">
            <Suspense fallback={<div className="skeleton h-[560px] rounded-xl" />}>
              <ContactForm source="general-contact" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  </>
);
}
