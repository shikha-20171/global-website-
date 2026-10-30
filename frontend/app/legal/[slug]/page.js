import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, FileText, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Data collection, processing disclosures, and international user rights.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. Scope & Overview",
        content:
          "This Privacy Policy describes how DEZORYN TECHNOLOGY ('DEZORYN', 'we', 'our', or 'us') collects, uses, and safeguards information when you visit our website, explore our SaaS marketplace, or interact with our enterprise applications. This document applies to public website visitors, demo applicants, and registered customer organizations.",
      },
      {
        heading: "2. Information We Collect",
        content:
          "We collect information in three ways: (a) Information you voluntarily provide when submitting inquiry forms, scheduling product demos, or contacting sales (e.g. name, business email, company name, country, budget scope); (b) Operational tenant data entered into active SaaS workspaces governed by our Master Services Agreement; and (c) Automated technical telemetry (e.g. browser type, IP address, device viewport, and request latency) used solely for performance monitoring and security defense.",
      },
      {
        heading: "3. How We Use Your Information",
        content:
          "Your information is used strictly to: (a) Respond to your product demonstrations and sales inquiries; (b) Provision and maintain your software platform access; (c) Authenticate authorized users and prevent unauthorized access; (d) Comply with international regulatory and accounting obligations; and (e) Monitor platform uptime and diagnose technical errors. We do not sell, rent, or monetize your organizational data to third-party advertisers.",
      },
      {
        heading: "4. Multi-Tenant Data Isolation & Security",
        content:
          "DEZORYN enforces strict logical data isolation across all SaaS products. Tenant database schemas, file uploads, and session tokens are strictly partitioned. Data is encrypted in transit using Transport Layer Security (TLS 1.3) and at rest using AES-256 standard encryption. Role-based access control (RBAC) ensures only authorized administrators access designated organizational resources.",
      },
      {
        heading: "5. International Data Transfers",
        content:
          "DEZORYN TECHNOLOGY operates multi-region cloud infrastructure. Where customer data is transferred across international borders, we implement recognized contractual safeguards, including standard contractual clauses (SCCs) and data processing agreements, to guarantee equivalent privacy protection regardless of processing jurisdiction.",
      },
      {
        heading: "6. Data Retention & Deletion",
        content:
          "Public website inquiries are retained only for the duration necessary to fulfill the requested sales evaluation or support discussion. Registered SaaS tenant data is retained for the active term of the customer agreement. Upon account termination, customers may request a complete database export, after which all production tenant records are permanently purged following standard 30-day snapshot aging cycles.",
      },
      {
        heading: "7. Your Rights",
        content:
          "Depending on your geographic location, you may have statutory rights to: (a) Access, correct, or update personal information; (b) Request deletion of personal records where legal retention mandates do not apply; (c) Object to or restrict specific processing activities; and (d) Request data portability. To exercise these rights, contact our Data Protection Office at privacy@dezoryn.com.",
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    subtitle: "Terms governing use of the DEZORYN website, SaaS marketplace, and software platforms.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content:
          "By accessing the DEZORYN website (dezoryn.com), viewing product documentation, or using any associated software services, you agree to be bound by these Terms & Conditions. If you are entering into these terms on behalf of a company or legal entity, you represent that you have the authority to bind such entity.",
      },
      {
        heading: "2. SaaS Subscriptions & Account Access",
        content:
          "Access to DEZORYN SaaS applications is granted on a subscription basis subject to timely fee payment and active plan limits. Organizations are responsible for maintaining the confidentiality of their credentials, provisioning user roles appropriately, and preventing unauthorized account sharing.",
      },
      {
        heading: "3. Intellectual Property Rights",
        content:
          "All software code, user interface designs, logos, product marks, algorithms, and documentation are the exclusive intellectual property of DEZORYN TECHNOLOGY or its licensors. Subscriptions grant a revocable, non-exclusive, non-transferable license to access the software during the paid term. Reverse engineering, decompiling, or creating derivative software products is strictly prohibited.",
      },
      {
        heading: "4. Service Level & Maintenance",
        content:
          "We strive to maintain a 99.9% uptime target across our production cloud systems. Scheduled maintenance windows that may cause brief service interruptions are announced in advance. DEZORYN is not liable for temporary service interruptions resulting from external internet outages, force majeure, or client-side network failures.",
      },
      {
        heading: "5. Billing, Pricing & Taxes",
        content:
          "All baseline subscription fees are quoted in United States Dollars (USD) unless specified otherwise in an executed enterprise order form. Subscriptions automatically renew at the end of each billing cycle (monthly or annual) unless cancelled prior to renewal. Taxes, tariffs, and withholding duties are the responsibility of the subscriber.",
      },
      {
        heading: "6. Limitation of Liability",
        content:
          "To the maximum extent permitted by applicable law, DEZORYN TECHNOLOGY shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of profits, data loss, or business interruption, arising from the use or inability to use the software platforms.",
      },
    ],
  },

  security: {
    title: "Enterprise Security Policy",
    subtitle: "Architectural controls, encryption benchmarks, and data protection practices.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. Security Philosophy",
        content:
          "Security at DEZORYN is an architectural requirement, not an afterthought. We engineer our SaaS platforms, custom enterprise software, and cloud infrastructure around the principles of defense-in-depth, least privilege, and zero-trust verification.",
      },
      {
        heading: "2. Data Encryption Standards",
        content:
          "All external and internal network communications are encrypted using TLS 1.3 with strict modern cipher suites. Inbound HTTP traffic is forced to HTTPS with HTTP Strict Transport Security (HSTS) headers. Data at rest in relational databases, object storage, and backup snapshots is encrypted using AES-256.",
      },
      {
        heading: "3. Tenant Isolation & Access Controls",
        content:
          "Our multi-tenant SaaS architecture employs logical database partitioning, schema isolation, and tenant-scoped connection pooling. Applications authenticate every query against the active tenant context, preventing cross-tenant data leakage. Role-based access control (RBAC) allows customer administrators to enforce fine-grained permissions.",
      },
      {
        heading: "4. Infrastructure Resilience & Backups",
        content:
          "Our production environments run on redundant multi-zone cloud infrastructure with automated health monitoring. Relational databases are backed up continuously with point-in-time recovery capabilities. Automated daily and weekly snapshots are replicated to secondary storage regions for disaster recovery readiness.",
      },
      {
        heading: "5. Vulnerability Management & Responsible Disclosure",
        content:
          "We perform continuous dependency scanning, static code analysis, and regular security reviews of all application updates. Security researchers who discover potential vulnerabilities are invited to submit reports to security@dezoryn.com following responsible disclosure protocols.",
      },
    ],
  },

  refund: {
    title: "Subscription & Refund Policy",
    subtitle: "Billing cycles, cancellation procedures, and refund eligibility criteria.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. Subscription Billing Cycles",
        content:
          "DEZORYN SaaS platforms are billed in advance on either a monthly or annual recurring cycle. Your billing date is established on the day your paid subscription is activated. Invoices are dispatched electronically and billed in USD ($).",
      },
      {
        heading: "2. Free Trial & Evaluation Terms",
        content:
          "We offer free trials and guided demo environments for our core SaaS products. We encourage all organizations to utilize trial periods and sales walkthroughs to verify that the software meets operational requirements prior to purchasing paid subscription tiers.",
      },
      {
        heading: "3. Cancellation Policy",
        content:
          "You may cancel your recurring SaaS subscription at any time through your organization workspace billing settings or by contacting sales. Upon cancellation, your access remains active until the end of the current paid billing period, with no further automatic renewals charged.",
      },
      {
        heading: "4. Refund Eligibility",
        content:
          "Because our platforms provide immediate cloud access upon activation: (a) Monthly subscriptions are generally non-refundable once the billing month commences; (b) Annual subscriptions cancelled within the first 14 calendar days of initial purchase may be eligible for a pro-rated refund minus administrative setup fees; (c) Custom enterprise software development and implementation services are billed under milestone contracts and are strictly non-refundable once milestones are accepted.",
      },
      {
        heading: "5. Billing Inquiries & Disputes",
        content:
          "If you believe an erroneous charge occurred, contact billing@dezoryn.com within 30 days of the invoice date. We review every billing inquiry in good faith.",
      },
    ],
  },

  cookies: {
    title: "Cookie & Tracking Policy",
    subtitle: "How DEZORYN uses essential session tokens and performance preferences.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. What Are Cookies?",
        content:
          "Cookies and local storage tokens are small text files stored on your computer or mobile device when you browse websites. They enable the website to remember your session, preferences, and security state across page navigation.",
      },
      {
        heading: "2. Strictly Necessary Cookies",
        content:
          "These cookies are required for the basic operation of our platform. They include session tokens, CSRF protection headers, and load balancer route tokens. Disabling these cookies will prevent logging in and submitting forms securely.",
      },
      {
        heading: "3. Functional & Preference Storage",
        content:
          "We use local browser storage to store your user interface preferences, such as selected currency display (USD), product comparison tray items, and cookie consent preferences. These preferences do not track your activity across third-party websites.",
      },
      {
        heading: "4. Performance & Telemetry",
        content:
          "We may use privacy-preserving telemetry tools to monitor page render speed, broken links, and core web vitals. These metrics are anonymized and used exclusively to optimize application load times and server capacity.",
      },
      {
        heading: "5. Managing Your Choices",
        content:
          "You can review and modify your cookie preferences at any time using our Cookie Preferences button in the website footer or by adjusting your browser cookie settings.",
      },
    ],
  },

  "acceptable-use": {
    title: "Acceptable Use Policy",
    subtitle: "Rules and standards governing responsible use of DEZORYN platforms and APIs.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "1. Purpose & Application",
        content:
          "This Acceptable Use Policy defines prohibited conduct to protect the integrity, availability, and security of DEZORYN platforms, APIs, and the organizations utilizing our infrastructure.",
      },
      {
        heading: "2. Prohibited Network & Security Actions",
        content:
          "Users may not: (a) Probe, scan, or test the vulnerability of our systems without prior written authorization; (b) Launch denial of service (DoS) attacks or generate abusive high-frequency API traffic; (c) Circumvent authentication, tenant isolation, or rate-limiting controls; or (d) Attempt to gain unauthorized access to other tenant databases.",
      },
      {
        heading: "3. Unlawful Content & Misuse",
        content:
          "Organizations may not store, transmit, or process data that: (a) Infringes upon intellectual property, copyright, or trademark rights; (b) Contains malware, ransomware, or malicious scripts; (c) Facilitates fraudulent transactions, unsolicited mass spam, or phishing schemes; or (d) Violates applicable regional criminal statutes.",
      },
      {
        heading: "4. Enforcement & Account Suspension",
        content:
          "DEZORYN reserves the right to suspend or terminate access immediately if an account is found in material violation of this policy. Where appropriate, we will notify account administrators to resolve non-critical issues before initiating suspension.",
      },
    ],
  },
};

