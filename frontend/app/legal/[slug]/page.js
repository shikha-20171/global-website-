import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, FileText, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import { getDbLegalPolicies } from "@/lib/neonDb";
import api from "@/lib/axios";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Comprehensive disclosure on personal data collection, cloud storage, encryption benchmarks, and third-party sharing standards.",
    updated: "October 2026",
    sections: [
      {
        heading: "1. Scope & Corporate Overview",
        content:
          "This Privacy Policy describes how DEZORYN TECHNOLOGY ('DEZORYN', 'we', 'our', or 'us') collects, uses, stores, and safeguards personal and operational data when you visit our global website (dezoryn.com), submit inquiry forms, book product demonstrations, subscribe to engineering updates, or interact with our multi-tenant SaaS platforms and enterprise applications. This policy is aligned with international standards including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection Act (DPDPA).",
      },
      {
        heading: "2. Data Collection (What Information We Collect)",
        content:
          "DEZORYN collects data under lawful, transparent bases: (a) Information You Voluntarily Provide: When you submit contact forms, demo requests, custom software inquiries, or newsletter subscriptions, we collect your name, business email address, phone number, organization name, country of operation, budget range, and project requirements. (b) Operational Platform & Account Data: Customer administrators and invited users provide credential identifiers, role assignments, and organizational workspace data. (c) Automated Technical Telemetry: When browsing our site, we record anonymized telemetry including IP address, browser type, device viewport, referring URL, and response latency to ensure server stability, prevent DDoS threats, and optimize load speeds.",
      },
      {
        heading: "3. Data Storage, Security & Encryption Standards",
        content:
          "All data collected by DEZORYN is stored in high-availability, SOC 2 Type II certified cloud infrastructure powered by Neon PostgreSQL and modern multi-region clusters. All data in transit across public and internal networks is encrypted using Transport Layer Security (TLS 1.3) with modern cipher suites. Data at rest—including database records, file attachments, and automated snapshot backups—is encrypted using advanced AES-256 standards. Logical multi-tenant schema partitioning guarantees complete data isolation between customer workspaces.",
      },
      {
        heading: "4. Data Sharing & Third-Party Disclosures",
        content:
          "DEZORYN enforces a strict non-monetization policy: We NEVER sell, rent, lease, trade, or monetize your personal or corporate data to third-party data brokers, marketers, or advertisers. We share information strictly with vetted, enterprise-grade infrastructure sub-processors required to deliver our services: (a) Cloud hosting and edge deployment providers (Render, Vercel); (b) Managed relational database infrastructure (Neon PostgreSQL); (c) Enterprise email transport networks (Google Workspace / Gmail SMTP via authenticated TLS); and (d) Payment processing networks (Stripe / Razorpay) operating under PCI-DSS Level 1 compliance. All sub-processors are contractually bound to maintain strict confidentiality and data protection measures equivalent to our own.",
      },
      {
        heading: "5. Multi-Tenant Data Isolation & Access Controls",
        content:
          "Our software architecture enforces zero-trust access controls and fine-grained Role-Based Access Control (RBAC). No tenant can view, access, or query data belonging to another tenant. Internal access by DEZORYN engineers is strictly restricted on a least-privilege basis, requires hardware-backed multi-factor authentication (MFA), and is fully audited in immutable access logs.",
      },
      {
        heading: "6. Data Retention & Deletion Lifecycle",
        content:
          "Public inquiries and newsletter records are retained only as long as necessary to fulfill the requested sales discussion or ongoing newsletter delivery. Customer workspace data is retained throughout the active term of the Master Services Agreement. Users may at any time exercise their right to erasure through our dedicated Data Deletion portal (/legal/data-deletion) or by contacting privacy@dezoryn.com. Once an erasure request is authenticated, records are permanently purged across active clusters within 30 calendar days.",
      },
      {
        heading: "7. International Data Transfers & Standard Contractual Clauses",
        content:
          "Where data is transferred across international jurisdictions, DEZORYN implements recognized legal mechanisms including European Commission Standard Contractual Clauses (SCCs) and Data Processing Agreements (DPAs) to ensure that the level of data protection mandated by applicable laws remains intact.",
      },
      {
        heading: "8. User Privacy Rights (GDPR & CCPA/CPRA)",
        content:
          "Depending on your jurisdiction, you have statutory rights to: (a) Request confirmation of whether your data is processed; (b) Access and receive an export of your personal data; (c) Rectify inaccurate records; (d) Request unconditional deletion under GDPR Article 17 via our /legal/data-deletion portal; (e) Restrict or object to processing; and (f) Withdraw consent without detriment. To exercise your rights, contact our Data Protection Office at privacy@dezoryn.com.",
      },
    ],
  },

  "data-deletion": {
    title: "Data Deletion Policy & Instructions",
    subtitle: "Official procedure for requesting complete, permanent deletion of personal and corporate records across DEZORYN platforms.",
    updated: "October 2026",
    sections: [
      {
        heading: "1. Right to Erasure Overview",
        content:
          "Under GDPR Article 17, the California Consumer Privacy Act (CCPA/CPRA), LGPD, and Meta Platform Policies, all individuals and organizational users possess the right to request permanent deletion of their personal information held across DEZORYN systems. We provide an interactive self-service erasure form at /legal/data-deletion to allow immediate submission of deletion requests.",
      },
      {
        heading: "2. Eligible Records for Deletion",
        content:
          "Eligible data categories include: (a) Contact form inquiries, sales submissions, and associated metadata; (b) Scheduled product demonstration requests and contact details; (c) Newsletter subscription emails; (d) Meta/Facebook social authentication credentials and permissions; and (e) SaaS tenant user accounts and profile data.",
      },
      {
        heading: "3. How to Submit a Deletion Request",
        content:
          "You can request deletion in any of three convenient ways: (1) Visit our dedicated Data Deletion Page at /legal/data-deletion and submit the interactive self-service form; (2) Email our Data Protection Officer at privacy@dezoryn.com with your registered email address and subject '[DATA DELETION REQUEST]'; or (3) For Facebook/Meta users, navigate to Facebook Settings > Apps and Websites > DEZORYN > Remove, which will trigger an automated platform callback.",
      },
      {
        heading: "4. Processing Timeline & 30-Day Resolution",
        content:
          "DEZORYN logs and acknowledges all deletion requests within 24 to 48 hours. After verifying the requester's identity, our database administrators execute automated deletion cascades across primary databases and caches within 14 business days. Encrypted snapshot backups age out permanently within standard 30-day rotation cycles.",
      },
      {
        heading: "5. Statutory Retention Exceptions",
        content:
          "In limited circumstances mandated by law, DEZORYN may retain minimal anonymized records necessary for: (a) Compliance with legal, tax, and accounting retention statutes; (b) Resolution of active contractual disputes or fraud investigations; and (c) Maintaining records of opt-out preferences to prevent future inadvertent outreach.",
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    subtitle: "Commercial rules and legal obligations governing access to DEZORYN platforms, SaaS marketplace, and software services.",
    updated: "October 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content:
          "By accessing the DEZORYN website (dezoryn.com), creating an account, subscribing to SaaS products, or utilizing our software APIs, you agree to be bound by these Terms & Conditions and all incorporated policies. If you represent an organization, you warrant that you have full legal authority to bind that entity.",
      },
      {
        heading: "2. App & Platform Usage Rules",
        content:
          "Users and client organizations must adhere to these operational usage rules: (a) Authorized Use: Use the software strictly for lawful business purposes in compliance with applicable regulations; (b) Account Integrity: Maintain the security of your credentials and notify DEZORYN immediately of any unauthorized access; (c) Prohibited Actions: You shall not reverse engineer, decompile, duplicate, or extract source code; you shall not probe, benchmark, or launch vulnerability scanners without prior written authorization; and you shall not use the service to transmit malicious software, spam, or abusive network traffic.",
      },
      {
        heading: "3. SaaS Subscriptions, Licenses & Quotas",
        content:
          "Access to DEZORYN SaaS platforms is granted on a revocable, non-exclusive, non-transferable subscription license. Subscriptions are billed in United States Dollars (USD) on either a monthly or annual cycle. Usage quotas (such as user seats, storage capacity, and API throughput) are enforced per active plan tier. Exceeding tier thresholds may require upgrading to a higher tier.",
      },
      {
        heading: "4. Multi-Tenant Architecture & Data Rights",
        content:
          "You retain full proprietary ownership of all business data, customer records, and assets you upload into your SaaS tenant environment. DEZORYN maintains the underlying software code, cloud infrastructure, and proprietary APIs. We do not claim intellectual property rights over your proprietary customer data.",
      },
      {
        heading: "5. Service Level Agreement (SLA) & Maintenance",
        content:
          "We commit to a 99.9% uptime target across our production cloud systems. Scheduled maintenance windows that may cause brief service interruptions are posted in advance. DEZORYN is not responsible for interruptions caused by global internet outages, client hardware failure, or force majeure events.",
      },
      {
        heading: "6. Billing, Auto-Renewal & Cancellation",
        content:
          "Subscriptions renew automatically at the end of each billing term unless cancelled by the customer prior to the renewal date. Customers may cancel renewals at any time via their administrative workspace or by contacting sales. Cancellations take effect at the end of the current prepaid billing period.",
      },
      {
        heading: "7. Limitation of Liability & Indemnification",
        content:
          "To the maximum extent permitted by applicable law, DEZORYN TECHNOLOGY and its affiliates shall not be liable for indirect, incidental, special, punitive, or consequential damages, including loss of profits, revenue, or business reputation. Total liability under any claim shall not exceed the subscription fees paid by the client in the 12 months preceding the incident.",
      },
    ],
  },

  "google-play-data-safety": {
    title: "Google Play Data Safety Declaration",
    subtitle: "Official disclosures for Android applications published by DEZORYN TECHNOLOGY regarding data collection, processing, and security.",
    updated: "October 2026",
    sections: [
      {
        heading: "1. Overview & Google Play Developer Policy Compliance",
        content:
          "In full compliance with Google Play's User Data Policy and Data Safety section requirements, this document declares all types of data collected, processed, and shared by mobile and enterprise Android applications developed and published by DEZORYN TECHNOLOGY.",
      },
      {
        heading: "2. Personal Information Collected",
        content:
          "Our enterprise applications collect the following personal information strictly to deliver app functionality and account authentication: (a) Name and Business Email: Used for account creation, login, customer support, and administrative notifications; (b) Phone Number: Optional, used for two-factor authentication (2FA) and account verification; (c) User Identifiers: Internal tenant account IDs used to partition enterprise data.",
      },
      {
        heading: "3. Financial Information Disclosures",
        content:
          "Our mobile applications do not process or store raw payment card numbers or bank account credentials on device. All subscription transactions are processed via Google Play In-App Billing or secure PCI-DSS Level 1 payment gateways (such as Stripe or Razorpay) using encrypted tokenization.",
      },
      {
        heading: "4. App Activity & Performance Diagnostics",
        content:
          "To maintain app reliability and diagnose issues, our Android applications collect: (a) App Interactions: Feature taps, navigation flows, and search queries (used strictly for internal UX optimization); (b) Crash Logs: Stack traces and crash metadata generated during application exceptions; (c) Diagnostics: Launch latency and battery impact metrics (collected in aggregated, anonymized form).",
      },
      {
        heading: "5. Device & Network Identifiers",
        content:
          "We collect Firebase Cloud Messaging (FCM) device registration tokens solely to dispatch transactional push notifications requested by the user (e.g. system alerts, inquiry status updates). We do NOT collect persistent hardware identifiers (IMEI, MAC address) for advertising or third-party profiling.",
      },
      {
        heading: "6. Security Practices & Data Encryption",
        content:
          "All data transferred between DEZORYN mobile applications and our backend cloud is encrypted in transit using Transport Layer Security (TLS 1.3) with certificate pinning. Data stored locally on mobile devices uses Android Keystore and encrypted SQLite databases. We do not sell user data to data brokers or advertising networks.",
      },
      {
        heading: "7. User Data Deletion Mechanism",
        content:
          "Users can request complete deletion of their account and all associated data at any time via: (a) In-app Account Settings > 'Delete Account'; (b) Our online self-service Data Deletion portal at /legal/data-deletion; or (c) Emailing privacy@dezoryn.com. All associated mobile telemetry, account records, and push tokens are permanently purged within 30 days.",
      },
    ],
  },

  "meta-data-deletion": {
    title: "Meta / Facebook Data Deletion Instructions",
    subtitle: "Step-by-step instructions for users to remove DEZORYN applications and request complete erasure of Meta platform data.",
    updated: "October 2026",
    sections: [
      {
        heading: "1. Meta Platform Developer Policy Compliance",
        content:
          "In accordance with Meta / Facebook Platform Terms and Developer Policy (Section 4.f), DEZORYN TECHNOLOGY provides this public User Data Deletion Callback and Instruction guide for all users who interact with our applications using Facebook Login, Instagram integrations, or Meta Business tools.",
      },
      {
        heading: "2. Step-by-Step Instructions: Delete via Facebook Settings",
        content:
          "If you logged into a DEZORYN application using your Facebook account, you can remove the application and request data deletion directly from Facebook: (1) Log in to your Facebook account and navigate to 'Settings & Privacy' > 'Settings'; (2) In the left navigation menu, click 'Apps and Websites'; (3) Locate 'DEZORYN TECHNOLOGY' or the specific DEZORYN app in the active list; (4) Click the 'Remove' button next to the app name; (5) In the confirmation dialog, check the box 'Delete posts, videos or events' if desired, and click 'Remove'; (6) Click on 'View Removed Apps and Websites', find DEZORYN, and click 'Send Request' to transmit an automated data deletion request callback to our server.",
      },
      {
        heading: "3. Direct Online Self-Service Request",
        content:
          "You do not need to wait for Facebook's background sync. You can immediately execute your data deletion rights by visiting DEZORYN's Data Deletion Portal at /legal/data-deletion. Select 'Full Data Erasure' or mention your Facebook User ID (ASID) in the form, and our system will purge all linked records within 30 days.",
      },
      {
        heading: "4. Automated Data Deletion Callback URL",
        content:
          "DEZORYN maintains an automated signed request callback handler for Meta platform webhooks. When Meta dispatches a data deletion request to our endpoint, our server automatically computes the HMAC-SHA256 signature, validates the user_id, marks the associated records for erasure, and returns a JSON confirmation containing the tracking URL and unique confirmation code.",
      },
      {
        heading: "5. Confirmation Code & Tracking",
        content:
          "Upon receipt of a data deletion callback or manual submission, DEZORYN generates a unique Confirmation Code (format: DEL-FB-XXXXXX). You can verify the progress of your deletion request at any time by emailing privacy@dezoryn.com with your confirmation code.",
      },
      {
        heading: "6. DPO Contact for Meta Compliance",
        content:
          "If you have questions regarding Meta platform data deletion, contact our Data Protection Officer: DEZORYN TECHNOLOGY PRIVATE LIMITED, Email: privacy@dezoryn.com / dezoryntech@gmail.com, WhatsApp/Phone: +91 7777804850.",
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
    const policies = await getDbLegalPolicies();
    livePolicy = policies.find((p) => p.slug === params.slug || p.id === params.slug);
  } catch (_) {
    try {
      const res = await api.get(`/api/v1/legal/${params.slug}`);
      livePolicy = res.data?.data || res.data?.policy || res.data;
    } catch (err) {}
  }

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
    const policies = await getDbLegalPolicies();
    livePolicy = policies.find((p) => p.slug === params.slug || p.id === params.slug);
  } catch (_) {
    try {
      const res = await api.get(`/api/v1/legal/${params.slug}`);
      livePolicy = res.data?.data || res.data?.policy || res.data;
    } catch (err) {}
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
      <div className="container-x">
        <Breadcrumb
          items={[
            { label: "Legal", href: "/legal/privacy" },
            { label: page.title },
          ]}
        />

        {/* ─── POLICY NAVIGATION TABS ─── */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] border-b border-line">
          {allSlugs.map((s) => {
            const targetHref =
              s === "privacy"
                ? "/privacy-policy"
                : s === "terms"
                ? "/terms-and-conditions"
                : s === "data-deletion"
                ? "/data-deletion"
                : `/legal/${s}`;
            return (
              <Link
                key={s}
                href={targetHref}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  params.slug === s
                    ? "bg-electric text-white font-semibold"
                    : "border border-line bg-graphite/60 text-cool hover:text-white"
                }`}
              >
                {legalPages[s].title}
              </Link>
            );
          })}
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
