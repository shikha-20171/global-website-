import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, Lock, ExternalLink, ArrowRight, AlertTriangle, FileText, Smartphone, Share2, Mail, CheckCircle2 } from "lucide-react";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | DEZORYN TECHNOLOGY",
  description:
    "Official Privacy Policy of DEZORYN TECHNOLOGY. Discloses data collection, personal information, Google Play Data Safety, Meta data deletion instructions, and user rights.",
  path: "/privacy-policy",
  keywords: [
    "DEZORYN privacy policy",
    "data collection disclosures",
    "Google Play data safety",
    "Meta data deletion instructions",
    "enterprise privacy policy",
    "GDPR privacy rights",
  ],
});

export const dynamic = "force-dynamic";

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  const sections = [
    { id: "sec-1", num: "1", title: "Introduction" },
    { id: "sec-2", num: "2", title: "About DEZORYN TECHNOLOGY" },
    { id: "sec-3", num: "3", title: "Scope of this Policy" },
    { id: "sec-4", num: "4", title: "Information We Collect" },
    { id: "sec-5", num: "5", title: "Personal Information" },
    { id: "sec-6", num: "6", title: "Business and Company Information" },
    { id: "sec-7", num: "7", title: "Technical Information and Cookies" },
    { id: "sec-8", num: "8", title: "How We Collect Information" },
    { id: "sec-9", num: "9", title: "How We Use Information" },
    { id: "sec-10", num: "10", title: "Legal Basis for Processing" },
    { id: "sec-11", num: "11", title: "Data Sharing and Third-Party Services" },
    { id: "sec-12", num: "12", title: "Google Services & Google Play Data Safety" },
    { id: "sec-13", num: "13", title: "Meta/Facebook Services & Meta Data Deletion Instructions" },
    { id: "sec-14", num: "14", title: "Data Storage and Security" },
    { id: "sec-15", num: "15", title: "Data Retention" },
    { id: "sec-16", num: "16", title: "User Privacy Rights" },
    { id: "sec-17", num: "17", title: "Children's Privacy" },
    { id: "sec-18", num: "18", title: "International Data Transfers" },
    { id: "sec-19", num: "19", title: "Data Deletion and Account Deletion" },
    { id: "sec-20", num: "20", title: "Changes to this Policy" },
    { id: "sec-21", num: "21", title: "Contact Information" },
  ];

  return (
    <article className="pb-28 pt-32 w-full max-w-full overflow-x-hidden">
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      <div className="container-x">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />

        {/* ─── HEADER ─── */}
        <header className="mt-8 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-3 font-mono">
            <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
              Corporate Privacy Standard
            </span>
            <span>Effective Date: October 2026</span>
            <span>Version 2.4</span>
          </div>

          <h1 className="h-display text-3xl sm:text-4xl lg:text-5xl text-white">
            Privacy Policy
          </h1>

          <p className="lead mt-4 text-cool max-w-3xl leading-relaxed">
            DEZORYN TECHNOLOGY is committed to protecting your privacy and transparently disclosing how information is collected, used, processed, stored, and safeguarded across our corporate website, SaaS marketplace, and digital platforms.
          </p>

          {/* Quick Links Banner */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/terms-and-conditions"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-cool hover:text-white hover:border-white/20 transition"
            >
              <FileText size={13} className="text-electric" />
              Terms &amp; Conditions
            </Link>
            <Link
              href="/data-deletion"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-red-300 hover:text-red-200 hover:border-red-400/50 transition font-medium"
            >
              <Lock size={13} className="text-red-400" />
              Submit Data Deletion Request &rarr;
            </Link>
          </div>
        </header>

        {/* ─── DRAFT / LEGAL NOTICE CALLOUT ─── */}
        <div className="my-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 flex items-start gap-3.5">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
            <p>
              <strong className="text-white">Notice of Legal Governance &amp; Counsel Review:</strong> This Privacy Policy outlines DEZORYN TECHNOLOGY’s operational data processing standards. Specific enterprise agreements (such as signed Master Services Agreements or Enterprise Data Processing Agreements) supersede general website terms where explicitly executed. Where statutory details are marked with brackets, they represent designated legal placeholders subject to corporate confirmation.
            </p>
          </div>
        </div>

        {/* ─── TWO COLUMN LAYOUT: TABLE OF CONTENTS + CONTENT ─── */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block sticky top-24 rounded-2xl border border-white/10 bg-[#070b16] p-5 max-h-[calc(100vh-7rem)] overflow-y-auto [scrollbar-width:thin]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Contents
              </span>
              <span className="text-[11px] font-mono text-cool">21 Sections</span>
            </div>
            <nav className="space-y-1 text-xs" aria-label="Table of Contents">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block py-1.5 px-2 rounded-lg text-cool hover:text-white hover:bg-white/5 transition truncate"
                  title={`${s.num}. ${s.title}`}
                >
                  <span className="font-mono text-electric mr-1.5">{s.num}.</span>
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <a
                href="#top"
                className="text-[11px] text-cool hover:text-white transition inline-flex items-center gap-1"
              >
                &uarr; Back to top
              </a>
            </div>
          </aside>

          {/* Main 21 Sections Container */}
          <main className="space-y-10 min-w-0">
            {/* Section 1 */}
            <section id="sec-1" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">1. Introduction</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Welcome to DEZORYN TECHNOLOGY (&quot;DEZORYN&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines the types of data we collect, how it is used, who it may be shared with, and your statutory rights regarding data protection.
                </p>
                <p>
                  By accessing our corporate website (dezoryn.com), interacting with our inquiry forms, scheduling product demonstrations, or utilizing our software-as-a-service (SaaS) platforms, you acknowledge the collection and processing of information as described in this policy.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">2. About DEZORYN TECHNOLOGY</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN TECHNOLOGY is an enterprise software engineering company that develops multi-tenant SaaS platforms, cloud infrastructure, industry-specific business management solutions, and AI automation systems.
                </p>
                <p className="text-xs sm:text-sm text-cool/80 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <strong className="text-white">Corporate Identity:</strong> DEZORYN TECHNOLOGY PRIVATE LIMITED<br />
                  <strong className="text-white">Headquarters / Operational Location:</strong> Bhopal, Madhya Pradesh, India <span className="text-amber-400 font-mono text-[11px]">[Full registered address and CIN to be confirmed by legal counsel]</span><br />
                  <strong className="text-white">Primary Web Domain:</strong> https://www.dezoryn.com<br />
                  <strong className="text-white">Compliance Inquiries:</strong> privacy@dezoryn.com / dezoryntech@gmail.com
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">3. Scope of this Policy</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  This policy applies to information collected through:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Our public website (dezoryn.com) and associated subdomains;</li>
                  <li>Inbound contact, sales inquiry, custom software, and partnership forms;</li>
                  <li>Interactive product demo bookings and trial registration workflows;</li>
                  <li>Engineering newsletter subscriptions;</li>
                  <li>Customer administration and user accounts accessing DEZORYN platforms.</li>
                </ul>
                <p>
                  This policy does not govern third-party external websites linked from our pages, nor third-party products operating independently of our control.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">4. Information We Collect</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We collect information to provide, maintain, and secure our enterprise software services. Depending on how you interact with us, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Voluntarily provided information:</strong> details you submit directly through forms or email;</li>
                  <li><strong className="text-white">Commercial organizational information:</strong> business entity details for contractual arrangements;</li>
                  <li><strong className="text-white">Automated technical telemetry:</strong> standard server diagnostics, browser characteristics, and non-sensitive session data.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">5. Personal Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  When you engage with our sales representatives, book a demo, or create an administrator account, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Full legal or professional name;</li>
                  <li>Corporate or business email address;</li>
                  <li>Direct phone or WhatsApp contact number;</li>
                  <li>Job title or professional role;</li>
                  <li>Cryptographically hashed account passwords (we never store plain text passwords).</li>
                </ul>
                <p className="text-xs text-cool/70 italic">
                  Note: We do not intentionally collect special category or sensitive personal information (such as political affiliations, genetic data, or biometric data for identification) through public website forms.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">6. Business and Company Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  To tailor enterprise demonstrations and structure software licensing agreements, we collect business-level parameters:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Company or organization name;</li>
                  <li>Country and primary geographical operating region;</li>
                  <li>Organizational headcount range (e.g. 1–10, 11–50, 51–200, 201–1,000, 1,000+);</li>
                  <li>Software solutions of interest (e.g. Enterprise ERP, Hospital Management, School ERP, Logistics Automation);</li>
                  <li>Estimated project budget scope and implementation timelines.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 7
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">7. Technical Information and Cookies</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  When you visit dezoryn.com, our edge network and web servers automatically log standard network telemetry:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Internet Protocol (IP) address;</li>
                  <li>Browser type and version;</li>
                  <li>Operating system and device viewport dimensions;</li>
                  <li>Referring URL and requested page paths;</li>
                  <li>Server response latency and timestamp data.</li>
                </ul>
                <p>
                  <strong className="text-white">Cookies:</strong> We use strictly necessary session cookies and local storage tokens for essential website operation, CSRF security verification, and administrative authentication. We do not use third-party behavioral advertising cookies to track you across unrelated external sites.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="sec-8" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 8
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">8. How We Collect Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>We collect information via three primary channels:</p>
                <ol className="list-decimal list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Direct Interactions:</strong> when you submit forms, correspond with our team, or request product trials;</li>
                  <li><strong className="text-white">Automated Technologies:</strong> when you navigate our website, via server logs and local browser tokens;</li>
                  <li><strong className="text-white">Third-Party Platforms:</strong> if you interact with verified DEZORYN corporate channels (such as WhatsApp Business API or corporate social profiles).</li>
                </ol>
              </div>
            </section>

            {/* Section 9 */}
            <section id="sec-9" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 9
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">9. How We Use Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>The information we collect is utilized strictly for legitimate operational purposes:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>To respond to your inquiries, schedule product demonstrations, and provide sales quotes;</li>
                  <li>To provision and maintain SaaS tenant environments and authenticate administrators;</li>
                  <li>To send transactional emails, such as password recovery links and inquiry confirmations;</li>
                  <li>To detect, prevent, and mitigate cyber threats, fraud, spam, and platform abuse;</li>
                  <li>To deliver subscribed engineering newsletters (with one-click unsubscribe options);</li>
                  <li>To comply with statutory accounting, tax, and legal audit requirements.</li>
                </ul>
                <p className="font-semibold text-white">
                  We NEVER sell, trade, or monetize your personal information to third-party data brokers or marketing agencies.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="sec-10" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 10
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">10. Legal Basis for Processing, Where Applicable</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Where regional data protection frameworks (such as GDPR, UK GDPR, or similar standards) apply, DEZORYN relies on the following legal bases:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Consent:</strong> where you explicitly opt in (e.g. newsletter subscriptions or submitting an inquiry);</li>
                  <li><strong className="text-white">Contractual Performance:</strong> where processing is required to deliver requested software services, trials, or licenses;</li>
                  <li><strong className="text-white">Legitimate Interests:</strong> to secure our systems, maintain network integrity, prevent fraud, and improve application reliability;</li>
                  <li><strong className="text-white">Legal Obligations:</strong> to maintain tax invoices and statutory commercial records.</li>
                </ul>
              </div>
            </section>

            {/* Section 11 */}
            <section id="sec-11" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 11
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">11. Data Sharing and Third-Party Services</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We share data only with trusted enterprise cloud and infrastructure sub-processors under strict confidentiality and security commitments:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 text-xs sm:text-sm">
                  <li><strong className="text-white">Managed Database:</strong> Neon PostgreSQL (SOC 2 Type II compliant cloud database hosting in encrypted clusters);</li>
                  <li><strong className="text-white">Cloud Hosting &amp; Compute:</strong> Render and Vercel for backend API execution and frontend CDN delivery;</li>
                  <li><strong className="text-white">Transactional Email Delivery:</strong> Google Workspace / Gmail SMTP for dispatching automated inquiry confirmations and password reset tokens;</li>
                  <li><strong className="text-white">Direct Communication:</strong> WhatsApp Business API for opted-in customer service messaging;</li>
                  <li><strong className="text-white">Legal Disclosures:</strong> where required by court order, subpoena, or lawful governmental authority.</li>
                </ul>
              </div>
            </section>

            {/* Section 12 — Dedicated Google Play Data Safety Subsection */}
            <section id="sec-12" className="scroll-mt-24 rounded-2xl border border-blue-500/20 bg-[#070f2b] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase font-bold tracking-wider">
                <Smartphone size={15} /> Section 12 &bull; Dedicated Subsection
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                12. Google Services and Google Play Data Safety
              </h2>

              <div className="mt-4 space-y-4 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-4">
                  <h3 className="text-base font-bold text-white">Google Play Data Safety Disclosures</h3>
                  <p className="mt-1 text-xs text-blue-200/90 leading-relaxed">
                    DEZORYN TECHNOLOGY aims to disclose accurately all data collected, shared, and processed by its Android applications in full alignment with Google Play Developer Policies.
                  </p>
                </div>

                <p>
                  For any mobile applications published by DEZORYN TECHNOLOGY on the Google Play Store, we provide the following transparency commitments:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-2 text-xs sm:text-sm">
                  <li><strong className="text-white">Data Collected by Android Applications:</strong> Depending on the specific app, this may include user account credentials (name, email), optional phone numbers for two-factor authentication, and app activity diagnostics (crash stack traces).</li>
                  <li><strong className="text-white">Data Shared with Third Parties:</strong> Application telemetry and analytics are shared only with vetted infrastructure providers for backend execution. We do not sell mobile application data to third-party advertising networks.</li>
                  <li><strong className="text-white">Data Usage Purposes:</strong> Information is collected exclusively for core app functionality, account management, software diagnostics, and customer support.</li>
                  <li><strong className="text-white">Data Security Practices:</strong> All data transmitted between Android applications and our backend is encrypted in transit using standard Transport Layer Security (TLS 1.3).</li>
                  <li><strong className="text-white">Account and Data Deletion Options:</strong> Users can request full deletion of their mobile app accounts and associated records at any time using our dedicated portal at <Link href="/data-deletion" className="text-blue-400 underline">/data-deletion</Link> or in-app account deletion options.</li>
                  <li><strong className="text-white">Data Retention Practices:</strong> Mobile telemetry is retained only for the duration required to maintain operational stability and diagnose software defects.</li>
                </ul>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-cool/90 space-y-2">
                  <p>
                    <strong className="text-white">Compliance Verification Note:</strong> Actual Google Play Data Safety declarations for individual applications must strictly reflect that specific app’s verified codebase, active permissions (such as camera or notification access), third-party SDKs, and backend behavior.
                  </p>
                  <p className="text-cool/70">
                    DEZORYN does not make unsubstantiated claims that an application collects &quot;no data&quot; or &quot;shares no data&quot; unless fully verified against the specific production APK/AAB build.
                  </p>
                  <p className="pt-1">
                    <a
                      href="https://support.google.com/googleplay/android-developer/answer/10144311"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      Official Google Play Data Safety Documentation
                      <ExternalLink size={12} />
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 13 — Dedicated Meta Data Deletion Instructions Subsection */}
            <section id="sec-13" className="scroll-mt-24 rounded-2xl border border-indigo-500/20 bg-[#070b20] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase font-bold tracking-wider">
                <Share2 size={15} /> Section 13 &bull; Dedicated Subsection
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                13. Meta/Facebook Services and Meta Data Deletion Instructions
              </h2>

              <div className="mt-4 space-y-4 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4">
                  <h3 className="text-base font-bold text-white">Meta / Facebook Platform Compliance</h3>
                  <p className="mt-1 text-xs text-indigo-200/90 leading-relaxed">
                    This subsection provides instructions pursuant to Meta Developer Policy (Section 4.f) regarding user data deletion callbacks and manual deletion requests.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-200/90">
                  <strong className="text-white">Integration Scope Notice:</strong> As of the current website release, DEZORYN TECHNOLOGY’s global corporate website uses direct email authentication and does not require Facebook Login. The instructions below apply conditionally to current or future software applications, customer portals, or social integrations utilizing Meta/Facebook services.
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">How Deletion Operates for Meta/Facebook Users:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-xs sm:text-sm">
                    <li><strong className="text-white">Facebook Login Data Access:</strong> If you access an application using Facebook Login, DEZORYN receives basic profile identifiers (such as App-Scoped User ID, name, or email) solely to authenticate your session.</li>
                    <li>
                      <strong className="text-white">How to Request Deletion via Facebook:</strong>
                      <ol className="list-decimal list-inside ml-4 mt-1 space-y-1 text-cool/90">
                        <li>Log in to your Facebook profile and navigate to <strong>Settings &amp; Privacy &gt; Settings</strong>.</li>
                        <li>In the left sidebar, click <strong>Apps and Websites</strong>.</li>
                        <li>Locate <strong>DEZORYN TECHNOLOGY</strong> (or the associated DEZORYN application) and click <strong>Remove</strong>.</li>
                        <li>Click <strong>View Removed Apps and Websites</strong> and click <strong>Send Request</strong> to trigger an automated deletion callback.</li>
                      </ol>
                    </li>
                    <li><strong className="text-white">Direct Request Option:</strong> You may also request deletion of Meta-related data directly through our dedicated <Link href="/data-deletion" className="text-blue-400 underline">Data Deletion Request Portal</Link> or by emailing <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a> with your Facebook User ID.</li>
                    <li><strong className="text-white">How Requests are Processed:</strong> Upon receipt of a valid request, we verify identity, unlink social tokens, and purge associated records from our primary databases within standard operating cycles.</li>
                    <li><strong className="text-white">Temporary Retention Exceptions:</strong> In accordance with statutory law, certain minimal records (such as completed billing invoices or cybersecurity incident records) may be retained temporarily for legal defense or accounting compliance.</li>
                  </ul>
                </div>

                <p className="pt-1">
                  <a
                    href="https://developers.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    Meta for Developers Documentation
                    <ExternalLink size={12} />
                  </a>
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="sec-14" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 14
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">14. Data Storage and Security</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We implement industry-standard technical and organizational security measures to protect your information against unauthorized access, loss, or alteration:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Encryption in Transit:</strong> all communications are enforced over HTTPS utilizing TLS 1.3 encryption;</li>
                  <li><strong className="text-white">Encryption at Rest:</strong> database volumes, tables, and backup snapshots utilize AES-256 standard encryption;</li>
                  <li><strong className="text-white">Tenant Schema Isolation:</strong> multi-tenant SaaS environments enforce logical partitioning so no tenant can access another&apos;s data;</li>
                  <li><strong className="text-white">Credential Safeguards:</strong> user passwords are encrypted using modern bcrypt hashing algorithms;</li>
                  <li><strong className="text-white">Access Restrictions:</strong> internal access to production clusters is limited to authorized personnel under least-privilege principles.</li>
                </ul>
                <p className="text-xs text-cool/70">
                  While we apply enterprise-grade safeguards, no method of transmission over the Internet is 100% immune from security threats. We maintain incident response procedures to address any suspected compromise.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section id="sec-15" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 15
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">15. Data Retention</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We retain personal information only for the period necessary to fulfill the purposes outlined in this policy:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Inquiries and Demo Requests:</strong> retained during the active sales evaluation and follow-up window;</li>
                  <li><strong className="text-white">Customer Account Records:</strong> retained for the duration of the active SaaS subscription agreement;</li>
                  <li><strong className="text-white">Newsletter Subscriptions:</strong> retained until the user unsubscribes or requests deletion;</li>
                  <li><strong className="text-white">Statutory Financial Records:</strong> retained for mandatory tax/statutory periods mandated by local corporate law.</li>
                </ul>
              </div>
            </section>

            {/* Section 16 */}
            <section id="sec-16" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 16
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">16. User Privacy Rights</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Depending on your jurisdiction (such as GDPR in Europe, CCPA/CPRA in California, or DPDPA in India), you may have statutory rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong className="text-white">Right of Access:</strong> request confirmation and copies of personal data we hold about you;</li>
                  <li><strong className="text-white">Right of Rectification:</strong> request correction of inaccurate or incomplete records;</li>
                  <li><strong className="text-white">Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> request permanent deletion of your personal records;</li>
                  <li><strong className="text-white">Right to Restrict or Object:</strong> object to or limit specific processing activities;</li>
                  <li><strong className="text-white">Right to Data Portability:</strong> receive your data in a structured, commonly used format;</li>
                  <li><strong className="text-white">Right to Withdraw Consent:</strong> withdraw previously granted consent at any time without penalty.</li>
                </ul>
                <p className="text-xs text-cool/80">
                  To exercise any of these rights, contact our Data Protection Officer at <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a>.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section id="sec-17" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 17
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">17. Children&apos;s Privacy</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN TECHNOLOGY’s website, enterprise SaaS platforms, and software services are designed exclusively for commercial business enterprises and professional organizations. We do not knowingly solicit or collect personal information from individuals under the age of 18 (or the applicable age of minority in your jurisdiction).
                </p>
                <p>
                  If you become aware that a minor has provided us with personal information without parental or legal guardian consent, please contact us immediately at privacy@dezoryn.com so we can investigate and promptly purge such records.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="sec-18" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 18
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">18. International Data Transfers, Where Applicable</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN TECHNOLOGY operates multi-region cloud infrastructure. Your personal information may be stored and processed in secure cloud servers located outside your country of residence (such as cloud facilities in the United States, Europe, or India).
                </p>
                <p>
                  Where cross-border data transfers occur, we implement recognized contractual safeguards, including standard contractual clauses (SCCs) and data processing agreements, to ensure an equivalent standard of protection regardless of processing jurisdiction.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section id="sec-19" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 19
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">19. Data Deletion and Account Deletion</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Users and customer organizations have the right to request permanent deletion of their account credentials, inquiries, and associated data.
                </p>
                <p>
                  To provide a seamless, accountable mechanism, we maintain a dedicated public portal:
                </p>
                <div className="pt-2">
                  <Link
                    href="/data-deletion"
                    className="inline-flex items-center gap-2 rounded-xl bg-electric/15 border border-electric/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-300 hover:bg-electric/25 transition"
                  >
                    <Lock size={15} />
                    Open Dedicated Data Deletion Request Page &rarr;
                  </Link>
                </div>
                <p className="text-xs text-cool/80 pt-2">
                  All requests undergo identity verification prior to permanent purging to prevent malicious or accidental disruption of enterprise operations.
                </p>
              </div>
            </section>

            {/* Section 20 */}
            <section id="sec-20" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 20
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">20. Changes to this Policy</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We may update this Privacy Policy periodically to reflect enhancements in our software platforms, regulatory modifications, or security improvements. When updates occur, we will revise the &quot;Effective Date&quot; at the top of this document.
                </p>
                <p>
                  For material changes that significantly affect how personal data is handled, we will provide prominent notice on our website or via email to registered administrators prior to the change taking effect.
                </p>
              </div>
            </section>

            {/* Section 21 */}
            <section id="sec-21" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 21
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">21. Contact Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  If you have questions, comments, or requests regarding this Privacy Policy or our data protection practices, please contact our Data Protection Office:
                </p>
                <div className="rounded-xl border border-white/10 bg-black/40 p-5 text-xs sm:text-sm font-mono space-y-2 text-cool">
                  <div><strong className="text-white">Organization:</strong> DEZORYN TECHNOLOGY PRIVATE LIMITED</div>
                  <div><strong className="text-white">Attention:</strong> Data Protection Officer / Corporate Counsel</div>
                  <div><strong className="text-white">Email:</strong> <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a> / <a href="mailto:dezoryntech@gmail.com" className="text-blue-400 underline">dezoryntech@gmail.com</a></div>
                  <div><strong className="text-white">Official Phone:</strong> +91 7777804850</div>
                  <div><strong className="text-white">Registered Office:</strong> Bhopal, Madhya Pradesh, India <span className="text-amber-400 text-[11px]">[Full address on file with corporate registrar]</span></div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* ─── FOOTER CONTACT CARD ─── */}
        <div className="mt-16 rounded-2xl border border-line bg-graphite/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-white text-base">
              Have specific privacy or compliance questions?
            </div>
            <p className="text-xs sm:text-sm text-cool mt-1">
              Our Data Protection Officer and compliance team are available to assist you.
            </p>
          </div>
          <Link href="/contact" className="btn btn-secondary h-10 px-5 text-xs shrink-0 cursor-pointer">
            Contact Compliance Office &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
