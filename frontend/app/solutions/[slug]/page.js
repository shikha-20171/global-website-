import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { getProduct, projects } from "@/lib/data";
import api from "@/lib/axios";
import { buildMetadata, generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";
import {
  Layers,
  Sparkles,
  Workflow,
  Code2,
  RefreshCw,
  Cloud,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Lock,
  Server,
  Database,
  Cpu,
  Globe2,
  Terminal,
  Activity,
  Check,
  BarChart3,
  KeyRound,
  FileClock,
  ShieldAlert,
  GitBranch,
} from "lucide-react";

const solutionsData = {
  enterprise: {
    slug: "enterprise",
    title: "Enterprise Solutions",
    tagline: "Mission-Critical Systems. Built for Complexity. Designed for Scale.",
    badge: "GLOBAL ENTERPRISE ARCHITECTURE",
    description:
      "DEZORYN Enterprise Solutions delivers resilient, high-concurrency cloud software architectures engineered specifically for multi-tenant corporations, multinational educational networks, healthcare conglomerates, and high-volume financial institutions. Built with strict cryptographic boundary isolation, sub-30ms global API latency, and zero-compromise regulatory compliance.",
    problemHeading: "Why Multi-Branch Monoliths Break Down at Scale",
    problemSubtext: "When large enterprises attempt to run dozens of regional subsidiaries, colleges, or healthcare clinics on fragmented legacy monoliths, cross-tenant leaks, database deadlocks, and audit failures multiply exponentially.",
    guarantees: [
      "Kernel-Level PostgreSQL Row-Level Security (RLS)",
      "Sub-30ms Edge Gateway Routing Globally",
      "Cryptographically Isolated Tenant Database Schemas",
      "Contractual 99.99% Availability & Disaster Recovery SLA",
    ],
    narrative: [
      "Modern enterprise operations cannot tolerate the fragility of legacy software monoliths or the security vulnerabilities of pooled public cloud databases. As organizations expand across geographic territories and regional operating subsidiaries, their operational software must scale horizontally while guaranteeing ironclad data residency, tenant isolation, and regulatory compliance.",
      "DEZORYN architects and deploys modular enterprise platforms that dismantle departmental silos. By decoupling monolithic data layers into high-throughput microservices and enforcing kernel-level PostgreSQL Row-Level Security (RLS) with dynamic tenant context injection, our systems handle tens of thousands of concurrent transactions with zero performance degradation or cross-tenant risk.",
      "From unified ERP systems coordinating campus networks to automated financial reconciliation ledgers, our enterprise solutions provide executive leadership with a single, cryptographically verified source of operational truth across every branch, department, and digital touchpoint."
    ],
    icon: Layers,
    image: "/resources/multi-tenant-db.jpg",
    blueprintTitle: "Multi-Tenant Distributed Cluster Architecture",
    telemetry: {
      uptime: "99.99% SLA",
      latency: "P95 < 28ms",
      encryption: "AES-256-GCM / TLS 1.3",
      isolation: "Tenant Schema Isolation",
    },
    pillarHeading: "Architectural Foundations of Enterprise Scale",
    pillarSubtext: "Six core architectural pillars engineered into every DEZORYN enterprise deployment to ensure total data boundaries and zero performance degradation.",
    capabilities: [
      {
        title: "Multi-Tenant Cryptographic Partitioning",
        desc: "Complete logical and schema-level data separation per organizational entity. Session-injected tenant claims guarantee that queries never traverse boundary partitions, eliminating cross-tenant leakage at the kernel database level.",
      },
      {
        title: "Enterprise Single Sign-On & Dynamic RBAC",
        desc: "SAML 2.0 and OAuth 2.0 PKCE identity federations integrating natively with Okta, Microsoft Azure Active Directory, and Google Workspace. Dynamic Attribute-Based Access Control (ABAC) restricts data access by IP, role, and time window.",
      },
      {
        title: "High-Throughput Microservice APIs",
        desc: "RESTful v1 JSON endpoints and low-latency gRPC services capable of handling 20,000+ operations per second. Features Redis token-bucket rate limiting to protect shared compute clusters from noisy-neighbor saturation.",
      },
      {
        title: "Immutable Compliance Audit Telemetry",
        desc: "Cryptographically signed append-only transaction logs. Every record creation, update, export, and privilege elevation streams in real time directly to enterprise SIEM platforms like Datadog, Splunk, and AWS CloudWatch.",
      },
      {
        title: "Distributed Data Sharding & Failover",
        desc: "Active-active database replication across regional availability zones. Automatic health-checked failovers switch traffic in under 3 seconds with zero transactional data loss (RPO = 0, RTO < 5s).",
      },
      {
        title: "Zero-Downtime Schema Migrations",
        desc: "Expand-and-contract database migration patterns that upgrade relational data schemas across thousands of tenant accounts concurrently with zero scheduled downtime or user interruption.",
      },
    ],
    workflowTitle: "Enterprise Platform Deployment Lifecycle",
    workflowSubtext: "A structured, milestone-driven transition model designed to eliminate risk and ensure mathematically proven cutover across regional entities.",
    workflow: [
      { phase: "Phase 1: Architecture Audit & Data Topology", duration: "Weeks 1–2", desc: "Comprehensive discovery of existing enterprise databases, user access matrices, compliance mandates, and peak throughput benchmarks." },
      { phase: "Phase 2: Schema Isolation & Security Blueprint", duration: "Weeks 3–4", desc: "Mathematical verification of tenant boundaries, API gateway route definitions, KMS key hierarchy configuration, and CI/CD security pipelines." },
      { phase: "Phase 3: Sandbox Prototyping & Load Testing", duration: "Weeks 5–6", desc: "Deployment of an isolated enterprise staging environment subjected to 10x peak synthetic load testing and third-party penetration audits." },
      { phase: "Phase 4: Staged Dual-Run Migration", duration: "Weeks 7–8", desc: "Parallel-run synchronization between legacy monoliths and DEZORYN cloud microservices to prove ledger and database parity." },
      { phase: "Phase 5: Production Cutover & 24/7 Managed SRE", duration: "Ongoing", desc: "Seamless DNS cutover with dedicated solutions architect standby, real-time APM telemetry, and contractual 99.99% uptime guarantees." },
    ],
    benchmarkTitle: "Verified Enterprise Performance Benchmarks",
    benchmarks: [
      { value: "99.99%", label: "Contractual Enterprise SLA Uptime" },
      { value: "< 28ms", label: "P95 Global API Gateway Latency" },
      { value: "Zero", label: "Cross-Tenant Data Boundary Violations" },
      { value: "-65%", label: "Total Cost of Ownership vs Monoliths" },
    ],
    securityTitle: "Multi-Tenant Compliance & Audit Verification",
    securityDesc: "Every database mutation is verified against tenant claims, external communications are guarded with TLS 1.3, and all data at rest is encrypted using dedicated AWS KMS customer-managed keys (CMKs).",
    securityBadges: [
      { name: "SOC 2 Type II", desc: "Audited Controls" },
      { name: "ISO 27001", desc: "Information Security" },
      { name: "GDPR / CCPA", desc: "Data Sovereignty" },
      { name: "HIPAA Vault", desc: "Protected Records" },
    ],
    faqs: [
      ["How does DEZORYN guarantee data isolation between enterprise subsidiaries?", "We enforce PostgreSQL Row-Level Security (RLS) coupled with session-injected tenant context claims on every database transaction. Even if application code were compromised, the underlying database kernel refuses to return rows that do not match the authenticated tenant ID."],
      ["Can we deploy DEZORYN Enterprise Solutions on our own private AWS or GCP VPC?", "Yes. While our multi-tenant SaaS cloud delivers sub-second global performance, enterprise tiers can be deployed directly into customer-owned Virtual Private Clouds (VPC) on AWS, Google Cloud, or Microsoft Azure with custom Terraform blueprints."],
      ["What disaster recovery targets (RTO and RPO) are guaranteed in our SLA?", "Our enterprise multi-region clusters guarantee a Recovery Point Objective (RPO) of zero for committed database transactions and a Recovery Time Objective (RTO) of less than 30 seconds via automated multi-zone DNS failovers."],
      ["How are legacy historical records migrated during cutover?", "Our automated data sanitization and ETL pipelines ingest CSV, SQL dumps, and REST API records from legacy platforms. Data is validated, normalized, and dual-written in parallel sandboxes until 100% mathematical parity is verified."],
    ],
    relatedProductSlugs: ["schooly-core", "dezo-care", "real-estate", "hrms"],
    idealFor: "Multinational corporations, large campus networks, hospital networks, real estate conglomerates, and government bodies.",
  },

  ai: {
    slug: "ai",
    title: "AI Solutions",
    tagline: "Autonomous Agentic Intelligence. Embedded Directly Into Your Enterprise Workflows.",
    badge: "ENTERPRISE ARTIFICIAL INTELLIGENCE",
    description:
      "DEZORYN AI Solutions embeds production-grade agentic large language models, predictive time-series machine learning, and multi-modal document intelligence directly into operational business software. Eliminate repetitive cognitive bottlenecks with verified, schema-grounded artificial intelligence.",
    problemHeading: "Why Fragile Chatbots Fail in Production Operations",
    problemSubtext: "Standard consumer AI chatbots hallucinate unverified numbers, lack access to live transactional databases, and breach corporate privacy policies by exposing sensitive enterprise secrets.",
    guarantees: [
      "Zero Data Retention (ZDR) Privacy Guarantee",
      "Strongly Typed Schema Tool Function Calls (Zod/Pydantic)",
      "Adversarial Critic Agent Decision Verification Pairs",
      "Sub-450ms Streaming First-Token Response Latency",
    ],
    narrative: [
      "The first era of enterprise AI was characterized by fragile chatbot sidebars that hallucinated facts and lacked access to actual transactional records. In contrast, true operational AI requires autonomous multi-agent systems grounded strictly in strongly typed enterprise APIs, immutable business rules, and rigorous human-in-the-loop audit gates.",
      "DEZORYN engineers agentic AI networks that operate as tireless digital co-workers. Decomposed into stateful directed acyclic graphs (DAGs), our specialized agents ingest unstructured contracts, verify invoices against purchase orders, predict student attrition, forecast hospital bed occupancies, and triage support queues with 99.8% precision.",
      "Every AI decision generated by our platform is accompanied by a transparent citation audit trail, explaining the exact data points, model parameters, and deterministic business rules that contributed to the automated action."
    ],
    icon: Sparkles,
    image: "/resources/agentic-ai.jpg",
    blueprintTitle: "Stateful Multi-Agent Directed Acyclic Graph (DAG)",
    telemetry: {
      uptime: "99.95% Inference SLA",
      latency: "Streaming P95 < 450ms",
      encryption: "End-to-End Zero Data Retention",
      isolation: "Dedicated Model Fine-Tuning Tenants",
    },
    pillarHeading: "Operational Capabilities of Autonomous Agent Networks",
    pillarSubtext: "How multi-agent directed graphs, semantic search vectors, and schema guardrails transform raw foundation models into reliable enterprise operators.",
    capabilities: [
      {
        title: "Schema-Grounded Tool Invocation",
        desc: "AI agents invoke production database mutations strictly through strongly typed Zod and Pydantic JSON schemas. Open-ended code execution is blocked, preventing rogue modifications or unintended side effects.",
      },
      {
        title: "Autonomous Multi-Agent Collaboration",
        desc: "Stateful agent graphs where specialized agents (Research Agent, Compliance Auditor, Execution Agent) collaborate sequentially and in parallel, passing verified structured context between checkpoints.",
      },
      {
        title: "Predictive Operational Telemetry",
        desc: "Time-series regression models forecasting inventory stockout dates, patient bed churn, fee collection default probabilities, and customer deal closing confidence scores.",
      },
      {
        title: "Document Intelligence & Clause Extraction",
        desc: "High-accuracy OCR and NLP pipelines that extract unstructured text from PDFs, scanned lease deeds, medical charts, and invoices into structured relational SQL tables in under 3 seconds.",
      },
      {
        title: "Adversarial Critic Verification Gates",
        desc: "Every draft or disbursement proposal generated by an AI worker is reviewed by a separate Critic Agent configured with corporate compliance policies. Deviations trigger instant human review escalations.",
      },
      {
        title: "Zero Data Retention Privacy Posture",
        desc: "All enterprise prompts and documents are processed under strict Zero Data Retention (ZDR) agreements. Customer proprietary data is never used to train public foundation models.",
      },
    ],
    workflowTitle: "Agentic AI Training & Fine-Tuning Pipeline",
    workflowSubtext: "From unstructured enterprise documentation to verified autonomous execution inside production software.",
    workflow: [
      { phase: "Phase 1: Knowledge Audit & Prompt Engineering", duration: "Weeks 1–2", desc: "Cataloging unstructured documents, standard operating procedures (SOPs), and historical edge cases to build the system knowledge graph." },
      { phase: "Phase 2: Embedding & Semantic Indexing", duration: "Weeks 3–4", desc: "Chunking and vectorizing institutional data into encrypted pgvector partitions with domain-specific hybrid search ranking." },
      { phase: "Phase 3: Tool Binding & Guardrail Validation", duration: "Weeks 5–6", desc: "Connecting agents to transactional REST APIs with strict Pydantic parameter schemas and adversarial red-team prompt testing." },
      { phase: "Phase 4: Human-in-the-Loop Shadow Mode", duration: "Weeks 7–8", desc: "Agents generate recommendations in parallel with human operators. Reviewers score outputs until 99.5% accuracy is verified." },
      { phase: "Phase 5: Embedded Autonomous Rollout", duration: "Ongoing", desc: "Full live deployment with streaming WebSocket UI interfaces, token budget cost guardrails, and real-time hallucination monitors." },
    ],
    benchmarkTitle: "Empirical Machine Learning Benchmarks",
    benchmarks: [
      { value: "99.8%", label: "Document Entity Extraction Accuracy" },
      { value: "-80%", label: "Reduction in Manual Data Entry Time" },
      { value: "< 450ms", label: "P95 First-Token Streaming Latency" },
      { value: "Zero", label: "Customer Data Used for Foundation Training" },
    ],
    securityTitle: "Ethical AI Governance & Zero Data Retention",
    securityDesc: "We enforce strict Zero Data Retention (ZDR) agreements with cloud inference providers. Model inputs are scrubbed of personally identifiable information (PII) at the edge before tokenization.",
    securityBadges: [
      { name: "Zero Data Retention", desc: "No Public Model Training" },
      { name: "PII Sanitizer", desc: "Edge Anonymization" },
      { name: "NeMo Guardrails", desc: "Prompt Injection Defense" },
      { name: "Audit Trail", desc: "Every Token Logged" },
    ],
    faqs: [
      ["Does DEZORYN use our private corporate data to train public AI models?", "No. Absolutely never. All enterprise AI solutions operate under strict Zero Data Retention (ZDR) enterprise agreements with dedicated tenant-isolated inference endpoints. Your data is your exclusive property."],
      ["How do you prevent AI hallucinations in regulated environments?", "We use a dual approach: First, deterministic grounding via strongly typed JSON tools that validate every parameter before database execution. Second, adversarial Critic Agent pairs that cross-examine outputs against institutional policy documents before presenting results."],
      ["Can the AI system integrate with our existing on-premises SQL databases?", "Yes. Our secure agent gateways connect to legacy on-premises databases via mTLS-encrypted VPC reverse tunnels, querying and updating records securely without opening inbound firewall ports."],
      ["What happens if an AI agent is uncertain about a decision?", "Every decision model calculates a statistical confidence coefficient. If confidence falls below your configured threshold (e.g. 95%), the task automatically falls back to a designated human operator queue with full context."],
    ],
    relatedProductSlugs: ["crm", "legal-docs", "super-whatsapp"],
    idealFor: "Legal departments, sales organizations, diagnostic healthcare clinics, and logistics dispatch teams.",
  },

  automation: {
    slug: "automation",
    title: "Automation Workflows",
    tagline: "Eliminate Friction. Connect Disconnected Systems. Accelerate Velocity.",
    badge: "EVENT-DRIVEN ENTERPRISE AUTOMATION",
    description:
      "DEZORYN Automation Workflows synchronizes disparate enterprise software, triggers multi-departmental actions, and eliminates manual paperwork through reliable, event-driven integration pipelines with guaranteed at-least-once execution.",
    problemHeading: "The High Cost of Fragmented Departmental Handoffs",
    problemSubtext: "When customer onboarding, invoice approvals, and inventory alerts require human operators to manually copy data between software tools, turnaround slows down and expensive double-entry errors escalate.",
    guarantees: [
      "Sub-200ms Trigger-to-Action Execution Time",
      "HMAC-SHA256 Cryptographic Webhook Signatures",
      "Client-Supplied Idempotency Key Double-Charge Defense",
      "Self-Healing Distributed Queues with Dead-Letter Handling",
    ],
    narrative: [
      "Enterprise productivity is frequently paralyzed by manual handoffs: copying customer details from a CRM into an accounting ledger, requesting email approvals for purchase orders, or manually sending WhatsApp alerts to field staff. These disconnected routines generate costly errors and delay customer turnaround.",
      "Our automation platform treats operational processes as deterministic, event-driven state machines. When a trigger event occurs—such as an approved patient admission, a signed lease agreement, or an incoming wire payment—our workflow engine dispatches concurrent downstream actions across billing, notifications, inventory, and analytics in under 200ms.",
      "Equipped with automatic retry mechanisms, exponential backoff with jitter, and dead-letter queues (DLQ), our automation pipelines guarantee that no critical business transaction is ever dropped, duplicate-charged, or left unfulfilled."
    ],
    icon: Workflow,
    image: "/resources/automation-ai.jpg",
    blueprintTitle: "High-Throughput Event-Driven Orchestration Pipeline",
    telemetry: {
      uptime: "99.99% Queue Availability",
      latency: "Execution P95 < 180ms",
      encryption: "HMAC-SHA256 Signed Webhooks",
      isolation: "Tenant-Isolated Worker Queues",
    },
    pillarHeading: "High-Throughput Integration & Event Orchestration",
    pillarSubtext: "Deterministic state machines, resilient queues, and bi-directional API bridges that automate repetitive operational bottlenecks across teams.",
    capabilities: [
      {
        title: "Event-Driven Reactive Webhooks",
        desc: "Instant event streaming upon database status mutations, payment settlements, or form submissions. Every outbound payload includes cryptographic HMAC-SHA256 signatures for recipient validation.",
      },
      {
        title: "Multi-Tier Approval Hierarchies",
        desc: "Configurable approval matrices routing requests to managers via Slack, WhatsApp, or email with one-click cryptographic decision links and automated escalation timers.",
      },
      {
        title: "Self-Healing Distributed Queues",
        desc: "Backed by Redis and Kafka streams. In the event of downstream vendor downtime, tasks are safely held and retried using exponential backoff across a 24-hour delivery window.",
      },
      {
        title: "Idempotent Transaction Execution",
        desc: "Client-supplied idempotency keys on every mutation endpoint prevent double billing, duplicate student fee entries, or accidental repeat notifications during network retries.",
      },
      {
        title: "Bi-Directional Third-Party Sync",
        desc: "Pre-built connectors to Meta WhatsApp Business API, Stripe, PayPal, Google Calendar, Twilio, QuickBooks, and internal legacy relational databases.",
      },
      {
        title: "Real-Time Visual Pipeline Observability",
        desc: "Live visual flow monitors showing execution paths, latency bottlenecks, failed payloads, and manual re-trigger consoles for system administrators.",
      },
    ],
    workflowTitle: "Workflow Automation Engineering Lifecycle",
    workflowSubtext: "From manual operational mapping to fault-tolerant distributed event pipelines with real-time telemetry.",
    workflow: [
      { phase: "Phase 1: Operational Journey Mapping", duration: "Weeks 1–2", desc: "Documenting cross-departmental handoffs, manual spreadsheet routines, external vendor APIs, and trigger failure scenarios." },
      { phase: "Phase 2: Trigger & Webhook Blueprinting", duration: "Weeks 3–4", desc: "Defining deterministic event payloads, HMAC secrets, idempotency keys, and role-based approval escalation rules." },
      { phase: "Phase 3: Sandbox Simulation & Chaos Testing", duration: "Weeks 5–6", desc: "Simulating edge-case failures, third-party API rate limits, and network dropouts to verify automated queue self-healing." },
      { phase: "Phase 4: Parallel Departmental Rollout", duration: "Weeks 7–8", desc: "Deploying workflows alongside manual routines to verify mathematical ledger consistency and communication accuracy." },
      { phase: "Phase 5: Production Automation & Telemetry", duration: "Ongoing", desc: "Full live deployment with 24/7 worker queue health telemetry, SLA tracking, and continuous workflow optimization." },
    ],
    benchmarkTitle: "Operational Throughput & Efficiency Benchmarks",
    benchmarks: [
      { value: "< 200ms", label: "Average Trigger-to-Action Execution Time" },
      { value: "Zero", label: "Duplicate Charges via Idempotency Keys" },
      { value: "99.99%", label: "Webhook Delivery Reliability SLA" },
      { value: "+300%", label: "Increase in Daily Departmental Throughput" },
    ],
    securityTitle: "Cryptographic Webhook Security & Idempotency",
    securityDesc: "Every inbound and outbound automation message is protected with HMAC-SHA256 signatures, replay attack verification, and Redis token bucket rate caps to prevent abuse.",
    securityBadges: [
      { name: "HMAC-SHA256", desc: "Signed Payloads" },
      { name: "Idempotency", desc: "No Double-Runs" },
      { name: "Dead-Letter DLQ", desc: "Zero Data Drop" },
      { name: "AES-256 Storage", desc: "Encrypted State" },
    ],
    faqs: [
      ["What happens if an external service like WhatsApp or Stripe goes down?", "Our distributed queueing engine safely captures the outbound event in a durable Redis/Kafka stream. The system pauses delivery to that endpoint and automatically retries with exponential backoff once the third-party service recovers, guaranteeing zero data loss."],
      ["How do you prevent automated workflows from accidentally triggering twice?", "We enforce client-provided Idempotency-Keys on all state-mutating actions. If a network blip causes a webhook or form to submit twice, our gateway recognizes the key and returns the cached result without executing the action a second time."],
      ["Can we establish multi-level approvals for financial transactions over a certain dollar amount?", "Yes. You can configure granular conditional branch logic—for instance, requiring single manager approval for expenses under $500, but mandating dual Director sign-off via WhatsApp or email for sums exceeding $5,000."],
      ["Are workflow execution logs accessible for financial compliance audits?", "Yes. Every trigger event, payload snapshot, state transition, and delivery timestamp is recorded in an immutable audit ledger exportable as JSON or CSV for regulatory audits."],
    ],
    relatedProductSlugs: ["super-whatsapp", "crm", "legal-docs", "hrms"],
    idealFor: "E-commerce retailers, educational billing desks, real estate leasing offices, field maintenance teams, and customer success departments.",
  },

  "custom-software": {
    slug: "custom-software",
    title: "Custom Software Engineering",
    tagline: "Software Architected Around How You Actually Work. Zero Technical Debt.",
    badge: "BESPOKE ENTERPRISE SOFTWARE",
    description:
      "DEZORYN Custom Software Engineering builds robust, tailored enterprise platforms from the ground up for organizations with proprietary business logic, specialized billing formulas, or unique competitive workflows where generic off-the-shelf software falls short.",
    problemHeading: "The Trap of Rigid SaaS & Perpetual Licensing Seat Taxes",
    problemSubtext: "Forcing specialized business models into generic off-the-shelf software leads to crippling per-seat costs, vendor lock-in, and frontline frustration as employees resort to private spreadsheets.",
    guarantees: [
      "100% Client Intellectual Property & Source Code Ownership",
      "Strict Domain-Driven Design (DDD) Modular Architecture",
      "> 90% Automated Test Suite Code Coverage (Unit & E2E)",
      "Zero Perpetual Per-User Seat Taxes or Vendor Lock-in",
    ],
    narrative: [
      "When companies force their unique operational practices into rigid commercial software, productivity plummets and competitive advantages evaporate. Organizations end up trapped in costly vendor licensing models while their workers develop makeshift workarounds in spreadsheets.",
      "DEZORYN constructs bespoke software platforms that mirror your organizational chart and operational rules with mathematical precision. We engineer clean, modular architectures utilizing Next.js, Node.js microservices, and PostgreSQL, ensuring your software is performant, maintainable, and built to endure for decades.",
      "Most importantly, DEZORYN delivers complete intellectual property ownership. Your organization receives the complete source code repositories, automated CI/CD deployment pipelines, container definitions, and comprehensive architectural documentation—guaranteeing complete digital sovereignty."
    ],
    icon: Code2,
    image: "/resources/api-developer-guide.jpg",
    blueprintTitle: "Modular Monolith & Microservice Hybrid Architecture",
    telemetry: {
      uptime: "99.99% System Availability",
      latency: "Database Queries P95 < 12ms",
      encryption: "Customer KMS Key Isolation",
      isolation: "Dedicated Compute & Storage Clusters",
    },
    pillarHeading: "Tailored Engineering Pillars for Proprietary Systems",
    pillarSubtext: "Engineered specifically to give your organization a sustainable technological moat without compounding technical debt.",
    capabilities: [
      {
        title: "Bespoke Business Logic Engines",
        desc: "Custom computational algorithms, commission matrices, multi-currency fee schedules, and domain workflows engineered specifically for your organizational requirements.",
      },
      {
        title: "Clean Modular Code Architecture",
        desc: "Strict adherence to Domain-Driven Design (DDD) principles with decoupled microservices, strongly typed TypeScript interfaces, and zero spaghetti dependencies.",
      },
      {
        title: "Full Intellectual Property Ownership",
        desc: "Deliverables include complete git code repositories, container manifests, Figma design systems, and database migration scripts with unrestricted commercial ownership.",
      },
      {
        title: "Production-Grade Developer APIs",
        desc: "Comprehensive OpenAPI 3.1 RESTful specifications, automatic interactive Swagger documentation, and developer SDK client generators in TypeScript, Python, and Java.",
      },
      {
        title: "Continuous Automated Test Coverage",
        desc: "Rigorous CI/CD test pipelines achieving over 90% unit, integration, and end-to-end test coverage with automated GitHub Actions regression testing on every pull request.",
      },
      {
        title: "Hardware & Peripheral Synchronization",
        desc: "Direct integration with IoT gate barriers, thermal receipt printers, biometric fingerprint scanners, POS barcode readers, and laboratory telemetry equipment.",
      },
    ],
    workflowTitle: "Agile Software Engineering Sprints",
    workflowSubtext: "From whiteboard domain exploration to enterprise code repository handover with zero technical debt.",
    workflow: [
      { phase: "Phase 1: Domain Discovery & User Journey Mapping", duration: "Weeks 1–3", desc: "Detailed interviews with frontline operators, managers, and executives to map exact data models, edge cases, and UI requirements." },
      { phase: "Phase 2: High-Fidelity UI Prototyping & Architecture", duration: "Weeks 4–6", desc: "Interactive Figma design prototype testing, relational database ERD schema design, and technical API boundary definitions." },
      { phase: "Phase 3: Agile Sprint Engineering", duration: "Weeks 7–12", desc: "Two-week agile development sprints with bi-weekly staging demonstration deployments and continuous automated regression testing." },
      { phase: "Phase 4: Security Hardening & Acceptance Testing", duration: "Weeks 13–15", desc: "Third-party penetration testing, user acceptance testing (UAT) with real operators, and legacy data migration rehearsals." },
      { phase: "Phase 5: Production Launch & Knowledge Handover", duration: "Week 16+", desc: "Zero-downtime production deployment, comprehensive engineering code handover, admin training, and 24/7 hypercare support." },
    ],
    benchmarkTitle: "Software Quality & Architecture Benchmarks",
    benchmarks: [
      { value: "100%", label: "Client Intellectual Property Code Ownership" },
      { value: "> 90%", label: "Automated Test Suite Code Coverage" },
      { value: "< 12ms", label: "P95 Relational Database Query Response" },
      { value: "Zero", label: "Licensing Seat Taxes or Vendor Lock-in" },
    ],
    securityTitle: "Enterprise Code Security & Full IP Provenance",
    securityDesc: "All software repositories are created in your enterprise organization accounts. Automated SAST/DAST static analysis and dependency scanners inspect every line of code before build approval.",
    securityBadges: [
      { name: "Full IP Rights", desc: "100% Code Ownership" },
      { name: "SAST / DAST", desc: "Vulnerability Scanning" },
      { name: "Clean Architecture", desc: "Zero Monolith Spaghetti" },
      { name: "CI/CD Gate", desc: "Automated Testing" },
    ],
    faqs: [
      ["Does our company own the software source code upon project completion?", "Yes. 100%. All custom software contracts with DEZORYN explicitly assign full intellectual property ownership—including source code, Figma design files, database schemas, and deployment scripts—to your organization."],
      ["How do you ensure custom software remains maintainable for years to come?", "We strictly adhere to Domain-Driven Design (DDD), write clean, strongly typed TypeScript, maintain comprehensive OpenAPI documentation, and mandate extensive automated test suites so that your internal engineers or future teams can easily understand and extend the platform."],
      ["Can custom software connect to our existing enterprise accounting or CRM software?", "Yes. We engineer standard RESTful and GraphQL API bridges with secure OAuth 2.0 PKCE authentication to synchronize data bidirectionally with platforms like SAP, Salesforce, QuickBooks, or custom internal systems."],
      ["What post-launch support and maintenance do you offer?", "We provide flexible Service Level Agreements (SLAs) including continuous security vulnerability patching, dependency upgrades, cloud infrastructure monitoring, and dedicated sprint hours for ongoing feature enhancements."],
    ],
    relatedProductSlugs: ["schooly-core", "dezo-care", "crm", "real-estate"],
    idealFor: "Enterprises with proprietary business models, logistics networks, manufacturing plants, specialized healthcare clinics, and fintech pioneers.",
  },

  "digital-transformation": {
    slug: "digital-transformation",
    title: "Digital Transformation",
    tagline: "Modernize Legacy Systems. Eliminate Paperwork. Zero Operational Disruption.",
    badge: "STRATEGIC ENTERPRISE MODERNIZATION",
    description:
      "DEZORYN Digital Transformation guides established institutions and legacy enterprises through phased cloud modernization roadmaps. We replace fragmented paper files and outdated desktop software with modern, multi-tenant cloud platforms while guaranteeing zero operational downtime.",
    problemHeading: "The Failure Rate of High-Risk 'Big-Bang' Overhauls",
    problemSubtext: "Attempting to replace an entire legacy monolith over a single weekend routinely leads to corrupted ledgers, employee chaos, and multi-million-dollar budget overruns.",
    guarantees: [
      "Zero Operational Downtime via Strangler Fig Decoupling",
      "Automated Parallel Dual-Run Data Reconciliation",
      "100% Mathematical Historical Ledger Parity Verification",
      "Role-Based Frontline Employee Onboarding Workshops",
    ],
    narrative: [
      "The greatest fear preventing established institutions from modernizing is operational paralysis: the risk that switching software platforms will corrupt customer ledgers, disrupt daily billing, or bewilder frontline staff. Far too many companies have suffered through catastrophic 'big-bang' replacements that went millions over budget.",
      "DEZORYN employs the battle-tested Strangler Fig migration pattern. Instead of attempting a reckless overnight switch, we wrap your legacy databases in an intelligent modern API gateway. We then incrementally deploy high-performance cloud microservices—such as online admissions, mobile payments, or inventory dispatch—one department at a time.",
      "By maintaining automated dual-running reconciliation between old and new systems during transitional phases, your operations continue running smoothly while frontline workers gradually adopt modern, intuitive interfaces with zero stress or business interruption."
    ],
    icon: RefreshCw,
    image: "/resources/digital-transformation.jpg",
    blueprintTitle: "Strangler Fig Incremental Migration Pattern",
    telemetry: {
      uptime: "100% Transition Availability",
      latency: "Gateway Routing < 8ms",
      encryption: "Cryptographic Data Parity Checksums",
      isolation: "Parallel Dual-Run Environments",
    },
    pillarHeading: "Phased Modernization & Decoupling Modules",
    pillarSubtext: "Systematic tools, migration gateways, and change management procedures that de-risk the modernization journey.",
    capabilities: [
      {
        title: "Strangler Fig Incremental Modernization",
        desc: "Phased replacement of legacy subsystems without operational disruption. Outdated monolithic modules are decoupled and retired systematically behind an intelligent routing gateway.",
      },
      {
        title: "Automated Data Cleansing & Ingestion",
        desc: "Automated ETL scripts that sanitize decades of historical paper records, duplicate entries, and corrupted spreadsheets into normalized, high-performance PostgreSQL tables.",
      },
      {
        title: "Automated Dual-Run Reconciliation",
        desc: "During cutover periods, transactions are mirrored across legacy and modern cloud platforms simultaneously, mathematically verifying penny-for-penny ledger parity before legacy shutoff.",
      },
      {
        title: "Frontline Change Management & Training",
        desc: "Intuitive, mobile-responsive user interfaces paired with role-specific video tutorials, guided interactive sandbox environments, and on-site staff training workshops.",
      },
      {
        title: "Legacy Monolith Archival & Cost Containment",
        desc: "Converting historical compliance data into encrypted, low-cost searchable cloud data lakes (AWS S3 Glacier), allowing companies to shut down costly legacy server maintenance licenses.",
      },
      {
        title: "Real-Time Value Realization Telemetry",
        desc: "Executive KPI dashboards tracking tangible operational gains: reduction in paperwork hours, billing dispute reductions, turnaround times, and infrastructure savings.",
      },
    ],
    workflowTitle: "Phased Modernization & Cutover Framework",
    workflowSubtext: "Step-by-step decoupling from legacy desktop systems to modern cloud portals with zero operational hiatus.",
    workflow: [
      { phase: "Phase 1: Monolith Audit & Subsystem Decoupling", duration: "Weeks 1–3", desc: "Cataloging legacy databases, stored procedures, physical paperwork workflows, and identifying the least-coupled module to migrate first." },
      { phase: "Phase 2: API Gateway & Data Mirroring Setup", duration: "Weeks 4–6", desc: "Deploying the modern API gateway in front of legacy databases and configuring Change Data Capture (CDC) replication." },
      { phase: "Phase 3: Departmental Pilot & Sandbox Training", duration: "Weeks 7–9", desc: "Rolling out the first modern cloud module (e.g. digital admissions or customer billing) to a designated pilot department." },
      { phase: "Phase 4: Multi-Branch Dual-Running Validation", duration: "Weeks 10–13", desc: "Running all branches concurrently on both systems to mathematically verify operational ledger and inventory parity." },
      { phase: "Phase 5: Final Legacy Decommissioning", duration: "Weeks 14+", desc: "Archiving historical records to secure data lakes, terminating expensive legacy software licenses, and celebrating full digital cutover." },
    ],
    benchmarkTitle: "Verified Transformation Outcomes",
    benchmarks: [
      { value: "Zero", label: "Operational Downtime During System Migration" },
      { value: "-75%", label: "Reduction in Administrative Paperwork Hours" },
      { value: "100%", label: "Mathematical Historical Ledger Data Parity" },
      { value: "6–12x", label: "Return on Investment within First 18 Months" },
    ],
    securityTitle: "Data Integrity Defense & Legacy Parity Validation",
    securityDesc: "Transactions are cryptographically hashed and verified across both systems during transition phases. If even a single penny fails to reconcile, automated alerts halt cutover immediately.",
    securityBadges: [
      { name: "Checksum Parity", desc: "Penny-for-Penny Match" },
      { name: "Dual-Run Engine", desc: "Zero Risk Parallelism" },
      { name: "Glacier Vault", desc: "Compliant Archival" },
      { name: "Zero Data Loss", desc: "RPO = 0 Guarantee" },
    ],
    faqs: [
      ["How do you ensure our business doesn't stop operating during the system transition?", "We utilize the Strangler Fig pattern and traffic shadowing. Your legacy system continues operating normally while we migrate discrete departments one by one. Both systems run in parallel with automatic data synchronization until you are 100% confident in the modern platform."],
      ["What happens to our decades of historical paper and spreadsheet records?", "Our specialized data engineers run automated extraction, cleansing, and normalization pipelines. We eliminate duplicate rows, resolve inconsistent customer formatting, and load sanitized historical data into your modern relational database."],
      ["Will our non-technical frontline staff struggle to learn the new software?", "No. Modern software should empower employees, not confuse them. We design clean, high-contrast, consumer-grade interfaces that require zero technical expertise. We also provide guided sandbox practice modes and hands-on onboarding sessions."],
      ["How do we prove ROI to our board of directors?", "Prior to kicking off modernization, we establish baseline metrics (e.g. hours per billing cycle, invoice dispute rate, student intake turnaround). Our executive dashboards measure these exact KPIs weekly, demonstrating clear cost savings and efficiency gains to stakeholders."],
    ],
    relatedProductSlugs: ["schooly-core", "real-estate", "society-management", "hrms"],
    idealFor: "Established educational institutions, healthcare clinics, traditional real estate developers, manufacturing operations, and commercial distributors.",
  },

  cloud: {
    slug: "cloud",
    title: "Cloud Infrastructure",
    tagline: "Global Elastic Scale. High-Availability. Sub-Second Worldwide Latency.",
    badge: "GLOBAL CLOUD ARCHITECTURE",
    description:
      "DEZORYN Cloud Infrastructure architects, deploys, and manages multi-region cloud deployment topologies on AWS, Google Cloud, and Cloudflare. Engineered with automated auto-scaling Kubernetes clusters, connection pooling, and zero-downtime CI/CD pipelines.",
    problemHeading: "The Danger of Single-Zone Outages & Cloud Bill Sprawl",
    problemSubtext: "Relying on a single cloud region leaves applications vulnerable to catastrophic datacenter blackouts, while un-monitored Kubernetes compute clusters generate massive monthly financial waste.",
    guarantees: [
      "Contractual 99.99% Global Uptime Availability SLA",
      "P95 Sub-22ms Edge Content Delivery Network Latency",
      "-35% to -50% Cloud Spend Reduction via FinOps",
      "Automated Under-3-Second Disaster Recovery Multi-Zone Failover",
    ],
    narrative: [
      "Modern cloud computing is far more than simply renting virtual servers; it is the discipline of architecting resilient, self-healing systems that scale elastically during peak demand and contract during off-peak hours to slash infrastructure waste.",
      "DEZORYN builds cloud deployment topologies utilizing Infrastructure as Code (Terraform), containerized microservices (Docker & Kubernetes), and distributed edge caching (Cloudflare). Our architectures distribute computational workloads across geographically redundant data centers in North America, Europe, the Middle East, and Asia.",
      "By combining PgBouncer connection pooling with autoscaled read replicas, our database layer handles immense concurrent query spikes while maintaining sub-15ms response times. Continuous automated backups and multi-zone failover guarantee your critical software is always available."
    ],
    icon: Cloud,
    image: "/resources/cloud-finops.jpg",
    blueprintTitle: "Multi-Region Elastic Cloud Deployment Topology",
    telemetry: {
      uptime: "99.99% Global Uptime SLA",
      latency: "Edge Response P95 < 22ms",
      encryption: "TLS 1.3 / mTLS Mesh Encryption",
      isolation: "VPC Peering & Network Segmentation",
    },
    pillarHeading: "Elastic Scalability & Global High-Availability",
    pillarSubtext: "How container orchestrators, connection proxies, and automated failover topologies guarantee continuous platform uptime.",
    capabilities: [
      {
        title: "Multi-Region Cloud Topologies",
        desc: "Low-latency regional data centers deployed across North America, Europe, Middle East, and Asia-Pacific. Edge Anycast DNS routes users to the nearest healthy node automatically.",
      },
      {
        title: "Elastic Horizontal Pod Autoscaling (HPA)",
        desc: "Kubernetes clusters that dynamically scale container worker nodes in seconds during registration rushes or month-end billing spikes, downsizing during idle periods to eliminate cloud waste.",
      },
      {
        title: "High-Density Database Connection Pooling",
        desc: "PgBouncer and AWS RDS Proxy layers enabling thousands of transient application microservices to share an optimized pool of physical database connections with zero memory exhaustion.",
      },
      {
        title: "Automated Zero-Downtime Blue-Green CI/CD",
        desc: "Production deployments executed via automated blue-green and canary rollouts. New software releases are validated against live health probes before traffic cutover with instant one-click rollback.",
      },
      {
        title: "Continuous Backups & Point-in-Time Recovery",
        desc: "Relational database transaction logs backed up continuously to multi-zone encrypted cloud storage. Point-in-time recovery allows rolling back state to any exact second within 35 days.",
      },
      {
        title: "Cloud FinOps & Infrastructure Rightsizing",
        desc: "Continuous resource usage telemetry benchmarking P95 CPU and memory allocation to eliminate over-provisioned nodes, routinely reducing cloud provider bills by 35% to 50%.",
      },
    ],
    workflowTitle: "Infrastructure as Code & SRE Deployment",
    workflowSubtext: "From Terraform definitions to 24/7 autonomous site reliability telemetry.",
    workflow: [
      { phase: "Phase 1: Cloud Architecture Audit & Sizing", duration: "Weeks 1–2", desc: "Auditing traffic patterns, database IOPS, egress bandwidth, security compliance requirements, and peak concurrency spikes." },
      { phase: "Phase 2: Terraform IaC & VPC Segmentation", duration: "Weeks 3–4", desc: "Writing modular Terraform definitions for isolated VPCs, private subnets, NAT gateways, and KMS encryption hierarchies." },
      { phase: "Phase 3: Kubernetes Cluster Hardening & CI/CD", duration: "Weeks 5–6", desc: "Deploying multi-AZ Kubernetes clusters with automated GitHub Actions CI/CD pipelines and canary deployment health checks." },
      { phase: "Phase 4: Stress Testing & Chaos Engineering", duration: "Weeks 7–8", desc: "Subjecting infrastructure to synthetic 50,000 req/sec stress tests and simulating availability zone outages to verify auto-failover." },
      { phase: "Phase 5: 24/7 Managed Cloud SRE Operations", duration: "Ongoing", desc: "Continuous uptime monitoring, automated security patch application, FinOps cost rightsizing, and guaranteed 99.99% availability." },
    ],
    benchmarkTitle: "Cloud Reliability & Efficiency Benchmarks",
    benchmarks: [
      { value: "99.99%", label: "Contractual Cloud Availability SLA" },
      { value: "< 22ms", label: "P95 Edge CDN Response Latency Worldwide" },
      { value: "-45%", label: "Reduction in Cloud Infrastructure Spend" },
      { value: "< 3 sec", label: "Automated Multi-Zone Disaster Recovery Failover" },
    ],
    securityTitle: "Infrastructure Defense & Multi-Zone Availability",
    securityDesc: "Strict private subnet isolation, mTLS service-to-service encryption, and Cloudflare DDoS protection ensure external threats never reach your core application clusters.",
    securityBadges: [
      { name: "VPC Peering", desc: "Isolated Subnets" },
      { name: "mTLS Mesh", desc: "Service Encryption" },
      { name: "DDoS Shield", desc: "Layer 7 Protection" },
      { name: "PITR Backups", desc: "35-Day Rollback" },
    ],
    faqs: [
      ["Which cloud providers does DEZORYN support?", "We architect and manage cloud topologies primarily on Amazon Web Services (AWS), Google Cloud Platform (GCP), and Cloudflare Enterprise. We also support hybrid deployments connected securely to private on-premises data centers."],
      ["How does auto-scaling work during sudden traffic spikes?", "We configure Kubernetes Horizontal Pod Autoscalers (HPA) alongside Cloudflare edge caching. When CPU or request queues surpass 65% utilization, new microservice pods spin up in seconds to absorb the load, contracting once traffic normalizes."],
      ["What is your disaster recovery plan in the event of a cloud data center outage?", "Our databases replicate continuously across multiple availability zones. If an entire cloud region experiences an outage, our Anycast DNS and automated health probes re-route traffic to secondary regional clusters in under 3 seconds."],
      ["How do you prevent unexpected cloud bill overruns?", "We enforce strict Cloud FinOps governance: automated tagging on every cloud resource, Vertical Pod Autoscaling (VPA) rightsizing, aggressive CDN caching for static assets, and automated budget anomaly alerts dispatched to engineering leads."],
    ],
    relatedProductSlugs: ["society-management", "crm", "super-whatsapp"],
    idealFor: "SaaS software vendors, global e-commerce portals, university examination systems, media networks, and financial transaction processors.",
  },

  mobile: {
    slug: "mobile",
    title: "Mobile Solutions",
    tagline: "Native 60fps Mobile Performance. Offline-First Synchronization. Built for the Field.",
    badge: "ENTERPRISE MOBILE PLATFORMS",
    description:
      "DEZORYN Mobile Solutions engineers cross-platform enterprise mobile applications on iOS and Android. Connected seamlessly to your central cloud ERP, our apps empower frontline technicians, teachers, residents, and executives with biometric security and offline-first capabilities.",
    problemHeading: "Why Clunky Mobile Webviews Fail Frontline Field Teams",
    problemSubtext: "Attempting to wrap desktop web pages in mobile wrappers causes terrible lag, battery drain, crashes in areas with poor cellular reception, and frustrated frontline personnel.",
    guarantees: [
      "Native 60fps Fluid UI Animation Performance",
      "Offline-First SQLite Local Encrypted Mutation Storage",
      "Biometric Apple Keychain & Android Keystore Authentication",
      "99.9% App Crash-Free Rate Across Thousands of Devices",
    ],
    narrative: [
      "Enterprise software that only works on desktop web browsers is fundamentally incomplete. Frontline technicians in the field, school teachers in classrooms, delivery drivers on highways, and executives at airports require instantaneous mobile access to operational workflows.",
      "DEZORYN constructs native-performance mobile applications using React Native. Rather than clunky hybrid webviews that stutter and crash, our apps run at a fluid 60 frames per second with native hardware acceleration, instant biometric FaceID authentication, camera barcode scanning, and push notifications.",
      "Critically, our mobile applications are architected with an offline-first data synchronization engine (WatermelonDB / SQLite). Field personnel can record work orders, inspect facilities, or mark attendance even when deep underground or in remote areas with zero internet connectivity; the app seamlessly reconciles transactions the moment signal returns."
    ],
    icon: Smartphone,
    image: "/resources/mobile-enterprise-suite.jpg",
    blueprintTitle: "Offline-First Mobile Architecture & Telemetry Showcase",
    telemetry: {
      uptime: "99.9% App Crash-Free Rate",
      latency: "Local Cache Hit < 5ms",
      encryption: "SQLite SQLCipher AES-256 On-Device",
      isolation: "Biometric Hardware Key-Protected Sessions",
    },
    pillarHeading: "Native Capabilities for Field & Frontline Workforces",
    pillarSubtext: "Built from the ground up for high-mobility workers operating in demanding environments with variable connectivity.",
    capabilities: [
      {
        title: "Cross-Platform React Native Architecture",
        desc: "A single, robust TypeScript codebase delivering native 60fps performance across both iOS and Android, cutting mobile development and ongoing maintenance costs in half.",
      },
      {
        title: "Offline-First SQLite Synchronization Engine",
        desc: "Local encrypted database storage on device with background synchronization. Transactions executed offline are queued and reconciled automatically with server timestamps upon reconnection.",
      },
      {
        title: "Biometric & Hardware Security",
        desc: "Native FaceID, TouchID, and Android Biometric Prompt integration. Secure device-level key storage using Apple Keychain and Android Keystore with automated session expiration.",
      },
      {
        title: "Hardware Peripheral & Camera Integration",
        desc: "High-speed camera barcode scanning, QR pass verification, Bluetooth thermal receipt printing, RFID reader support, and background GPS dispatch tracking.",
      },
      {
        title: "Sub-Second Push Notification Engine",
        desc: "Integrated with Apple APNs and Firebase Cloud Messaging (FCM). Delivers real-time emergency alerts, parent notices, maintenance dispatches, and manager approval requests.",
      },
      {
        title: "Automated Mobile CI/CD & App Store Deployment",
        desc: "Automated Fastlane build and deployment pipelines compiling, signing, testing, and distributing releases to TestFlight, Google Play Internal, and enterprise MDM portals.",
      },
    ],
    workflowTitle: "Mobile App Store & Enterprise MDM Lifecycle",
    workflowSubtext: "From frontline UI wireframes to automated store publishing and remote-wipe security management.",
    workflow: [
      { phase: "Phase 1: Field Worker UX & Wireframing", duration: "Weeks 1–2", desc: "Observing frontline workers in the field to design high-contrast, thumb-friendly interfaces optimized for rapid one-handed data entry." },
      { phase: "Phase 2: Offline Data Schema & Security", duration: "Weeks 3–4", desc: "Designing on-device SQLite tables, conflict resolution rules (server-wins vs client-wins), and biometric credential workflows." },
      { phase: "Phase 3: React Native Sprint Engineering", duration: "Weeks 5–8", desc: "Building native views, camera barcode scanners, push notification handlers, and real-time WebSocket synchronization." },
      { phase: "Phase 4: Device Lab QA & Field Simulation", duration: "Weeks 9–10", desc: "Testing across 30+ physical iOS and Android smartphones, simulating intermittent 2G/3G connections and airplane mode toggles." },
      { phase: "Phase 5: Store Publishing & MDM Distribution", duration: "Weeks 11+", desc: "Publishing signed builds to Apple App Store, Google Play Console, or internal Enterprise Mobile Device Management (MDM) portals." },
    ],
    benchmarkTitle: "Mobile Performance & Stability Benchmarks",
    benchmarks: [
      { value: "99.9%", label: "App Crash-Free User Sessions" },
      { value: "100%", label: "Offline Operational Functionality" },
      { value: "< 5ms", label: "Local SQLite On-Device Query Speed" },
      { value: "60 fps", label: "Fluid Native UI Animation Performance" },
    ],
    securityTitle: "Mobile Hardware Cryptography & Endpoint Defense",
    securityDesc: "Data on device is encrypted with SQLCipher AES-256. Webhooks support remote-wipe commands that instantly erase cached database records if an employee loses their device.",
    securityBadges: [
      { name: "SQLCipher", desc: "On-Device AES-256" },
      { name: "Secure Enclave", desc: "Biometric Keys" },
      { name: "Remote Wipe", desc: "Admin Kill-Switch" },
      { name: "Zero Plaintext", desc: "Keychain Storage" },
    ],
    faqs: [
      ["Can mobile app users record data when they have completely lost internet connection?", "Yes. Our mobile apps are engineered offline-first with an encrypted on-device SQLite database. Workers can record inspections, sign work orders, or scan barcodes offline. The app automatically syncs all queued records the second an internet connection is re-established."],
      ["How are data conflicts handled when multiple workers edit records offline?", "Our synchronization engine utilizes deterministic conflict resolution rules (configurable as either timestamp-based last-write-wins or transactional field-level merging). Conflicted records that require human review are flagged in an administrative exception queue."],
      ["Can we distribute the app privately to our employees without publishing to the public App Store?", "Yes. We support multiple private enterprise distribution models: Apple Business Manager (Custom Apps), Google Play Private Track, and direct Enterprise Mobile Device Management (MDM) APK / IPA deployment."],
      ["How is sensitive enterprise data protected if an employee loses their smartphone?", "All on-device data is encrypted using SQLCipher with AES-256 keys stored in the hardware Apple Keychain or Android Keystore. Administrators can also issue an instant remote-wipe command from the web console that purges local databases upon next connection."],
    ],
    relatedProductSlugs: ["hrms", "super-whatsapp", "society-management", "coaching-master"],
    idealFor: "Field technicians, logistics delivery fleets, residential security guards, hospital nurses, teachers, and mobile executives.",
  },
};

const SOLUTION_ALIASES = {
  "cloud-infrastructure": "cloud",
  "enterprise-solutions": "enterprise",
  "enterprise-architecture": "enterprise",
  "ai-solutions": "ai",
  custom: "custom-software",
  "mobile-solutions": "mobile",
  transformation: "digital-transformation",
};

export const generateStaticParams = () =>
  Object.keys(solutionsData).map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const targetSlug = SOLUTION_ALIASES[params.slug] || params.slug;
  let liveSol = null;
  try {
    // Direct Axios call for solution metadata
    const res = await api.get(`/api/v1/solutions/${targetSlug}`);
    liveSol = res.data?.data || res.data?.solution || res.data;
  } catch (err) {
    // Fallback to baseSol
  }

  const baseSol = solutionsData[targetSlug];
  const sol = liveSol ? { ...baseSol, ...liveSol } : baseSol;

  if (!sol) {
    return buildMetadata({
      title: "Enterprise Solutions | DEZORYN",
      path: `/solutions/${params.slug}`,
    });
  }

  return buildMetadata({
    title: `${sol.seoTitle || sol.title} — ${sol.tagline || "Enterprise Cloud Architecture"} | DEZORYN`,
    description: sol.seoDescription || sol.description,
    path: `/solutions/${params.slug}`,
    keywords: [
      sol.title,
      "enterprise solutions",
      "cloud software architecture",
      "scalable systems",
      "DEZORYN",
    ],
  });
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function SolutionDetailPage({ params }) {
  const targetSlug = SOLUTION_ALIASES[params.slug] || params.slug;
  let liveSol = null;
  try {
    // Direct Axios call inside Solution detail page
    const res = await api.get(`/api/v1/solutions/${targetSlug}`);
    liveSol = res.data?.data || res.data?.solution || res.data;
  } catch (err) {
    console.warn("Solution live detail notice:", err?.message || err);
  }

  const baseSol = solutionsData[targetSlug];
  if (!baseSol && !liveSol) notFound();

  const sol = liveSol ? { ...baseSol, ...liveSol, icon: baseSol?.icon || Layers } : baseSol;
  if (!sol.guarantees) sol.guarantees = ["Multi-Tenant Logical DB Isolation", "Sub-30ms Global Latency", "99.99% Availability SLA"];
  if (!sol.narrative) sol.narrative = sol.description ? [sol.description] : ["Enterprise cloud architecture engineered for scale and resilience."];
  if (!sol.capabilities) sol.capabilities = [];
  if (!sol.telemetry) sol.telemetry = { latency: "< 30ms", uptime: "99.99%" };
  const Icon = sol.icon || Layers;
  const relatedProducts = (sol.relatedProductSlugs || []).map(getProduct).filter(Boolean);

  const serviceSchema = generateServiceSchema({ ...sol, slug: params.slug });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Solutions", url: "/solutions" },
    { name: sol.title, url: `/solutions/${params.slug}` },
  ]);

  return (
    <>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[450px] w-[600px] rounded-full bg-electric/20 blur-[130px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Solutions", href: "/solutions" },
              { label: sol.title },
            ]}
          />

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-5 shadow-sm shadow-electric/10">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <Icon size={14} className="text-electric" />
              <span>{sol.badge}</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              {sol.title}
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 mt-3 leading-snug">
              {sol.tagline}
            </p>

            <p className="lead mt-6 text-base sm:text-lg text-cool leading-relaxed">
              {sol.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={`/contact-sales?solution=${encodeURIComponent(sol.title)}`} arrow>
                Consult Solutions Architect
              </Button>
              <Button href="/demo" variant="secondary" arrow>
                Book Interactive Walkthrough
              </Button>
            </div>
          </div>

          {/* ─── EXPANSIVE ARCHITECTURAL COMMAND STAGE (LARGE WIDESCREEN IMAGE) ─── */}
          <div className="mt-14">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#070b16] shadow-2xl p-3 sm:p-4 group">
              {/* Window Bar Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3 px-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 border border-red-500/30" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 border border-yellow-500/30" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 border border-emerald-500/30" />
                  <span className="ml-3 text-cool/80 text-[11px] hidden sm:inline">
                    dezoryn-telemetry-console // {sol.slug}.architecture.spec
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    CLUSTER HEALTHY
                  </span>
                  <span className="text-cool/60 hidden md:inline">|</span>
                  <span className="text-cool/80 hidden md:inline">{sol.telemetry.latency}</span>
                  <span className="text-cool/60 hidden md:inline">|</span>
                  <span className="text-electric">{sol.telemetry.uptime}</span>
                </div>
              </div>

              {/* Expansive Architectural Showcase Stage (Optimized for Mobile & Desktop) */}
              <div className="relative aspect-[4/3] sm:aspect-[16/9] min-h-[240px] sm:min-h-[340px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#040711]">
                <img
                  src={sol.image}
                  alt={`${sol.title} Architectural Blueprint`}
                  className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />
                
                {/* Vignettes & Gradients */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040711]/90 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#040711]/60 via-transparent to-transparent" />

                {/* Live Architectural Overlay Callouts */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-electric/40 bg-[#070b16]/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-mono text-electric backdrop-blur-md shadow-lg shadow-electric/10">
                    {sol.blueprintTitle}
                  </span>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 hidden sm:flex items-center gap-2">
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
                    Verified Production Spec
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-mono">
                    <span className="rounded-lg border border-white/15 bg-[#070b16]/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-white/90 backdrop-blur-md">
                      Security: {sol.telemetry.encryption}
                    </span>
                    <span className="rounded-lg border border-white/15 bg-[#070b16]/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-cool/90 backdrop-blur-md hidden md:inline">
                      Isolation: {sol.telemetry.isolation}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] sm:text-[11px] font-mono text-cool/80 bg-black/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded backdrop-blur-md">
                      DEZORYN Systems Architecture
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TAILORED PROBLEM VS ARCHITECTURAL SOLUTION ─── */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-mono text-electric uppercase tracking-wider block">
                Engineering Perspective
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                {sol.problemHeading}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">
                {sol.problemSubtext}
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#070b16] p-5 space-y-3">
                <div className="text-xs font-mono text-electric uppercase tracking-wider border-b border-white/5 pb-2">
                  Architectural Guarantees
                </div>
                {sol.guarantees.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-white">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 text-sm sm:text-base text-cool/90 leading-relaxed font-normal">
              {sol.narrative.map((para, idx) => (
                <p key={idx} className="p-5 rounded-xl border border-white/5 bg-white/[0.015]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 TAILORED ARCHITECTURAL PILLARS ─── */}
      <section className="section bg-midnight/70 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-14">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Core Pillars
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {sol.pillarHeading}
            </h2>
            <p className="mt-3 text-sm text-cool leading-relaxed">
              {sol.pillarSubtext}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sol.capabilities.map((cap, i) => (
              <div
                key={i}
                className="card p-6 border-white/10 bg-[#070b16] transition-all duration-300 hover:border-electric/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-electric/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/15 text-electric font-mono text-xs font-bold border border-electric/30">
                    0{i + 1}
                  </span>
                  <span className="text-[10px] font-mono text-cool/70 uppercase">
                    Pillar 0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg leading-snug">{cap.title}</h3>
                <p className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAILORED IMPLEMENTATION METHODOLOGY ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Deployment Model
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {sol.workflowTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-cool">
              {sol.workflowSubtext}
            </p>
          </div>

          <div className="relative border-l-2 border-electric/30 ml-4 sm:ml-8 space-y-6 sm:space-y-8 pl-5 sm:pl-8">
            {sol.workflow.map((step, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[28px] sm:-left-[43px] top-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-midnight border-2 border-electric text-electric font-mono text-[11px] sm:text-xs font-bold group-hover:scale-110 transition-transform">
                  {idx + 1}
                </span>

                <div className="rounded-xl border border-white/10 bg-[#070b16] p-5 transition-all hover:border-electric/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {step.phase}
                    </h3>
                    <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-mono text-electric">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-cool leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAILORED IMPACT BENCHMARKS ─── */}
      <section className="section bg-midnight/30 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-12 text-center mx-auto">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Empirical Metrics
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {sol.benchmarkTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-cool">
              Domain-specific operational indicators benchmarked across live production environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sol.benchmarks.map((met, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#070b16] p-6 text-center shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 font-mono">
                  {met.value}
                </div>
                <div className="mt-3 text-xs sm:text-sm text-cool leading-relaxed">
                  {met.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAILORED SECURITY & COMPLIANCE ─── */}
      <section className="section bg-midnight/60 border-b border-line">
        <div className="container-x">
          <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#0c1322] to-[#070b16] p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-electric uppercase tracking-wider mb-3">
                  <ShieldCheck size={16} />
                  <span>DOMAIN GOVERNANCE POSTURE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {sol.securityTitle}
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-cool leading-relaxed">
                  {sol.securityDesc}
                </p>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {sol.securityBadges.map((badge, bIdx) => (
                    <div key={bIdx} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-sm font-bold text-white font-mono">{badge.name}</div>
                      <div className="text-[10px] text-cool mt-0.5">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#050811] p-6 space-y-4">
                <div className="text-xs font-mono text-electric uppercase tracking-wider border-b border-white/5 pb-2">
                  Technical Architecture Packet
                </div>
                <p className="text-xs text-cool leading-relaxed">
                  Full architectural blueprints, SLA schedules, penetration testing certificates, and mutual Non-Disclosure Agreements are available for enterprise review.
                </p>
                <div className="pt-2">
                  <Button href="/contact-sales" variant="secondary" arrow className="w-full justify-center">
                    Request Architecture Packet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TAILORED DOMAIN FAQ ─── */}
      <section className="section bg-midnight/30 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-12 text-center mx-auto">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Technical Due Diligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Frequently Asked Technical Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-cool">
              Direct engineering answers specific to {sol.title.toLowerCase()}.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQ items={sol.faqs} />
          </div>
        </div>
      </section>

      {/* ─── RELEVANT PRODUCTION PRODUCTS ─── */}
      {relatedProducts.length > 0 && (
        <section className="section bg-midnight/60 border-b border-line">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="max-w-4xl">
                <span className="text-xs font-mono text-electric uppercase tracking-wider">
                  Live Software Applications
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  Ready-to-Deploy Platforms Using This Architecture
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-cool">
                  Explore specialized DEZORYN SaaS platforms engineered with these exact principles.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-electric hover:underline"
              >
                View all products <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CALL TO ACTION ─── */}
      <CTASection
        title={`Ready to Implement ${sol.title}?`}
        text={`Consult with our senior enterprise software architects to scope your system topology, database models, and deployment timeline.`}
        primary={["Consult Solutions Architect", `/contact-sales?solution=${encodeURIComponent(sol.title)}`]}
        secondary={["Book Live Interactive Demo", "/demo"]}
      />
    </>
  );
}
