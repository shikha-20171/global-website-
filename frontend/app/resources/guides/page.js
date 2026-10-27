import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import {
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Terminal,
  Code2,
  Database,
  Layers,
  ArrowRight,
} from "lucide-react";

import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Engineering Implementation Guides & Production Runbooks — DEZORYN Resources",
  description:
    "Production-tested implementation playbooks, zero-downtime database runbooks, API execution checklists, and cutover protocols.",
  path: "/resources/guides",
  keywords: [
    "engineering guides",
    "zero downtime migration runbook",
    "production implementation playbooks",
    "API integration guides",
    "DEZORYN runbooks",
  ],
});

const playbooks = [
  {
    id: "zero-downtime-migration",
    title: "Zero-Downtime Database Migration Runbook",
    tag: "Database & DevOps",
    icon: Database,
    timeline: "Execution Time: ~45 Minutes",
    summary:
      "A battle-tested operational guide for applying non-blocking schema modifications, index creations, and tenant partition splits on high-throughput PostgreSQL databases.",
    prerequisites: [
      "PostgreSQL 14+ with pg_stat_statements enabled",
      "PgBouncer connection pooler in transaction mode",
      "Automated staging replica verified against recent production snapshot",
    ],
    phases: [
      "Step 1: Add new nullable columns or tables additively (never DROP or RENAME columns live).",
      "Step 2: Deploy dual-writing application microservice writing to both legacy and new structures.",
      "Step 3: Backfill historical records using throttled background worker batches.",
      "Step 4: Switch read queries to new schema and verify zero replication lag.",
      "Step 5: Safely deprecate and contract legacy schema paths after 14-day validation window.",
    ],
    codeSnippet: `ALTER TABLE tenant_ledgers ADD COLUMN IF NOT EXISTS status_v2 VARCHAR(32);
CREATE INDEX CONCURRENTLY idx_ledgers_tenant_status 
ON tenant_ledgers (tenant_id, status_v2);`,
  },
  {
    id: "saml-oauth-integration",
    title: "SAML 2.0 & OAuth 2.0 PKCE Enterprise SSO Playbook",
    tag: "Identity & RBAC",
    icon: ShieldCheck,
    timeline: "Execution Time: ~30 Minutes",
    summary:
      "Step-by-step technical guide for configuring single sign-on (SSO) with enterprise Identity Providers (Okta, Microsoft Entra ID, Google Workspace) using scoped OAuth 2.0 tokens.",
    prerequisites: [
      "Configured IdP application with ACS URL and Entity ID",
      "TLS 1.3 certificate bound to custom corporate domain",
      "Active DEZORYN Super Administrator credentials",
    ],
    phases: [
      "Step 1: Exchange SAML metadata XML endpoints in DEZORYN Security Console.",
      "Step 2: Map IdP attribute claims (email, firstName, lastName, departmentGroups) to DEZORYN roles.",
      "Step 3: Configure PKCE code challenge verification for mobile and single-page apps.",
      "Step 4: Execute end-to-end IdP-initiated login test in isolated staging sandbox.",
      "Step 5: Enforce mandatory SSO policy with grace periods for external contractors.",
    ],
    codeSnippet: `curl -X POST https://api.dezoryn.cloud/v1/auth/sso/configure \\
  -H "Authorization: Bearer sec_live_..." \\
  -d '{"idp_metadata_url": "https://identity.customer.com/metadata"}'`,
  },
  {
    id: "webhook-reliability-guide",
    title: "High-Throughput Webhook Delivery & Retry Playbook",
    tag: "Integrations & APIs",
    icon: Zap,
    timeline: "Execution Time: ~20 Minutes",
    summary:
      "How to consume real-time event webhooks with guaranteed delivery, cryptographic HMAC-SHA256 signature verification, and exponential backoff handling.",
    prerequisites: [
      "Public HTTPS webhook receiver with valid TLS certificate",
      "Redis or RabbitMQ queue for asynchronous event processing",
      "Shared webhook secret token configured in DEZORYN Developer Hub",
    ],
    phases: [
      "Step 1: Validate inbound X-Dezoryn-Signature header using constant-time string comparison.",
      "Step 2: Acknowledge payload with immediate HTTP 200 OK before processing heavy business logic.",
      "Step 3: Push payload into worker queue with event ID for idempotent deduplication.",
      "Step 4: Configure automatic dead-letter queue (DLQ) alerts for failed downstream handler attempts.",
    ],
    codeSnippet: `const signature = req.headers["x-dezoryn-signature"];
const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  return res.status(401).send("Invalid Signature");
}`,
  },
  {
    id: "data-sanitization-cutover",
    title: "Legacy Data Sanitization & Staging Cutover Protocol",
    tag: "Migration & Architecture",
    icon: Layers,
    timeline: "Execution Time: ~2 to 4 Hours",
    summary:
      "A structured checklist for extracting dirty historical records from paper or desktop software, running deduplication algorithms, and loading sanitized data into DEZORYN cloud schemas.",
    prerequisites: [
      "CSV/JSON extraction of master entities (students, patients, property units, ledgers)",
      "Standard schema mapping template provided by DEZORYN engineering",
      "Stakeholder sign-off on historical balance reconciliation rules",
    ],
    phases: [
      "Step 1: Run automated syntax validation to catch missing foreign keys and invalid email formats.",
      "Step 2: Execute fuzzy matching to identify and merge duplicate customer accounts.",
      "Step 3: Load staged records into an isolated preview tenant for administrative sign-off.",
      "Step 4: Execute weekend delta cutover: freeze legacy updates and apply incremental writes.",
      "Step 5: Compare opening ledger balances between legacy and cloud systems for 100% parity.",
    ],
    codeSnippet: `npx @dezoryn/migrate-cli ingest \\
  --source ./legacy-export.csv \\
  --target tenant_prod_gamma \\
  --dry-run --validate-relations`,
  },
];