// Support both /legal/acceptable-use and /legal/aup
legalPages.aup = legalPages["acceptable-use"];

export async function generateStaticParams() {
  try {
    // Direct Axios call for legal policy slugs
    const res = await api.get("/api/v1/legal");
    const live = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    if (Array.isArray(live) && live.length > 0) {
      const slugs = new Set([...Object.keys(legalPages), ...live.map((p) => p.slug)]);
      return Array.from(slugs).map((slug) => ({ slug }));
    }
  } catch (err) {}
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  let livePolicy = null;
  try {
    // Direct Axios call for legal policy metadata
    const res = await api.get(`/api/v1/legal/${params.slug}`);
    livePolicy = res.data?.data || res.data?.policy || res.data;
  } catch (err) {}

  const staticPage = legalPages[params.slug];
  const page = livePolicy || staticPage;

  if (!page) {
    return buildMetadata({
      title: "Legal Policy | DEZORYN",
      path: `/legal/${params.slug}`,
    });
  }

  return buildMetadata({
    title: `${page.title} — Official Compliance & Terms | DEZORYN`,
    description: page.subtitle || `Official ${page.title} document for DEZORYN platforms and enterprise services.`,
    path: `/legal/${params.slug}`,
    keywords: [
      page.title,
      "DEZORYN legal",
      "compliance policy",
      "terms of service",
    ],
  });
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function LegalPage({ params }) {
  let livePolicy = null;
  try {
    // Direct Axios call inside Legal slug page
    const res = await api.get(`/api/v1/legal/${params.slug}`);
    livePolicy = res.data?.data || res.data?.policy || res.data;
  } catch (err) {
    console.warn("Legal policy live notice:", err?.message || err);
  }

  const staticPage = legalPages[params.slug];
  if (!staticPage && !livePolicy) notFound();

  const page = {
    title: livePolicy?.title || staticPage?.title,
    subtitle: livePolicy?.subtitle || staticPage?.subtitle,
    updated: livePolicy?.updatedAt ? new Date(livePolicy.updatedAt).toLocaleDateString() : staticPage?.updated,
    sections: livePolicy?.sections && Array.isArray(livePolicy.sections) && livePolicy.sections.length > 0 ? livePolicy.sections : staticPage?.sections || [],
  };

  const allSlugs = Object.keys(legalPages);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Legal", url: "/legal" },
    { name: page.title, url: `/legal/${params.slug}` },
  ]);

  return (
    <article className="pb-28 pt-32">
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <div className="container-x max-w-4xl">
        <Breadcrumb
          items={[
            { label: "Legal", href: "/legal/privacy" },
            { label: page.title },
          ]}
        />

        {/* ─── POLICY NAVIGATION TABS ─── */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] border-b border-line">
          {allSlugs.map((s) => (
            <Link
              key={s}
              href={`/legal/${s}`}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                params.slug === s
                  ? "bg-electric text-white"
                  : "border border-line bg-graphite/60 text-cool hover:text-white"
              }`}
            >
              {legalPages[s].title}
            </Link>
          ))}
        </div>

        {/* ─── HEADER ─── */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-3 font-mono">
            <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
              DEZORYN Corporate Governance
            </span>
            <span>Last Updated: {page.updated}</span>
          </div>

          <h1 className="h-display text-4xl sm:text-5xl text-white">
            {page.title}
          </h1>

          <p className="lead mt-4 text-cool max-w-2xl leading-relaxed">
            {page.subtitle}
          </p>
        </div>

        {/* ─── REVIEW NOTICE CALLOUT (SRS Compliance) ─── */}
        <div className="my-8 rounded-xl border border-line bg-midnight/80 p-5 flex items-start gap-3.5">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-cool leading-relaxed">
            <strong className="text-white">Notice of Legal Governance:</strong> This document represents DEZORYN TECHNOLOGY’s standard operating framework. Individual enterprise licensing and Master Services Agreements (MSAs) take precedence over general website terms where explicitly executed.
          </p>
        </div>

        {/* ─── POLICY CONTENT SECTIONS ─── */}
        <div className="mt-10 space-y-10">
          {page.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                {sec.heading}
              </h2>
              <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
                {sec.content}
              </p>
            </section>
          ))}
        </div>

        {/* ─── FOOTER CONTACT ─── */}
        <div className="mt-14 rounded-xl border border-line bg-graphite/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-white text-sm">
              Questions regarding our legal or security policies?
            </div>
            <p className="text-xs text-cool mt-0.5">
              Contact our corporate counsel and data protection team.
            </p>
          </div>
          <Link href="/contact" className="btn btn-secondary h-9 px-4 text-xs shrink-0">
            Contact Compliance Office →
          </Link>
        </div>
      </div>
    </article>
  );
}
