import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import DataDeletionForm from "@/components/DataDeletionForm";
import { ShieldCheck, Trash2, Clock, CheckCircle2, AlertTriangle, ArrowRight, Lock, Smartphone, Share2, Mail, HelpCircle } from "lucide-react";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Data Deletion Request | DEZORYN TECHNOLOGY",
  description:
    "Official Data Deletion Request portal for DEZORYN TECHNOLOGY. Submit verified requests for personal data, user account, Google Play app data, and Meta platform data erasure.",
  path: "/data-deletion",
  keywords: [
    "DEZORYN data deletion",
    "data deletion request",
    "account deletion",
    "Google Play app deletion",
    "Meta data deletion instructions",
    "GDPR erasure request",
  ],
});

export const dynamic = "force-dynamic";

export default function DataDeletionPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Data Deletion Request", url: "/data-deletion" },
  ]);

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
            { label: "Home", href: "/" },
            { label: "Data Deletion Request" },
          ]}
        />

        {/* ─── PAGE HEADER ─── */}
        <header className="mt-8 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-3 font-mono">
            <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
              DEZORYN TECHNOLOGY &bull; Privacy Compliance Center
            </span>
            <span>Statutory Rights Protocol</span>
          </div>

          <h1 className="h-display text-3xl sm:text-4xl lg:text-5xl text-white">
            Data Deletion Request
          </h1>

          <p className="lead mt-4 text-cool max-w-2xl leading-relaxed">
            DEZORYN TECHNOLOGY respects user data rights under global privacy frameworks. Use this official portal to submit verified requests for account deletion, personal data erasure, Google Play mobile app data removal, or Meta platform data unlinking.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-cool hover:text-white hover:border-white/20 transition"
            >
              <ShieldCheck size={13} className="text-electric" />
              Read Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-cool hover:text-white hover:border-white/20 transition"
            >
              <Lock size={13} className="text-electric" />
              Terms &amp; Conditions
            </Link>
          </div>
        </header>

        {/* ─── IMPORTANT VERIFICATION NOTICE ─── */}
        <div className="my-8 rounded-xl border border-white/10 bg-[#070b16] p-5 flex items-start gap-3.5">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-cool leading-relaxed space-y-1">
            <p>
              <strong className="text-white">Security &amp; Identity Verification Protocol:</strong> To protect enterprise systems from malicious or unauthorized deletion requests, <strong className="text-white">accounts and database records are not deleted immediately</strong> upon submission. Our compliance team verifies account ownership before permanently purging records across primary databases.
            </p>
          </div>
        </div>

        {/* ─── REAL INTERACTIVE DELETION REQUEST FORM ─── */}
        <div className="mb-14">
          <DataDeletionForm />
        </div>

        {/* ─── EXPLANATIONS & STATUTORY PROCESS SECTIONS ─── */}
        <div className="space-y-10">
          {/* Section: Explanation of Data Deletion Rights */}
          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
              <ShieldCheck size={16} /> Data Deletion Rights
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Explanation of Data Deletion Rights
            </h2>
            <p className="text-sm sm:text-base text-cool leading-relaxed font-normal">
              Under recognized international data privacy standards—including GDPR (Article 17 &quot;Right to Erasure&quot;), the California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection Act (DPDPA)—individuals have the legal right to request that corporate entities permanently delete personal information held within their systems.
            </p>
            <p className="text-sm text-cool leading-relaxed">
              DEZORYN TECHNOLOGY enforces this right across all our operational databases, cloud storage buckets, inquiry archives, and communication lists.
            </p>
          </section>

          {/* Section: Account Deletion vs Personal Data Deletion Process */}
          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
              <Trash2 size={16} /> Request Processes
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Account Deletion &amp; Personal Data Deletion Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock size={15} className="text-electric" />
                  Account Deletion Process
                </h3>
                <p className="text-xs text-cool leading-relaxed">
                  Applies to registered customer administrators and enterprise tenant users. Once verified by your organization’s primary administrative contact, user credentials, role assignments, and personal login sessions are deactivated and scheduled for permanent database cascading.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={15} className="text-purple-400" />
                  Personal Data Deletion Process
                </h3>
                <p className="text-xs text-cool leading-relaxed">
                  Applies to website visitors, sales inquiries, demo booking participants, and newsletter subscribers. Associated names, corporate email addresses, phone records, and inquiry messages are permanently purged from our CRM databases.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Google Play Account & Data Deletion Instructions */}
          <section className="space-y-3 rounded-xl border border-blue-500/20 bg-[#070f2b] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase font-bold tracking-wider">
              <Smartphone size={16} /> Mobile Platform Instructions
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Google Play Account &amp; App Data Deletion Instructions
            </h2>
            <p className="text-sm text-cool leading-relaxed font-normal">
              For users of Android applications published by DEZORYN TECHNOLOGY:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-cool/90 ml-1">
              <li><strong className="text-white">In-App Deletion:</strong> If your mobile app provides an in-app deletion button, navigate to <strong>Settings &gt; Account &gt; Delete Account</strong>. Follow the on-screen confirmation steps to initiate immediate session deactivation.</li>
              <li><strong className="text-white">Web-Based Request Portal:</strong> If you uninstalled the application or cannot access your device, submit the form above selecting <strong>&quot;Google Play App Account &amp; Mobile Data Deletion&quot;</strong>, providing your registered app email.</li>
              <li><strong className="text-white">What Gets Removed:</strong> User profile records, device push notification tokens (FCM tokens), mobile activity logs, and app diagnostic traces linked to your account.</li>
            </ol>
            <p className="text-[11px] text-cool/70 pt-1">
              Refer to our <Link href="/privacy-policy#sec-12" className="text-blue-400 underline">Google Play Data Safety Disclosures</Link> for detailed declarations.
            </p>
          </section>

          {/* Section: Meta/Facebook Data Deletion Instructions */}
          <section className="space-y-3 rounded-xl border border-indigo-500/20 bg-[#070b20] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-bold tracking-wider">
              <Share2 size={16} /> Meta Platform Compliance
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Meta / Facebook Data Deletion Instructions
            </h2>
            <p className="text-sm text-cool leading-relaxed font-normal">
              In compliance with Meta Platform Terms (Section 4.f), users who interact with DEZORYN applications via Facebook Login or Meta business integrations can request erasure through either of the following mechanisms:
            </p>
            <div className="space-y-3 pt-1 text-xs sm:text-sm text-cool/90">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Method 1: Via Facebook Account Settings
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-cool/80 ml-1 text-xs">
                  <li>Go to your Facebook profile&apos;s <strong>Settings &amp; Privacy &gt; Settings</strong>.</li>
                  <li>Click on <strong>Apps and Websites</strong> in the left column.</li>
                  <li>Locate <strong>DEZORYN TECHNOLOGY</strong> in the application list and click <strong>Remove</strong>.</li>
                  <li>Under the removed apps tab, click <strong>View Removed Apps and Websites</strong> and click <strong>Send Request</strong> to trigger our automated callback.</li>
                </ol>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Method 2: Via This Web Form or Direct Email
                </h4>
                <p className="text-xs text-cool/80">
                  Select <strong>&quot;Meta / Facebook-Related Data Deletion&quot;</strong> in the form above and provide your Facebook User ID (ASID) or the email address associated with your Facebook profile, or email <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Required Information, Verification & Timeline */}
          <section className="space-y-4 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
              <Clock size={16} /> Verification &amp; Timeline
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Identity Verification Process &amp; Expected Timeline
            </h2>

            <div className="space-y-3 text-sm text-cool leading-relaxed">
              <p>
                <strong className="text-white">Required Information to Identify the Account:</strong> You must supply your full legal name, the registered email address used when submitting forms or signing in, and optional organizational/app identifiers.
              </p>
              <p>
                <strong className="text-white">Identity Verification Process:</strong> To prevent fraudulent erasure requests, our compliance team dispatches an ownership verification email to the registered address. For enterprise tenant accounts, confirmation from the designated organization admin is required before tenant databases are purged.
              </p>
              <p>
                <strong className="text-white">Expected Processing Timeline:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs sm:text-sm text-cool/90">
                <li><strong className="text-white">Initial Receipt &amp; Logging:</strong> Within 24 to 48 business hours, an automated ticket confirmation code is generated.</li>
                <li><strong className="text-white">Verification Window:</strong> Typically 3 to 5 business days for ownership confirmation.</li>
                <li><strong className="text-white">Database Purge Execution:</strong> Completed within 30 calendar days from authenticated verification across active databases.</li>
              </ul>
            </div>
          </section>

          {/* Section: Exceptions for Legally Required Retention */}
          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold tracking-wider">
              <AlertTriangle size={16} /> Legal Exceptions
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Exceptions for Legally Required Retention
            </h2>
            <p className="text-sm text-cool leading-relaxed font-normal">
              Under applicable statutory regulations, certain categories of data cannot be erased immediately upon request:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-cool/90 ml-1">
              <li>Financial transaction invoices, billing records, and tax receipts required by corporate accounting laws (retained for statutory periods);</li>
              <li>Security audit logs containing hashed IP addresses necessary for ongoing cybersecurity investigations or law enforcement inquiries;</li>
              <li>Minimal records of the deletion request itself, retained to demonstrate regulatory compliance with data protection authorities.</li>
            </ul>
            <p className="text-xs text-cool/70 pt-1">
              Where an exception applies, the relevant records are restricted from operational access and placed into locked cold storage.
            </p>
          </section>

          {/* Section: Contact Information */}
          <section className="space-y-3 rounded-xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
              <Mail size={16} /> Compliance Contact
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Contact Our Data Protection Office
            </h2>
            <p className="text-sm text-cool leading-relaxed font-normal">
              If you have any questions regarding your data deletion rights or need assistance with an existing ticket, please reach out directly:
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-5 text-xs sm:text-sm font-mono space-y-2 text-cool">
              <div><strong className="text-white">Company Name:</strong> DEZORYN TECHNOLOGY PRIVATE LIMITED</div>
              <div><strong className="text-white">Office:</strong> Data Protection Office &amp; Legal Compliance</div>
              <div><strong className="text-white">Direct Email:</strong> <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a> / <a href="mailto:dezoryntech@gmail.com" className="text-blue-400 underline">dezoryntech@gmail.com</a></div>
              <div><strong className="text-white">Phone:</strong> +91 7777804850</div>
              <div><strong className="text-white">Location:</strong> Bhopal, Madhya Pradesh, India</div>
            </div>
          </section>
        </div>

        {/* ─── FOOTER CONTACT CARD ─── */}
        <div className="mt-16 rounded-2xl border border-line bg-graphite/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-white text-base">
              Need assistance with an existing deletion ticket?
            </div>
            <p className="text-xs sm:text-sm text-cool mt-1">
              Provide your tracking reference code to our compliance desk for priority lookup.
            </p>
          </div>
          <Link href="/contact" className="btn btn-secondary h-10 px-5 text-xs shrink-0 cursor-pointer">
            Contact Compliance Desk &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