export default function GuidesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "Implementation Guides", url: "/resources/guides" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Implementation Guides" },
            ]}
          />

          <div className="max-w-5xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <Terminal size={13} className="text-electric" />
              <span>PRODUCTION MANUALS &amp; DEPLOYMENT RUNBOOKS</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              Engineering Implementation Guides.
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Step-by-step operational runbooks, zero-downtime database migration checklists, and API execution protocols designed for engineering leads and systems architects.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-xs font-mono text-cool border-t border-line/60 pt-6">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> Production Battle-Tested
              </div>
              <div className="flex items-center gap-1.5 text-electric">
                <ShieldCheck size={14} /> Zero-Downtime Safe
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap size={14} /> Copy-Paste Code Snippets
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Playbooks Section */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="space-y-10">
            {playbooks.map((pb, idx) => {
              const IconComp = pb.icon;
              return (
                <Reveal key={pb.id} delay={idx * 0.05}>
                  <div className="card border-white/10 bg-[#070b16] p-7 sm:p-9 rounded-2xl transition-all duration-300 hover:border-electric/40 hover:shadow-2xl hover:shadow-electric/10">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/30 bg-electric/10 text-electric">
                            <IconComp size={18} />
                          </span>
                          <span className="tag text-xs font-mono border-electric/30 bg-electric/10 text-electric">
                            {pb.tag}
                          </span>
                          <span className="text-xs font-mono text-cool/80">{pb.timeline}</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-3">
                          {pb.title}
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-cool leading-relaxed max-w-3xl">
                          {pb.summary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-mono text-white/90 uppercase tracking-wider mb-3">
                          Operational Execution Phases
                        </h3>
                        <div className="space-y-2">
                          {pb.phases.map((ph, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5 text-xs text-cool/90 leading-relaxed font-sans">
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric/20 text-[10px] font-mono text-electric">
                                {pIdx + 1}
                              </span>
                              <span>{ph}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono text-white/90 uppercase tracking-wider mb-3">
                          Executable Code / Command
                        </h3>
                        <div className="rounded-xl border border-white/10 bg-[#04060d] p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                          <pre>
                            <code>{pb.codeSnippet}</code>
                          </pre>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-[11px] font-mono text-cool/70 uppercase mb-1.5">
                            Key Prerequisites:
                          </h4>
                          <ul className="space-y-1 text-[11px] text-cool/80">
                            {pb.prerequisites.map((pre, prIdx) => (
                              <li key={prIdx} className="flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-electric" />
                                <span>{pre}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Planning a Complex System Migration?"
        text="Our solutions engineering team assists with end-to-end data cutovers, schema reviews, and staging verification."
        primary={["Consult Migration Engineers", "/contact-sales"]}
        secondary={["Explore Developer APIs", "/resources/api"]}
      />
    </>
  );
}
