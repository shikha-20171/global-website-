import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { FileText, ShieldCheck, AlertTriangle, ArrowRight, Lock, ExternalLink } from "lucide-react";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms & Conditions | DEZORYN TECHNOLOGY",
  description:
    "Official Terms & Conditions governing access to DEZORYN TECHNOLOGY corporate website, SaaS marketplace, software licensing, and cloud services.",
  path: "/terms-and-conditions",
  keywords: [
    "DEZORYN terms and conditions",
    "software license agreement",
    "SaaS subscription terms",
    "commercial website terms",
    "acceptable use rules",
  ],
});

export const dynamic = "force-dynamic";

export default function TermsAndConditionsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms & Conditions", url: "/terms-and-conditions" },
  ]);

  const sections = [
    { id: "sec-1", num: "1", title: "Introduction" },
    { id: "sec-2", num: "2", title: "Acceptance of Terms" },
    { id: "sec-3", num: "3", title: "About DEZORYN TECHNOLOGY" },
    { id: "sec-4", num: "4", title: "Website Usage" },
    { id: "sec-5", num: "5", title: "Products and Services" },
    { id: "sec-6", num: "6", title: "SaaS Products and Subscriptions" },
    { id: "sec-7", num: "7", title: "User Accounts" },
    { id: "sec-8", num: "8", title: "Account Security" },
    { id: "sec-9", num: "9", title: "Intellectual Property" },
    { id: "sec-10", num: "10", title: "Software Licensing" },
    { id: "sec-11", num: "11", title: "User Responsibilities" },
    { id: "sec-12", num: "12", title: "Prohibited Activities" },
    { id: "sec-13", num: "13", title: "Payments, Pricing and Billing" },
    { id: "sec-14", num: "14", title: "Cancellation and Refunds" },
    { id: "sec-15", num: "15", title: "Third-Party Services" },
    { id: "sec-16", num: "16", title: "Website Availability" },
    { id: "sec-17", num: "17", title: "Disclaimer" },
    { id: "sec-18", num: "18", title: "Limitation of Liability" },
    { id: "sec-19", num: "19", title: "Indemnification" },
    { id: "sec-20", num: "20", title: "Suspension and Termination" },
    { id: "sec-21", num: "21", title: "Governing Law and Jurisdiction" },
    { id: "sec-22", num: "22", title: "Changes to Terms" },
    { id: "sec-23", num: "23", title: "Contact Information" },
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
            { label: "Terms & Conditions" },
          ]}
        />

        {/* ─── HEADER ─── */}
        <header className="mt-8 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-3 font-mono">
            <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
              Commercial Terms of Service
            </span>
            <span>Effective Date: October 2026</span>
            <span>Version 2.3</span>
          </div>

          <h1 className="h-display text-3xl sm:text-4xl lg:text-5xl text-white">
            Terms &amp; Conditions
          </h1>

          <p className="lead mt-4 text-cool max-w-3xl leading-relaxed">
            These Terms &amp; Conditions govern your access to and use of DEZORYN TECHNOLOGY’s corporate website, software-as-a-service (SaaS) marketplace, customer portals, APIs, and associated enterprise digital services.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-cool hover:text-white hover:border-white/20 transition"
            >
              <ShieldCheck size={13} className="text-electric" />
              Privacy Policy
            </Link>
            <Link
              href="/data-deletion"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-cool hover:text-white hover:border-white/20 transition"
            >
              <Lock size={13} className="text-electric" />
              Data Deletion Requests
            </Link>
          </div>
        </header>

        {/* ─── NOTICE CALLOUT ─── */}
        <div className="my-8 rounded-xl border border-white/10 bg-[#070b16] p-5 flex items-start gap-3.5">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-cool leading-relaxed">
            <strong className="text-white">Legal Notice:</strong> Please read these Terms &amp; Conditions carefully before accessing our platforms. If you are entering into this agreement on behalf of a business organization, you represent that you possess the necessary authority to bind that legal entity. Where enterprise Master Services Agreements (MSAs) are formally executed, the specific terms of the MSA govern over general website terms.
          </p>
        </div>

        {/* ─── TWO COLUMN LAYOUT: TABLE OF CONTENTS + 23 SECTIONS ─── */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block sticky top-24 rounded-2xl border border-white/10 bg-[#070b16] p-5 max-h-[calc(100vh-7rem)] overflow-y-auto [scrollbar-width:thin]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Contents
              </span>
              <span className="text-[11px] font-mono text-cool">23 Sections</span>
            </div>
            <nav className="space-y-1 text-xs" aria-label="Terms Table of Contents">
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

          {/* Main 23 Sections Container */}
          <main className="space-y-10 min-w-0">
            {/* Section 1 */}
            <section id="sec-1" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">1. Introduction</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  These Terms &amp; Conditions constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;Customer&quot;) and DEZORYN TECHNOLOGY (&quot;DEZORYN&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>
                <p>
                  These terms govern your visit to our website (dezoryn.com), participation in software product evaluations, submission of inquiry forms, and access to any software products, cloud workspaces, documentation, and APIs provided by DEZORYN.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">2. Acceptance of Terms</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  By accessing, browsing, or utilizing any portion of the DEZORYN website or associated software applications, you expressly acknowledge that you have read, understood, and agreed to be bound by these Terms &amp; Conditions.
                </p>
                <p>
                  If you do not agree with any part of these terms, you must discontinue your use of our website and software platforms immediately.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">3. About DEZORYN TECHNOLOGY</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN TECHNOLOGY is an enterprise digital solutions provider developing multi-tenant software platforms across education, healthcare, real estate, logistics, human resources, and business automation verticals.
                </p>
                <p className="text-xs sm:text-sm text-cool/80 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <strong className="text-white">Corporate Entity:</strong> DEZORYN TECHNOLOGY PRIVATE LIMITED<br />
                  <strong className="text-white">Official Website:</strong> https://www.dezoryn.com<br />
                  <strong className="text-white">Operational Jurisdiction:</strong> India <span className="text-amber-400 font-mono text-[11px]">[Full corporate registration identifiers on file with the Registrar of Companies]</span><br />
                  <strong className="text-white">Contact Email:</strong> contact@dezoryn.com / dezoryntech@gmail.com
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">4. Website Usage</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  You may use our public website for legitimate informational and commercial evaluation purposes. You agree not to disrupt website operations, interfere with server infrastructure, probe network security, or attempt to access restricted administrative pathways.
                </p>
                <p>
                  We reserve the right to restrict or terminate access to any user or IP address found engaging in abusive, automated scraping, or malicious activities.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">5. Products and Services</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN TECHNOLOGY offers proprietary software platforms, custom software development services, cloud architectural consulting, and AI workflow integration.
                </p>
                <p>
                  Descriptions, feature matrices, and pricing displayed on our website represent current product specifications and may be updated or modified as our platforms evolve. Specific feature availability and contractual deliverables are determined by written order forms or statements of work.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">6. SaaS Products and Subscriptions</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Access to DEZORYN SaaS platforms is provided on a recurring subscription basis. Subscriptions are billed in advance on monthly or annual terms as designated at checkout or in enterprise sales agreements.
                </p>
                <p>
                  Subscribers are granted a limited, non-exclusive, non-transferable right to access their provisioned tenant workspace for the paid term, subject to compliance with these terms and active tier user/resource quotas.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 7
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">7. User Accounts</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  To access administrative capabilities or subscriber workspaces, you must maintain an active user account. When creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Provide accurate, current, and complete corporate registration information;</li>
                  <li>Maintain and promptly update account records to keep them accurate;</li>
                  <li>Ensure user accounts are assigned to individuals and not shared across multiple personnel in circumvention of plan quotas.</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section id="sec-8" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 8
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">8. Account Security</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  You are solely responsible for maintaining the confidentiality of your account credentials, passwords, and multi-factor authentication devices.
                </p>
                <p>
                  You agree to notify DEZORYN immediately at <a href="mailto:security@dezoryn.com" className="text-blue-400 underline">security@dezoryn.com</a> if you discover or suspect any unauthorized access to your account or any other breach of security. DEZORYN is not liable for losses resulting from compromised credentials under your control.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="sec-9" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 9
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">9. Intellectual Property</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  All software code, database schemas, algorithms, user interfaces, branding, visual designs, graphics, text, documentation, and marks are the exclusive intellectual property of DEZORYN TECHNOLOGY or its licensors.
                </p>
                <p>
                  Nothing in these terms transfers ownership of any intellectual property rights to you. Customer retains full ownership of their raw business data uploaded into their tenant database.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="sec-10" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 10
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">10. Software Licensing</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Subject to your compliance with these terms and payment of applicable fees, DEZORYN grants you a non-exclusive, non-sublicensable, non-transferable, revocable license to access and use the subscribed software platforms solely for your internal business operations.
                </p>
                <p>
                  You shall not sublicense, rent, lease, distribute, or make the software available on a service bureau basis to unauthorized third parties without our prior written consent.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="sec-11" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 11
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">11. User Responsibilities</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>As a user of our platforms, you agree to:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Comply with all applicable local, national, and international laws and regulations;</li>
                  <li>Ensure all personnel accessing your tenant environment are authorized and trained;</li>
                  <li>Maintain appropriate backups of your operational data exported from the system;</li>
                  <li>Obtain any necessary consents from your end users prior to entering their personal data into our platforms.</li>
                </ul>
              </div>
            </section>

            {/* Section 12 */}
            <section id="sec-12" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 12
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">12. Prohibited Activities</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>You agree not to engage in any of the following prohibited activities:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Reverse engineering, decompiling, disassembling, or extracting source code from our platforms;</li>
                  <li>Probing, scanning, or testing vulnerabilities of our infrastructure without prior written authorization;</li>
                  <li>Attempting to bypass authentication, tenant schema partitioning, or access restrictions;</li>
                  <li>Using automated scripts, bots, or scrapers to extract data without API authorization;</li>
                  <li>Transmitting malicious software, worms, trojans, or destructive code;</li>
                  <li>Using the service for fraudulent activities, phishing, or sending unsolicited mass commercial email (spam).</li>
                </ul>
              </div>
            </section>

            {/* Section 13 */}
            <section id="sec-13" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 13
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">13. Payments, Pricing and Billing</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Pricing for software subscriptions and custom services is displayed in United States Dollars (USD) or as agreed upon in official commercial quotations.
                </p>
                <p>
                  Payment is due upon invoice issuance or via automated recurring payment methods. If payment fails or is overdue, DEZORYN reserves the right to suspend platform access until outstanding balances are resolved. All fees are exclusive of applicable taxes, withholding duties, or sales taxes, which are the customer&apos;s responsibility.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="sec-14" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 14
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">14. Cancellation and Refunds</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  <strong className="text-white">Subscription Cancellation:</strong> You may cancel your subscription renewal at any time through your workspace administrative settings or by contacting your account manager. Cancellation takes effect at the end of the current paid billing cycle, during which platform access remains active.
                </p>
                <p>
                  <strong className="text-white">Refund Eligibility:</strong> Because cloud resources and infrastructure licenses are provisioned immediately upon purchase, fees paid for monthly subscriptions and custom milestone engineering services are non-refundable. <span className="text-amber-400 font-mono text-[11px]">[Specific refund eligibility grace periods to be confirmed by DEZORYN Financial Counsel]</span>.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section id="sec-15" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 15
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">15. Third-Party Services</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Our website and platforms may integrate with or link to third-party services (such as cloud database providers, email delivery networks, payment gateways, or documentation repositories).
                </p>
                <p>
                  DEZORYN is not responsible for the availability, content, or practices of third-party platforms. Your interaction with third-party tools is governed by their respective terms and privacy policies.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section id="sec-16" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 16
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">16. Website Availability</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  We strive to maintain continuous availability of our corporate website and cloud platforms, targeting a 99.9% uptime benchmark. However, we cannot guarantee uninterrupted access.
                </p>
                <p>
                  Routine maintenance windows, emergency security patches, cloud provider outages, or network connectivity disruptions may cause temporary downtime. DEZORYN will make reasonable efforts to announce scheduled maintenance in advance.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section id="sec-17" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 17
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">17. Disclaimer</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  Except as expressly provided in a signed commercial agreement, the website, products, and services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express, implied, statutory, or otherwise.
                </p>
                <p>
                  DEZORYN disclaims all warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do not warrant that our software will be entirely bug-free or meet all specific operational requirements not documented in our specifications.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="sec-18" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 18
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">18. Limitation of Liability</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  To the maximum extent permitted by applicable law, in no event shall DEZORYN TECHNOLOGY, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data loss, business interruption, or goodwill.
                </p>
                <p>
                  DEZORYN’s total aggregate liability arising out of or related to these terms or use of the services shall not exceed the total fees paid by you to DEZORYN in the twelve (12) months preceding the incident giving rise to liability.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section id="sec-19" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 19
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">19. Indemnification</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  You agree to defend, indemnify, and hold harmless DEZORYN TECHNOLOGY and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, losses, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or relating to:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Your violation of these Terms &amp; Conditions;</li>
                  <li>Your misuse of our software platforms or APIs;</li>
                  <li>Any business data or content you enter that infringes third-party intellectual property or privacy rights.</li>
                </ul>
              </div>
            </section>

            {/* Section 20 */}
            <section id="sec-20" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 20
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">20. Suspension and Termination</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN reserves the right to suspend or terminate your access to our website or provisioned software workspaces immediately, with or without prior notice, if:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>You materially breach any provision of these terms;</li>
                  <li>Your account has overdue unpaid subscription fees;</li>
                  <li>Your usage poses a genuine security risk to other tenant environments or infrastructure integrity;</li>
                  <li>We are required to do so by applicable legal process or government authority.</li>
                </ul>
                <p className="text-xs text-cool/80">
                  Upon termination, your right to access the platforms ceases. Provisions that by their nature should survive termination shall survive (including intellectual property, disclaimers, and limitation of liability).
                </p>
              </div>
            </section>

            {/* Section 21 */}
            <section id="sec-21" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 21
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">21. Governing Law and Jurisdiction</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  These Terms &amp; Conditions, and any disputes or claims arising out of or in connection with them, shall be governed by and construed in accordance with the substantive laws of India, without regard to conflict of law principles.
                </p>
                <p className="text-xs sm:text-sm text-cool/90 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <strong className="text-white">Designated Dispute Resolution Jurisdiction:</strong> <span className="text-amber-400 font-mono text-[11px]">[Designated Jurisdiction: The competent courts located in Bhopal, Madhya Pradesh, India, shall have exclusive jurisdiction over any legal proceedings arising hereunder, unless specified otherwise in an executed enterprise Master Services Agreement]</span>.
                </p>
              </div>
            </section>

            {/* Section 22 */}
            <section id="sec-22" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 22
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">22. Changes to Terms</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  DEZORYN reserves the right to modify or amend these Terms &amp; Conditions at our sole discretion. When modifications occur, we will update the &quot;Effective Date&quot; at the top of this document.
                </p>
                <p>
                  Your continued use of our website or software platforms following the posting of revised terms indicates your acceptance of the changes. We encourage you to review this page periodically.
                </p>
              </div>
            </section>

            {/* Section 23 */}
            <section id="sec-23" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#070b16] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-electric text-xs font-mono uppercase font-bold tracking-wider">
                Section 23
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">23. Contact Information</h2>
              <div className="mt-4 space-y-3 text-sm sm:text-base text-cool leading-relaxed font-normal">
                <p>
                  If you have questions, comments, or legal inquiries concerning these Terms &amp; Conditions, please contact our legal and corporate administration team:
                </p>
                <div className="rounded-xl border border-white/10 bg-black/40 p-5 text-xs sm:text-sm font-mono space-y-2 text-cool">
                  <div><strong className="text-white">Company Name:</strong> DEZORYN TECHNOLOGY PRIVATE LIMITED</div>
                  <div><strong className="text-white">Attention:</strong> Legal Department &amp; Corporate Counsel</div>
                  <div><strong className="text-white">Email:</strong> <a href="mailto:legal@dezoryn.com" className="text-blue-400 underline">legal@dezoryn.com</a> / <a href="mailto:dezoryntech@gmail.com" className="text-blue-400 underline">dezoryntech@gmail.com</a></div>
                  <div><strong className="text-white">Phone:</strong> +91 7777804850</div>
                  <div><strong className="text-white">Registered Office:</strong> Bhopal, Madhya Pradesh, India <span className="text-amber-400 text-[11px]">[Full registered address on file with corporate registrar]</span></div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* ─── FOOTER CONTACT CARD ─── */}
        <div className="mt-16 rounded-2xl border border-line bg-graphite/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-white text-base">
              Need custom enterprise licensing or SLA terms?
            </div>
            <p className="text-xs sm:text-sm text-cool mt-1">
              Our enterprise sales and legal teams can structure customized Master Services Agreements (MSAs).
            </p>
          </div>
          <Link href="/contact-sales" className="btn btn-secondary h-10 px-5 text-xs shrink-0 cursor-pointer">
            Talk to Enterprise Sales &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
