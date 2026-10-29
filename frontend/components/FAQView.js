import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export const allFaqs = [
  [
    "What kind of company is DEZORYN TECHNOLOGY?",
    "DEZORYN is a global technology company building intelligent SaaS platforms, enterprise software, AI solutions, automation systems, and digital infrastructure for modern businesses.",
  ],
  [
    "Why is USD ($) the default currency on the website?",
    "DEZORYN serves an international client base across North America, Europe, the Middle East, and Asia. USD provides a globally recognized benchmark for transparent, predictable software subscription pricing.",
  ],
  [
    "How does DEZORYN guarantee data security across multiple tenants?",
    "Every SaaS platform enforces strict logical tenant schema isolation. Databases are encrypted at rest with AES-256 and in transit with TLS 1.3. User access is protected by granular role-based permissions (RBAC) and optional multi-factor authentication.",
  ],
  [
    "Can we integrate DEZORYN software with our existing ERP or payment gateway?",
    "Yes. All DEZORYN platforms provide RESTful APIs and real-time webhook endpoints. We routinely connect with Stripe, Google Workspace, Slack, Zoom, WhatsApp Cloud APIs, and custom legacy databases.",
  ],
  [
    "What is the typical deployment timeline for a DEZORYN platform?",
    "Standard SaaS applications (like Schooly Core or Dezo Care) can be configured and live in a sandbox environment within 48 to 72 hours. Enterprise custom software deployments typically progress across structured 4-phase rollout schedules over 4 to 12 weeks.",
  ],
  [
    "Is there a free trial available?",
    "Yes. Qualified organizations can launch a 14-day full-featured evaluation sandbox across our core SaaS products with zero credit card required.",
  ],
  [
    "How does DEZORYN support ongoing maintenance and SLA requirements?",
    "Enterprise contracts include dedicated account managers, 99.9% uptime SLAs, automated cloud backups, continuous security patches, and 24/7 priority incident response.",
  ],
];

export default function FAQView({ items }) {
  const displayFaqs = (items && items.length > 0) ? items : allFaqs;
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Frequently Asked Questions" },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>KNOWLEDGE BASE &amp; INQUIRIES</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Frequently Asked <span className="text-gradient-blue">Questions.</span>
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Clear, transparent answers about our SaaS product ecosystem, architecture, security, and enterprise commercial models.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x max-w-4xl">
          <FAQ items={displayFaqs} />
        </div>
      </section>

      <CTASection
        title="Have a Specific Architectural Question?"
        text="Our solution architects are ready to review your infrastructure requirements."
        primary={["Contact Sales", "/contact-sales"]}
        secondary={["Book a Demo", "/demo"]}
      />
    </>
  );
}
