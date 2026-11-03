import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import DataDeletionForm from "@/components/DataDeletionForm";
import { ShieldCheck, Trash2, Clock, CheckCircle2, AlertTriangle, ArrowRight, Lock } from "lucide-react";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Data Deletion Policy & Self-Service Request | DEZORYN TECHNOLOGY",
  description:
    "Official Data Deletion Policy and self-service erasure request portal for DEZORYN TECHNOLOGY. Request complete deletion of personal records under GDPR, CCPA, and Meta Platform Policies.",
  path: "/legal/data-deletion",
  keywords: [
    "data deletion",
    "request data erasure",
    "GDPR Article 17",
    "CCPA data deletion",
    "Meta data deletion instructions",
    "DEZORYN privacy rights",
  ],
});

export const dynamic = "force-dynamic";

export default function DataDeletionPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Legal", url: "/legal" },
    { name: "Data Deletion", url: "/legal/data-deletion" },
  ]);

  const navLinks = [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Data Deletion", href: "/legal/data-deletion", active: true },
    { label: "Terms & Conditions", href: "/legal/terms" },
    { label: "Google Play Data Safety", href: "/legal/google-play-data-safety" },
    { label: "Meta Data Deletion", href: "/legal/meta-data-deletion" },
    { label: "Security Policy", href: "/legal/security" },
    { label: "Refund Policy", href: "/legal/refund" },
  ];

  return (
    <article className="pb-28 pt-32 w-full max-w-full overflow-x-hidden">
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
            { label: "Data Deletion Policy" },
          ]}
        />

        {/* ─── POLICY NAVIGATION TABS ─── */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] border-b border-line">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                item.active
                  ? "bg-electric text-white font-semibold"
                  : "border border-line bg-graphite/60 text-cool hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ─── HEADER ─── */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-3 font-mono">
            <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
              GDPR Art. 17 &bull; CCPA &bull; Meta Policy Compliant
            </span>
            <span>Last Updated: October 2026</span>
          </div>

          <h1 className="h-display text-4xl sm:text-5xl text-white">
            Data Deletion Policy
          </h1>

          <p className="lead mt-4 text-cool max-w-2xl leading-relaxed">
            DEZORYN TECHNOLOGY guarantees users full control over their personal data. Submit a self-service erasure request below to permanently delete your information from our systems.
          </p>
        </div>

        {/* ─── INTERACTIVE SELF-SERVICE ERASURE FORM ─── */}
        <div className="mt-10 mb-16">
          <DataDeletionForm />
        </div>

        {/* ─── POLICY & STATUTORY DISCLOSURES ─── */}
        <div className="space-y-10">
          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-sm font-semibold uppercase tracking-wider font-mono">
              <Trash2 size={16} /> Section 1
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              1. Your Right to Erasure (&quot;Right to Be Forgotten&quot;)
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              In accordance with Article 17 of the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), the Brazilian General Data Protection Law (LGPD), and Meta Platform Developer Policies, you possess an unconditional statutory right to request that DEZORYN TECHNOLOGY permanently delete your personal information held across all our cloud storage clusters, databases, and operational environments.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-sm font-semibold uppercase tracking-wider font-mono">
              <ShieldCheck size={16} /> Section 2
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              2. Scope of Eligible Data for Deletion
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              Upon receiving your verified request, DEZORYN will permanently remove:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-cool/90 list-disc list-inside">
              <li><strong className="text-white">Contact &amp; Sales Inquiries:</strong> Inbound contact form submissions, sales inquiries, and associated metadata stored in our Neon PostgreSQL database.</li>
              <li><strong className="text-white">Demo Booking History:</strong> Scheduled software demonstration requests, attendee contact details, and calendar bookings.</li>
              <li><strong className="text-white">Marketing &amp; Newsletter Subscriptions:</strong> Registered email addresses in our automated broadcast lists.</li>
              <li><strong className="text-white">Meta / Social Platform Data:</strong> User identity tokens, profile details, or permissions acquired via Facebook Login or Meta integrations.</li>
              <li><strong className="text-white">SaaS Tenant Workspace Records:</strong> Customer user accounts, credentials, and tenant profile records (subject to organization administrative verification).</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-sm font-semibold uppercase tracking-wider font-mono">
              <Clock size={16} /> Section 3
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              3. Processing Timeline &amp; 30-Day SLA
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              DEZORYN adheres strictly to standard global privacy enforcement timelines:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="text-xs font-mono text-electric font-semibold">Stage 1 &bull; 24-48 Hours</span>
                <h4 className="text-white font-bold mt-1 text-sm">Receipt &amp; Verification</h4>
                <p className="text-xs text-cool mt-1">Our Data Protection Officer verifies the legitimacy and origin of the request.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="text-xs font-mono text-purple-400 font-semibold">Stage 2 &bull; 7-14 Days</span>
                <h4 className="text-white font-bold mt-1 text-sm">Database Cascade</h4>
                <p className="text-xs text-cool mt-1">All primary relational records, caches, and telemetry links are permanently purged.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="text-xs font-mono text-emerald-400 font-semibold">Stage 3 &bull; 30 Days Max</span>
                <h4 className="text-white font-bold mt-1 text-sm">Snapshot Expiration</h4>
                <p className="text-xs text-cool mt-1">Cold storage backup snapshots age out naturally through automated cryptographic rotation.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-sm font-semibold uppercase tracking-wider font-mono">
              <AlertTriangle size={16} /> Section 4
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              4. Legal &amp; Statutory Retention Exceptions
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              In limited scenarios mandated by applicable law, certain records cannot be immediately erased:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-cool/90 list-disc list-inside">
              <li>Financial invoices, payment receipts, and taxation documents required by statutory accounting standards (retained under strict lock for legal audit periods).</li>
              <li>Security audit logs containing hashed IP addresses involved in active cyber threats or breach investigations.</li>
              <li>Records subject to ongoing legal dispute resolution or judicial subpoena.</li>
            </ul>
            <p className="text-xs text-cool/80 mt-2">
              Where an exception applies, the relevant records are isolated from active processing and placed into restricted cold storage accessible only to corporate legal counsel.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-sm font-semibold uppercase tracking-wider font-mono">
              <Lock size={16} /> Section 5
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              5. Direct Contact with the Data Protection Office
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              If you prefer to submit your request via email or mail, you may communicate directly with our corporate Data Protection Officer:
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-5 text-xs font-mono space-y-2 text-cool">
              <div><strong className="text-white">Officer:</strong> Data Protection Officer, DEZORYN TECHNOLOGY PRIVATE LIMITED</div>
              <div><strong className="text-white">Email:</strong> <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a> / <a href="mailto:dezoryntech@gmail.com" className="text-blue-400 underline">dezoryntech@gmail.com</a></div>
              <div><strong className="text-white">Registered Address:</strong> DEZORYN TECHNOLOGY HQ, Bhopal, Madhya Pradesh, India</div>
              <div><strong className="text-white">Direct Phone:</strong> +91 7777804850</div>
            </div>
          </section>
        </div>

        {/* ─── FOOTER CONTACT ─── */}
        <div className="mt-14 rounded-xl border border-line bg-graphite/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-white text-sm">
              Need assistance with your privacy rights?
            </div>
            <p className="text-xs text-cool mt-0.5">
              Our compliance team typically replies to privacy inquiries within 24 hours.
            </p>
          </div>
          <Link href="/contact" className="btn btn-secondary h-9 px-4 text-xs shrink-0">
            Contact Privacy Officer &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

