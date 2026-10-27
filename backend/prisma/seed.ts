import {
  PrismaClient,
  AdminStatus,
  PublishStatus,
  ComparisonCategory,
  AttributeDataType,
  BusinessSize,
  DeploymentType,
  PartnerTier,
  HttpMethod,
  JobType,
  SettingGroup,
  MenuLocation,
  AssetType,
  LeadSource,
  LeadStatus,
  LeadPriority,
  DemoStatus,
  NewsletterStatus,
  AuditResult,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { createRequire } from "module";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const req = createRequire(path.resolve("./package.json"));

// Load source datasets
const data = req("../frontend/lib/data.js");
const caseStudies = req("../frontend/lib/caseStudiesData.js");
const crm = req("../admin/lib/admin/mock-data/leads.js");
const demos = req("../admin/lib/admin/mock-data/demos.js");
const media = req("../admin/lib/admin/mock-data/media.js");
const pages = req("../admin/lib/admin/mock-data/pages.js");
const website = req("../admin/lib/admin/mock-data/website.js");
const careers = req("../admin/lib/admin/mock-data/careers-partners.js");
const content = req("../admin/lib/admin/mock-data/content.js");
const users = req("../admin/lib/admin/mock-data/users.js");
const audit = req("../admin/lib/admin/mock-data/audit-logs.js");

function mapBusinessSize(s?: string): BusinessSize {
  if (!s) return BusinessSize.MEDIUM;
  const upper = s.toUpperCase();
  if (upper.includes("SMALL")) return BusinessSize.SMALL;
  if (upper.includes("LARGE")) return BusinessSize.LARGE;
  if (upper.includes("ENTERPRISE")) return BusinessSize.ENTERPRISE;
  return BusinessSize.MEDIUM;
}

function mapDeployment(d?: string): DeploymentType {
  if (!d) return DeploymentType.CLOUD;
  const upper = d.toUpperCase();
  if (upper.includes("HYBRID")) return DeploymentType.HYBRID;
  if (upper.includes("PREMISE") || upper.includes("ON_PREMISE")) return DeploymentType.ON_PREMISE;
  return DeploymentType.CLOUD;
}

function mapLeadSource(s?: string): LeadSource {
  if (!s) return LeadSource.GENERAL_CONTACT;
  const upper = s.toUpperCase();
  if (upper.includes("DEMO")) return LeadSource.DEMO_REQUEST;
  if (upper.includes("SALES")) return LeadSource.CONTACT_SALES;
  if (upper.includes("TRIAL")) return LeadSource.START_TRIAL;
  if (upper.includes("PARTNER")) return LeadSource.PARTNERSHIP;
  return LeadSource.GENERAL_CONTACT;
}

function mapLeadStatus(s?: string): LeadStatus {
  if (!s) return LeadStatus.NEW;
  const upper = s.toUpperCase();
  if (upper === "QUALIFIED") return LeadStatus.QUALIFIED;
  if (upper === "CONTACTED") return LeadStatus.CONTACTED;
  if (upper === "DEMO") return LeadStatus.DEMO;
  if (upper === "PROPOSAL") return LeadStatus.PROPOSAL;
  if (upper === "NEGOTIATING" || upper === "NEGOTIATION") return LeadStatus.NEGOTIATING;
  if (upper === "WON") return LeadStatus.WON;
  if (upper === "LOST") return LeadStatus.LOST;
  if (upper === "CLOSED") return LeadStatus.CLOSED;
  return LeadStatus.NEW;
}

function mapLeadPriority(p?: string): LeadPriority {
  if (!p) return LeadPriority.MEDIUM;
  const upper = p.toUpperCase();
  if (upper === "URGENT") return LeadPriority.URGENT;
  if (upper === "HIGH") return LeadPriority.HIGH;
  if (upper === "LOW") return LeadPriority.LOW;
  return LeadPriority.MEDIUM;
}

function mapDemoStatus(s?: string): DemoStatus {
  if (!s) return DemoStatus.PENDING;
  const upper = s.toUpperCase();
  if (upper === "CONFIRMED") return DemoStatus.CONFIRMED;
  if (upper === "COMPLETED") return DemoStatus.COMPLETED;
  if (upper === "CANCELLED") return DemoStatus.CANCELLED;
  return DemoStatus.PENDING;
}

function mapPartnerTier(t?: string): PartnerTier {
  if (!t) return PartnerTier.TECHNOLOGY;
  const upper = t.toUpperCase();
  if (upper.includes("SOLUTION")) return PartnerTier.SOLUTION;
  if (upper.includes("CHANNEL") || upper.includes("RESELLER")) return PartnerTier.CHANNEL;
  return PartnerTier.TECHNOLOGY;
}

function mapJobType(t?: string): JobType {
  if (!t) return JobType.FULL_TIME;
  const upper = t.toUpperCase();
  if (upper.includes("PART")) return JobType.PART_TIME;
  if (upper.includes("CONTRACT")) return JobType.CONTRACT;
  if (upper.includes("REMOTE")) return JobType.REMOTE;
  return JobType.FULL_TIME;
}

async function main() {
  console.log("🌱 Starting Comprehensive DEZORYN TECHNOLOGY Database Master Seed...");

  // ----------------------------------------------------------------------------
  // 1. Roles & Permissions (RBAC)
  // ----------------------------------------------------------------------------
  console.log("  → [1/17] Seeding RBAC Roles & Permissions...");

  const rolesData = [
    {
      id: "super_admin",
      name: "Super Administrator",
      description: "Full root access across all CMS modules, user permissions, audit logs, and settings.",
      isSystem: true,
    },
    {
      id: "website_mgr",
      name: "Website Manager",
      description: "Manages homepage builder, website pages, navigation menus, and media library.",
      isSystem: false,
    },
    {
      id: "product_mgr",
      name: "Product Manager",
      description: "Configures SaaS products, marketplace listings, plans, and comparison matrices.",
      isSystem: false,
    },
    {
      id: "content_editor",
      name: "Content Editor",
      description: "Writes and publishes blog articles, case studies, runbooks, guides, and FAQs.",
      isSystem: false,
    },
    {
      id: "sales_mgr",
      name: "Sales Manager",
      description: "Oversees inbound leads, CRM deal pipeline, and demo walkthrough schedules.",
      isSystem: false,
    },
  ];

  for (const r of rolesData) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: { name: r.name, description: r.description, isSystem: r.isSystem },
      create: r,
    });
  }

  const permissionsData = [
    { code: "website:read", name: "View Website Pages", module: "Website CMS", description: "Browse all static and CMS pages" },
    { code: "website:write", name: "Edit Website Pages", module: "Website CMS", description: "Modify page content, sections and metadata" },
    { code: "website:publish", name: "Publish Website Pages", module: "Website CMS", description: "Publish or archive website pages" },
    { code: "products:read", name: "View Products", module: "Catalog", description: "Browse SaaS products and plans" },
    { code: "products:write", name: "Edit Products", module: "Catalog", description: "Create or modify SaaS products and comparison matrix" },
    { code: "products:publish", name: "Publish Products", module: "Catalog", description: "Publish or unlist products" },
    { code: "solutions:manage", name: "Manage Solutions", module: "Architecture", description: "Manage enterprise solutions and industries" },
    { code: "leads:read", name: "View Leads", module: "CRM", description: "Access inbound contact sales inquiries" },
    { code: "leads:manage", name: "Manage Leads", module: "CRM", description: "Update lead status, owners, and deal values" },
    { code: "demos:manage", name: "Manage Demos", module: "Calendar", description: "Schedule and manage demo sessions" },
    { code: "content:manage", name: "Manage Content", module: "Resources", description: "Manage blog posts, insights, docs, and APIs" },
    { code: "media:manage", name: "Manage Media", module: "Media", description: "Upload and delete media assets" },
    { code: "settings:manage", name: "System Settings", module: "System", description: "Update site configuration and parameters" },
    { code: "users:manage", name: "Admin Governance", module: "System", description: "Manage admin users, roles and permissions" },
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, module: p.module, description: p.description },
      create: p,
    });
  }

  // Grant all permissions to Super Administrator
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: "super_admin",
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: "super_admin",
        permissionId: p.id,
      },
    });
  }

  // Assign specific permissions to other roles
  const permMap = new Map(allPermissions.map((p) => [p.code, p.id]));
  const rolePermMappings: Record<string, string[]> = {
    website_mgr: ["website:read", "website:write", "website:publish", "media:manage"],
    product_mgr: ["products:read", "products:write", "products:publish", "solutions:manage"],
    content_editor: ["content:manage", "website:read", "website:write", "media:manage"],
    sales_mgr: ["leads:read", "leads:manage", "demos:manage"],
  };

  for (const [rId, codes] of Object.entries(rolePermMappings)) {
    for (const code of codes) {
      const pId = permMap.get(code);
      if (pId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: rId, permissionId: pId } },
          update: {},
          create: { roleId: rId, permissionId: pId },
        });
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 2. Admin Users
  // ----------------------------------------------------------------------------
  console.log("  → [2/17] Seeding Admin Users...");
  const defaultPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || "DezorynAdmin2026!";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  const adminUsersList = users.MOCK_ADMIN_USERS || [];
  for (const u of adminUsersList) {
    await prisma.adminUser.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        roleId: u.roleId || "super_admin",
        status: u.status === "Active" ? AdminStatus.ACTIVE : AdminStatus.INACTIVE,
        twoFactorEnforced: !!u.twoFactorEnforced,
      },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash,
        roleId: u.roleId || "super_admin",
        status: u.status === "Active" ? AdminStatus.ACTIVE : AdminStatus.INACTIVE,
        twoFactorEnforced: !!u.twoFactorEnforced,
        lastLoginAt: new Date(),
      },
    });
  }

  // Ensure default bootstrap admin exists
  await prisma.adminUser.upsert({
    where: { email: "admin@dezoryn.com" },
    update: { roleId: "super_admin", status: AdminStatus.ACTIVE, passwordHash },
    create: {
      email: "admin@dezoryn.com",
      name: "Shikha Gour",
      passwordHash,
      roleId: "super_admin",
      status: AdminStatus.ACTIVE,
      twoFactorEnforced: true,
    },
  });

  // ----------------------------------------------------------------------------
  // 3. Global Site Settings
  // ----------------------------------------------------------------------------
  console.log("  → [3/17] Seeding Global Site Settings...");
  const siteSettings = [
    { key: "site_name", value: "DEZORYN TECHNOLOGY", description: "Global brand name", group: SettingGroup.GENERAL },
    { key: "site_tagline", value: "Technology That Moves Businesses Forward", description: "Brand motto", group: SettingGroup.GENERAL },
    { key: "contact_email", value: "support@dezoryn.com", description: "Public contact address", group: SettingGroup.CONTACT },
    { key: "sales_email", value: "sales@dezoryn.com", description: "Enterprise sales address", group: SettingGroup.CONTACT },
    { key: "phone_primary", value: "+1 (800) 555-DEZO", description: "Global toll-free telephone", group: SettingGroup.CONTACT },
    { key: "primary_currency", value: "USD", description: "Baseline pricing currency", group: SettingGroup.LOCALIZATION },
    { key: "annual_discount_rate", value: "0.20", description: "Annual plan discount percentage (20%)", group: SettingGroup.GENERAL },
    { key: "support_hours", value: "24/7 Global Enterprise Support", description: "Support SLA commitment", group: SettingGroup.CONTACT },
    { key: "session_timeout_minutes", value: "120", description: "Admin session inactivity timeout", group: SettingGroup.SECURITY },
    { key: "mfa_enforced", value: "true", description: "Enforce MFA for all privileged roles", group: SettingGroup.SECURITY },
    { key: "recaptcha_site_key", value: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", description: "Google reCAPTCHA v3 site key", group: SettingGroup.SECURITY },
    { key: "analytics_google_tag", value: "G-DEZORYN2026", description: "Google Analytics 4 measurement ID", group: SettingGroup.GENERAL },
  ];

  for (const s of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // ----------------------------------------------------------------------------
  // 4. Company Profile & Brand Narrative
  // ----------------------------------------------------------------------------
  console.log("  → [4/17] Seeding Company Profile & Brand Narrative...");
  await prisma.companyProfile.upsert({
    where: { id: "corp_profile_main" },
    update: {
      leadershipRoster: [
        { name: "Alexander Wright", role: "Chief Executive Officer & Co-Founder", bio: "Enterprise cloud architect with 15+ years scaling multi-tenant SaaS.", location: "Bhopal, India" },
        { name: "Shikha Gour", role: "Chief Technology Officer & Head of Architecture", bio: "Pioneering zero-trust RBAC systems and AI-assisted workflows.", location: "Bhopal, India" },
        { name: "David Kim", role: "VP of Product & SaaS Ecosystem", bio: "Overseeing product vision across 18 specialized SaaS verticals.", location: "Bhopal, India" },
      ],
      officeLocations: [
        { city: "Bhopal, India", type: "Corporate Headquarters & Engineering Center", address: "Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India", phone: "+91 755 400-DEZO", email: "support@dezoryn.com", timezone: "IST (UTC+5:30)", teamCount: "Central Technology Team" },
      ],
    },
    create: {
      id: "corp_profile_main",
      siteName: "DEZORYN TECHNOLOGY",
      tagline: "Technology That Moves Businesses Forward.",
      mission: "To make powerful technology accessible, scalable, and intelligent for businesses everywhere.",
      vision: "To build a global ecosystem of software products that powers the next generation of businesses.",
      values: [
        { title: "Architectural Craftsmanship", desc: "Engineered around defense-in-depth, least privilege, and zero-trust verification." },
        { title: "Zero Complexity Bloat", desc: "Building intuitive interfaces backed by robust PostgreSQL schemas." },
        { title: "Customer Sovereignty", desc: "Complete data isolation and encryption in transit and at rest." },
      ],
      leadershipRoster: [
        { name: "Alexander Wright", role: "Chief Executive Officer & Co-Founder", bio: "Enterprise cloud architect with 15+ years scaling multi-tenant SaaS.", location: "Bhopal, India" },
        { name: "Shikha Gour", role: "Chief Technology Officer & Head of Architecture", bio: "Pioneering zero-trust RBAC systems and AI-assisted workflows.", location: "Bhopal, India" },
        { name: "David Kim", role: "VP of Product & SaaS Ecosystem", bio: "Overseeing product vision across 18 specialized SaaS verticals.", location: "Bhopal, India" },
      ],
      officeLocations: [
        { city: "Bhopal, India", type: "Corporate Headquarters & Engineering Center", address: "Prajapati Complex, Kolar Road, Bhopal, Madhya Pradesh 462042, India", phone: "+91 755 400-DEZO", email: "support@dezoryn.com", timezone: "IST (UTC+5:30)", teamCount: "Central Technology Team" },
      ],
      stats: {
        availabilitySla: "99.95%",
        productionEngines: 18,
        countriesServed: 32,
        enterpriseWorkspaces: "1,200+",
      },
    },
  });

  // ----------------------------------------------------------------------------
  // 5. Legal Policies
  // ----------------------------------------------------------------------------
  console.log("  → [5/17] Seeding Corporate Legal Policies...");
  const legalPolicies = [
    {
      slug: "privacy",
      title: "Privacy Policy",
      subtitle: "Data collection, processing disclosures, and international user rights.",
      version: "v2.4",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["GDPR Compliant", "CCPA Ready", "Data Isolation"],
      clauses: [
        { heading: "1. Scope & Overview", content: "This Privacy Policy describes how DEZORYN TECHNOLOGY collects, uses, and safeguards information when you visit our website, explore our SaaS marketplace, or interact with our enterprise applications." },
        { heading: "2. Information We Collect", content: "We collect information voluntarily provided in inquiry forms, operational tenant data entered into active SaaS workspaces, and automated technical telemetry for security defense." },
        { heading: "3. Multi-Tenant Data Isolation & Security", content: "DEZORYN enforces strict logical data isolation across all SaaS products. Tenant database schemas, file uploads, and session tokens are strictly partitioned." },
      ],
    },
    {
      slug: "terms",
      title: "Terms & Conditions of Service",
      subtitle: "Terms governing use of the DEZORYN website, SaaS marketplace, and software platforms.",
      version: "v3.1",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["Commercial Cloud Agreement", "Master Service Agreement"],
      clauses: [
        { heading: "1. Acceptance of Terms", content: "By accessing the DEZORYN website or associated software platforms, you agree to be bound by these Terms & Conditions." },
        { heading: "2. SaaS Subscriptions & Account Access", content: "Access is granted on a subscription basis subject to timely fee payment and active plan limits." },
      ],
    },
    {
      slug: "security",
      title: "Enterprise Security Architecture Policy",
      subtitle: "Architectural controls, encryption benchmarks, and data protection practices.",
      version: "v2.0",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["SOC 2 Type II", "AES-256 / TLS 1.3", "Zero-Trust RBAC"],
      clauses: [
        { heading: "1. Security Philosophy", content: "Security is engineered around defense-in-depth, least privilege, and zero-trust verification." },
        { heading: "2. Data Encryption Standards", content: "Data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption." },
      ],
    },
    {
      slug: "refund",
      title: "Commercial Refund & SLA Credit Policy",
      subtitle: "Subscription billing refund procedures and uptime SLA breach credits.",
      version: "v1.8",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["99.95% Availability SLA", "Prorated Billing"],
      clauses: [
        { heading: "1. 14-Day Free Evaluation Period", content: "New organizational subscribers receive a 14-day fully featured evaluation without upfront charge." },
        { heading: "2. SLA Performance Credits", content: "If availability drops below 99.95% in any calendar month, customers may claim service credits." },
      ],
    },
    {
      slug: "cookies",
      title: "Cookie Policy & Telemetry Notice",
      subtitle: "Information on session cookies, security tokens, and performance metrics.",
      version: "v2.1",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["ePrivacy Directive", "Zero Ad-Trackers"],
      clauses: [
        { heading: "1. Essential Session Cookies", content: "We use strictly necessary cryptographic cookies for authentication and CSRF token verification." },
      ],
    },
    {
      slug: "acceptable-use",
      title: "Acceptable Cloud Service Usage Policy",
      subtitle: "Rules governing lawful use of DEZORYN cloud infrastructure and developer APIs.",
      version: "v1.5",
      lastReviewedDate: "October 1, 2026",
      frameworks: ["Fair Use Policy", "DDoS Defense"],
      clauses: [
        { heading: "1. Prohibited Actions", content: "Unauthorized penetration testing, denial of service attacks, scraping, and abusive API traffic are strictly prohibited." },
      ],
    },
  ];

  for (let i = 0; i < legalPolicies.length; i++) {
    const p = legalPolicies[i];
    await prisma.legalPolicy.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        version: p.version,
        lastReviewedDate: p.lastReviewedDate,
        frameworks: p.frameworks,
        clauses: p.clauses,
        displayOrder: i + 1,
      },
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        version: p.version,
        lastReviewedDate: p.lastReviewedDate,
        frameworks: p.frameworks,
        clauses: p.clauses,
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 6. Product Categories
  // ----------------------------------------------------------------------------
  console.log("  → [6/17] Seeding Product Categories...");
  const categoriesList = data.CATEGORIES || [
    "Education", "Healthcare", "Real Estate", "Business Management", "Security",
    "HR", "CRM", "Finance", "AI", "Automation", "Communication", "Operations"
  ];

  const catMap = new Map<string, string>();
  for (let i = 0; i < categoriesList.length; i++) {
    const catName = categoriesList[i];
    const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = await prisma.productCategory.upsert({
      where: { slug: catSlug },
      update: {
        name: catName,
        description: `Enterprise-grade ${catName.toLowerCase()} SaaS solutions engineered for global scale and reliability.`,
        displayOrder: i + 1,
        isFeatured: i < 4,
      },
      create: {
        slug: catSlug,
        name: catName,
        description: `Enterprise-grade ${catName.toLowerCase()} SaaS solutions engineered for global scale and reliability.`,
        displayOrder: i + 1,
        isFeatured: i < 4,
        badge: i === 0 ? "Popular" : i === 1 ? "High Demand" : i === 2 ? "Enterprise" : null,
      },
    });
    catMap.set(catName, created.id);
    catMap.set(catSlug, created.id);
  }

  // ----------------------------------------------------------------------------
  // 7. SaaS Products, Plans, Features
  // ----------------------------------------------------------------------------
  console.log("  → [7/17] Seeding All 13 SaaS Products, Plans, and Features...");
  const rawProducts = data.products || [];

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const catId = catMap.get(p.category) || catMap.get("operations") || Array.from(catMap.values())[0];

    const createdProd = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        categoryId: catId,
        image: p.image,
        size: mapBusinessSize(p.size),
        deployment: mapDeployment(p.deployment),
        isAiPowered: !!(p.ai || p.aiPowered),
        isFeatured: ["schooly-core", "dezo-care", "real-estate", "society-management"].includes(p.slug),
        isTrending: ["schooly-core", "dezo-care", "crm-pipeline", "super-whatsapp"].includes(p.slug),
        rating: p.rating || "4.9/5",
        hue: p.hue || 200,
        tags: p.tags || [],
        benefits: p.benefits || [],
        featuresList: p.features || p.featuresList || [],
        modules: p.modules || [],
        integrations: p.integrations || [],
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        categoryId: catId,
        image: p.image,
        size: mapBusinessSize(p.size),
        deployment: mapDeployment(p.deployment),
        isAiPowered: !!(p.ai || p.aiPowered),
        isFeatured: ["schooly-core", "dezo-care", "real-estate", "society-management"].includes(p.slug),
        isTrending: ["schooly-core", "dezo-care", "crm-pipeline", "super-whatsapp"].includes(p.slug),
        rating: p.rating || "4.9/5",
        hue: p.hue || 200,
        tags: p.tags || [],
        benefits: p.benefits || [],
        featuresList: p.features || p.featuresList || [],
        modules: p.modules || [],
        integrations: p.integrations || [],
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });

    // Seed product features
    if (p.features && Array.isArray(p.features)) {
      for (let fIdx = 0; fIdx < p.features.length; fIdx++) {
        const item = p.features[fIdx];
        const title = Array.isArray(item) ? item[0] : (typeof item === "string" ? item : item.title || `Feature ${fIdx + 1}`);
        const desc = Array.isArray(item) ? item[1] : (typeof item === "string" ? item : item.desc || "");

        const featId = `feat_${p.slug}_${fIdx}`;
        await prisma.productFeature.upsert({
          where: { id: featId },
          update: { title, description: desc, displayOrder: fIdx + 1 },
          create: {
            id: featId,
            productId: createdProd.id,
            title,
            description: desc,
            displayOrder: fIdx + 1,
          },
        });
      }
    }

    // Seed product plans
    if (p.plans && Array.isArray(p.plans)) {
      for (let plIdx = 0; plIdx < p.plans.length; plIdx++) {
        const pl = p.plans[plIdx];
        const planId = `plan_${p.slug}_${pl.id || plIdx}`;
        await prisma.productPlan.upsert({
          where: { id: planId },
          update: {
            name: pl.name,
            description: pl.for || "",
            monthlyPriceUsd: pl.monthly_price_usd !== null && pl.monthly_price_usd !== undefined ? pl.monthly_price_usd : 0,
            annualPriceUsd: pl.annual_price_usd !== null && pl.annual_price_usd !== undefined ? pl.annual_price_usd : null,
            features: pl.features || [],
            isHighlighted: !!pl.highlighted,
            isEnterprise: !!pl.enterprise,
            displayOrder: plIdx + 1,
          },
          create: {
            id: planId,
            productId: createdProd.id,
            slug: pl.id || `tier-${plIdx + 1}`,
            name: pl.name,
            description: pl.for || "",
            monthlyPriceUsd: pl.monthly_price_usd !== null && pl.monthly_price_usd !== undefined ? pl.monthly_price_usd : 0,
            annualPriceUsd: pl.annual_price_usd !== null && pl.annual_price_usd !== undefined ? pl.annual_price_usd : null,
            features: pl.features || [],
            isHighlighted: !!pl.highlighted,
            isEnterprise: !!pl.enterprise,
            displayOrder: plIdx + 1,
          },
        });
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 8. Comparison Attributes & Product Matrix
  // ----------------------------------------------------------------------------
  console.log("  → [8/17] Seeding Comparison Attributes & Comparison Matrix...");
  const comparisonAttrs = [
    { key: "attr_multi_tenant", name: "Isolated Multi-Tenant DB", category: ComparisonCategory.ARCHITECTURE, dataType: AttributeDataType.BOOLEAN, defaultValue: "True" },
    { key: "attr_rbac", name: "Fine-Grained RBAC & Auditing", category: ComparisonCategory.SECURITY, dataType: AttributeDataType.BOOLEAN, defaultValue: "True" },
    { key: "attr_sla", name: "Availability SLA Guarantee", category: ComparisonCategory.OPERATIONS, dataType: AttributeDataType.TEXT, defaultValue: "99.95% High Availability" },
    { key: "attr_api", name: "High-Throughput REST & Webhook APIs", category: ComparisonCategory.INTEGRATION, dataType: AttributeDataType.BOOLEAN, defaultValue: "True" },
    { key: "attr_backup", name: "Continuous Snapshot & Disaster Recovery", category: ComparisonCategory.DATA, dataType: AttributeDataType.TEXT, defaultValue: "15-min RPO / 1-hr RTO" },
    { key: "attr_sso", name: "SAML 2.0 & OIDC Single Sign-On", category: ComparisonCategory.SECURITY, dataType: AttributeDataType.BOOLEAN, defaultValue: "True" },
    { key: "attr_compliance", name: "SOC 2 Type II / HIPAA Readiness", category: ComparisonCategory.COMPLIANCE, dataType: AttributeDataType.TEXT, defaultValue: "Enterprise Vault Protected" },
  ];

  const attrRecords = [];
  for (let i = 0; i < comparisonAttrs.length; i++) {
    const a = comparisonAttrs[i];
    const rec = await prisma.comparisonAttribute.upsert({
      where: { key: a.key },
      update: { name: a.name, category: a.category, dataType: a.dataType, defaultValue: a.defaultValue, displayOrder: i + 1 },
      create: { ...a, displayOrder: i + 1, isPublished: true },
    });
    attrRecords.push(rec);
  }

  // Seed comparison values for each product
  const allProds = await prisma.product.findMany();
  for (const prod of allProds) {
    for (const attr of attrRecords) {
      const isBool = attr.dataType === AttributeDataType.BOOLEAN;
      await prisma.productComparisonValue.upsert({
        where: {
          productId_attributeId: {
            productId: prod.id,
            attributeId: attr.id,
          },
        },
        update: isBool ? { valueBool: true } : { valueText: attr.defaultValue },
        create: {
          productId: prod.id,
          attributeId: attr.id,
          valueBool: isBool ? true : null,
          valueText: isBool ? null : attr.defaultValue,
        },
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 9. Solutions Architecture
  // ----------------------------------------------------------------------------
  console.log("  → [9/17] Seeding 7 Enterprise Solutions...");
  const solutionsList = [
    {
      slug: "enterprise",
      name: "Enterprise Solutions",
      tagline: "Built for Complexity. Designed for Scale.",
      description: "Mission-critical enterprise software architectures designed for multi-tenant organizations, high transaction volumes, and strict regulatory governance.",
      capabilities: [
        { title: "Multi-Tenant Architecture", desc: "Complete data isolation, tenant-specific schemas, and centralized governance across regional operating entities." },
        { title: "Granular Role-Based Access (RBAC)", desc: "Fine-grained permissions, audit logging, and single sign-on (SSO) with Okta, Azure AD, and Google Workspace." },
        { title: "High-Throughput APIs", desc: "RESTful, GraphQL, and webhook interfaces engineered for sub-50ms latency under peak enterprise workloads." },
        { title: "Regulatory Compliance", desc: "Engineered in accordance with SOC 2, HIPAA, GDPR, and ISO 27001 security standards." },
      ],
      relatedProducts: ["schooly-core", "dezo-care", "hrms-enterprise"],
      icon: "Layers",
      displayOrder: 1,
    },
    {
      slug: "ai",
      name: "AI Solutions",
      tagline: "Intelligence Built Into Your Business.",
      description: "Enterprise artificial intelligence models and predictive workflows embedded directly into operational software to automate decisions and surface critical insights.",
      capabilities: [
        { title: "Operational AI Assistants", desc: "Context-aware conversational agents that query your internal knowledge base and execute ERP tasks." },
        { title: "Predictive Business Intelligence", desc: "Time-series forecasting for student performance, inventory demand, hospital bed occupancy, and revenue." },
        { title: "Document & Contract Intelligence", desc: "Automated clause classification, entity extraction, and compliance checking for legal and financial forms." },
        { title: "Workflow Decision Automation", desc: "AI models that classify incoming tickets, triage leads, and route complex exceptions automatically." },
      ],
      relatedProducts: ["legal-docs", "crm-pipeline"],
      icon: "Sparkles",
      displayOrder: 2,
    },
    {
      slug: "automation",
      name: "Automation Workflows",
      tagline: "Eliminate Friction. Accelerate Velocity.",
      description: "Event-driven asynchronous automation engines that eliminate manual administrative drag, connect distributed systems, and guarantee workflow compliance.",
      capabilities: [
        { title: "Event-Driven Triggers", desc: "Automate cross-departmental operations based on status changes, payment completions, or document uploads." },
        { title: "Document & Invoice Processing", desc: "Intelligent OCR and structured data extraction to process POs, receipts, and identity documents without manual data entry." },
        { title: "Approval Hierarchies", desc: "Configurable multi-level approval matrices for expense authorizations, leave approvals, and purchase orders." },
        { title: "Third-Party Sync & Webhooks", desc: "Bi-directional real-time data sync with ERPs, CRMs, communication channels, and payment gateways." },
      ],
      relatedProducts: ["super-whatsapp", "legal-docs", "society-management"],
      icon: "Workflow",
      displayOrder: 3,
    },
    {
      slug: "custom-software",
      name: "Custom Software Engineering",
      tagline: "Precision Engineering for Unique Workflows.",
      description: "When commercial off-the-shelf software doesn't fit your exact business logic, DEZORYN engineers bespoke cloud architectures tailored to your exact competitive advantage.",
      capabilities: [
        { title: "Bespoke ERP & Operations Suites", desc: "Tailored business logic mapped precisely to your organizational chart, billing formulas, and departmental protocols." },
        { title: "Granular Role-Based Access (RBAC)", desc: "Zero-trust permission hierarchies ensuring employees, managers, and auditors only access authorized data slices." },
        { title: "API-First Architecture", desc: "Clean, documented RESTful and GraphQL endpoints engineered for future system integrations and third-party interoperability." },
        { title: "Enterprise Audit Trails", desc: "Immutable logs tracking all data creation, modification, and export events for institutional regulatory compliance." },
      ],
      relatedProducts: ["school-master", "coaching-master", "college-master"],
      icon: "Code2",
      displayOrder: 4,
    },
    {
      slug: "digital-transformation",
      name: "Digital Transformation",
      tagline: "Modernize Legacy Systems Without Disruption.",
      description: "Strategic cloud migration and systems modernization that migrates on-premises spreadsheets and legacy monoliths into scalable multi-tenant cloud ecosystems.",
      capabilities: [
        { title: "Legacy System Audits", desc: "In-depth codebase and database forensics to identify bottlenecks, security vulnerabilities, and migration vectors." },
        { title: "Zero-Downtime Data Migration", desc: "Parallel-run synchronization strategies ensuring continuous business operations during database cutovers." },
        { title: "Staff Retraining & Change Management", desc: "Role-specific video runbooks, interactive staging sandboxes, and dedicated live cutover support." },
        { title: "Continuous Delivery Pipelines", desc: "Automated CI/CD pipelines with comprehensive automated testing and instant rollback capabilities." },
      ],
      relatedProducts: ["schooly-core", "dezo-care", "real-estate"],
      icon: "RefreshCw",
      displayOrder: 5,
    },
    {
      slug: "cloud",
      name: "Cloud Infrastructure",
      tagline: "High Availability. Zero-Trust Security.",
      description: "Resilient containerized cloud architectures engineered across distributed regions with automatic failover, database clustering, and sub-100ms latency.",
      capabilities: [
        { title: "Multi-Tenant Cloud Isolation", desc: "Logical or physical tenant separation with dedicated database schemas, connection pooling, and tenant encryption keys." },
        { title: "High Availability & Failover", desc: "Multi-availability zone replication with automated health checks, geo-routing, and 99.99% uptime SLA engineering." },
        { title: "Automated Backup & Disaster Recovery", desc: "Point-in-time recovery, automated daily database snapshots, and rapid replication protocols to safeguard enterprise data." },
        { title: "Performance Monitoring & Telemetry", desc: "Continuous distributed tracing, latency profiling, and edge telemetry to maintain sub-100ms response benchmarks." },
      ],
      relatedProducts: ["super-whatsapp", "crm-pipeline"],
      icon: "Cloud",
      displayOrder: 6,
    },
    {
      slug: "mobile",
      name: "Mobile & Omnichannel",
      tagline: "Connected Workforces Everywhere.",
      description: "Native and cross-platform mobile applications that bring enterprise ERP workflows, field reports, and customer portals directly into users' pockets.",
      capabilities: [
        { title: "Cross-Platform & Native Apps", desc: "Fluid iOS and Android applications built with React Native and native modules for maximum frame rates and low battery draw." },
        { title: "Offline-First Sync Engine", desc: "Local encrypted caching with automatic conflict resolution when field agents reconnect to cellular or Wi-Fi networks." },
        { title: "Push Notifications & Alerts", desc: "Instant transactional alerts, shift updates, and verification codes integrated with APNs and Firebase Cloud Messaging." },
        { title: "Biometric Device Authentication", desc: "Native FaceID and fingerprint authentication backed by hardware secure enclaves." },
      ],
      relatedProducts: ["society-management", "schooly-core", "hrms-enterprise"],
      icon: "Smartphone",
      displayOrder: 7,
    },
  ];

  for (const sol of solutionsList) {
    await prisma.solution.upsert({
      where: { slug: sol.slug },
      update: {
        name: sol.name,
        tagline: sol.tagline,
        description: sol.description,
        capabilities: sol.capabilities,
        relatedProducts: sol.relatedProducts,
        icon: sol.icon,
        displayOrder: sol.displayOrder,
      },
      create: {
        slug: sol.slug,
        name: sol.name,
        tagline: sol.tagline,
        description: sol.description,
        capabilities: sol.capabilities,
        relatedProducts: sol.relatedProducts,
        icon: sol.icon,
        displayOrder: sol.displayOrder,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 10. Industry Verticals
  // ----------------------------------------------------------------------------
  console.log("  → [10/17] Seeding 10 Industry Verticals...");
  const rawIndustries = data.industries || [];
  for (let i = 0; i < rawIndustries.length; i++) {
    const ind = rawIndustries[i];
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {
        name: ind.name,
        icon: ind.icon,
        shortDescription: ind.short,
        fullDescription: ind.solution || ind.short || "",
        metrics: [
          { value: "65%", label: "Admin Time Saved" },
          { value: "99.95%", label: "Uptime SLA" },
          { value: "0", label: "Manual Double-Entry" },
        ],
        challenges: [ind.problem || "Fragmented manual spreadsheets and disconnected departmental software."],
        solutions: [ind.solution || "Integrated multi-tenant cloud ERP."],
        productsUsed: ind.products || [],
        displayOrder: i + 1,
      },
      create: {
        slug: ind.slug,
        name: ind.name,
        icon: ind.icon,
        shortDescription: ind.short,
        fullDescription: ind.solution || ind.short || "",
        metrics: [
          { value: "65%", label: "Admin Time Saved" },
          { value: "99.95%", label: "Uptime SLA" },
          { value: "0", label: "Manual Double-Entry" },
        ],
        challenges: [ind.problem || "Fragmented manual spreadsheets and disconnected departmental software."],
        solutions: [ind.solution || "Integrated multi-tenant cloud ERP."],
        productsUsed: ind.products || [],
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 11. Projects & Showcase
  // ----------------------------------------------------------------------------
  console.log("  → [11/17] Seeding 13 Projects...");
  const rawProjects = data.projects || [];
  for (let i = 0; i < rawProjects.length; i++) {
    const proj = rawProjects[i];
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {
        name: proj.name,
        client: proj.industry + " Enterprise Client",
        category: proj.type || "SaaS",
        industry: proj.industry || "General",
        shortDescription: proj.result || proj.name,
        fullDescription: proj.result || proj.name,
        metrics: [{ value: "100%", label: "Live Deployment" }],
        techStack: proj.tech || ["Next.js", "PostgreSQL", "Node.js"],
        featuredImage: proj.image,
        isFeatured: i < 4,
        displayOrder: i + 1,
      },
      create: {
        slug: proj.slug,
        name: proj.name,
        client: proj.industry + " Enterprise Client",
        category: proj.type || "SaaS",
        industry: proj.industry || "General",
        shortDescription: proj.result || proj.name,
        fullDescription: proj.result || proj.name,
        metrics: [{ value: "100%", label: "Live Deployment" }],
        techStack: proj.tech || ["Next.js", "PostgreSQL", "Node.js"],
        featuredImage: proj.image,
        isFeatured: i < 4,
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 12. Case Studies
  // ----------------------------------------------------------------------------
  console.log("  → [12/17] Seeding 13 In-Depth Case Studies...");
  const csDetails = caseStudies.caseStudiesDetails || {};
  let csIdx = 0;
  for (const [slug, cs] of Object.entries(csDetails) as [string, any][]) {
    csIdx++;
    await prisma.caseStudy.upsert({
      where: { slug },
      update: {
        title: cs.name || slug,
        client: cs.industry + " Network",
        industry: cs.industry || "Enterprise",
        timeframe: "4 Months",
        metricHighlight: cs.highlights?.[0]?.desc || "Operational Efficiency Boosted by 70%",
        overview: cs.overview || "",
        challenge: cs.challenge || "",
        solution: cs.solution || "",
        results: cs.outcome || "",
        architectureDesc: cs.architecture || "",
        techStack: cs.tech || ["PostgreSQL", "Next.js", "Node.js"],
        testimonialAuthor: "Executive Director",
        testimonialRole: "Head of Digital Operations",
        testimonialQuote: cs.outcome || "Transformative platform deployment.",
        displayOrder: csIdx,
      },
      create: {
        slug,
        title: cs.name || slug,
        client: cs.industry + " Network",
        industry: cs.industry || "Enterprise",
        timeframe: "4 Months",
        metricHighlight: cs.highlights?.[0]?.desc || "Operational Efficiency Boosted by 70%",
        overview: cs.overview || "",
        challenge: cs.challenge || "",
        solution: cs.solution || "",
        results: cs.outcome || "",
        architectureDesc: cs.architecture || "",
        techStack: cs.tech || ["PostgreSQL", "Next.js", "Node.js"],
        testimonialAuthor: "Executive Director",
        testimonialRole: "Head of Digital Operations",
        testimonialQuote: cs.outcome || "Transformative platform deployment.",
        displayOrder: csIdx,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 13. Blog Posts & Resources
  // ----------------------------------------------------------------------------
  console.log("  → [13/17] Seeding Blog Articles, Insights, Runbooks, APIs & FAQs...");
  const rawPosts = data.posts || [];
  for (let i = 0; i < rawPosts.length; i++) {
    const post = rawPosts[i];
    const fullContent = (post.sections || []).map((s: any) => `### ${s.heading}\n\n${s.text}`).join("\n\n") || post.summary;

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.summary || "",
        content: fullContent,
        authorName: post.author || "DEZORYN Engineering",
        authorRole: "Technical Writer & Architect",
        category: post.cat || "Architecture",
        readTimeMinutes: parseInt(post.read) || 5,
        coverImage: post.image,
        tags: post.takeaways ? post.takeaways.slice(0, 4) : ["Enterprise", "SaaS", "Architecture"],
        status: PublishStatus.PUBLISHED,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.summary || "",
        content: fullContent,
        authorName: post.author || "DEZORYN Engineering",
        authorRole: "Technical Writer & Architect",
        category: post.cat || "Architecture",
        readTimeMinutes: parseInt(post.read) || 5,
        coverImage: post.image,
        tags: post.takeaways ? post.takeaways.slice(0, 4) : ["Enterprise", "SaaS", "Architecture"],
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  // Insight Reports
  const rawInsights = content.MOCK_INSIGHTS_DATA || [];
  for (const ins of rawInsights) {
    const insSlug = ins.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    await prisma.insightReport.upsert({
      where: { slug: insSlug },
      update: {
        title: ins.title,
        sector: ins.sector,
        author: ins.author,
        pagesCount: ins.pages || 20,
        downloadCount: parseInt(ins.downloadCount?.replace(/[^0-9]/g, "")) || 1500,
      },
      create: {
        slug: insSlug,
        title: ins.title,
        sector: ins.sector,
        author: ins.author,
        pagesCount: ins.pages || 20,
        downloadCount: parseInt(ins.downloadCount?.replace(/[^0-9]/g, "")) || 1500,
        summary: `Comprehensive industry report on ${ins.title}.`,
        tags: [ins.sector, "Whitepaper", "Research"],
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  // Documentation Runbooks
  const rawRunbooks = content.MOCK_DOCUMENTATION_RUNBOOKS || [];
  for (let i = 0; i < rawRunbooks.length; i++) {
    const rb = rawRunbooks[i];
    const rbSlug = rb.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    await prisma.documentationRunbook.upsert({
      where: { slug: rbSlug },
      update: {
        title: rb.title,
        category: rb.category,
        version: rb.version || "v2.4",
        codeSample: rb.codeSample,
        displayOrder: i + 1,
      },
      create: {
        slug: rbSlug,
        title: rb.title,
        category: rb.category,
        version: rb.version || "v2.4",
        codeSample: rb.codeSample,
        content: `Detailed implementation runbook for ${rb.title}.`,
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // API Resources
  const rawApis = content.MOCK_API_RESOURCES || [];
  for (let i = 0; i < rawApis.length; i++) {
    const api = rawApis[i];
    const methodEnum = (api.method || "GET") as HttpMethod;
    await prisma.apiResource.upsert({
      where: { id: api.id || `api_${i + 1}` },
      update: {
        title: api.title,
        method: methodEnum,
        endpoint: api.endpoint,
        description: api.description,
        displayOrder: i + 1,
      },
      create: {
        id: api.id || `api_${i + 1}`,
        title: api.title,
        method: methodEnum,
        endpoint: api.endpoint,
        description: api.description,
        authType: "Bearer JWT",
        rateLimit: "1,000 req / min",
        displayOrder: i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // FAQs
  const rawFaqs = content.MOCK_FAQS_DATA || [];
  for (let i = 0; i < rawFaqs.length; i++) {
    const f = rawFaqs[i];
    await prisma.faq.upsert({
      where: { id: f.id || `faq_${i + 1}` },
      update: {
        question: f.question,
        answer: f.answer,
        category: f.category,
        relatedProduct: f.relatedProduct,
        displayOrder: f.order || i + 1,
      },
      create: {
        id: f.id || `faq_${i + 1}`,
        question: f.question,
        answer: f.answer,
        category: f.category,
        relatedProduct: f.relatedProduct,
        displayOrder: f.order || i + 1,
        isPublished: true,
      },
    });
  }

  
  // 14. Careers & Partners
  
  console.log("  → [14/17] Seeding Job Postings & Enterprise Partners...");
  const rawCareers = careers.MOCK_CAREERS_DATA || [];
  for (const job of rawCareers) {
    await prisma.jobPosting.upsert({
      where: { id: job.id },
      update: {
        title: job.title,
        department: job.department,
        employmentType: mapJobType(job.type),
        location: job.location,
        description: job.description,
        applicantCount: job.applicantsCount || 0,
      },
      create: {
        id: job.id,
        title: job.title,
        department: job.department,
        employmentType: mapJobType(job.type),
        location: job.location,
        experienceLevel: "5+ Years Senior",
        salaryRange: "$140,000 - $180,000 USD",
        description: job.description,
        requirements: ["Next.js & Node.js", "PostgreSQL database design", "Microservices & Docker", "High availability systems"],
        applicantCount: job.applicantsCount || 0,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  const rawPartners = careers.MOCK_PARTNERS_DATA || [];
  for (let i = 0; i < rawPartners.length; i++) {
    const ptn = rawPartners[i];
    await prisma.partner.upsert({
      where: { id: ptn.id },
      update: {
        name: ptn.name,
        category: ptn.category,
        websiteUrl: ptn.website,
        tier: mapPartnerTier(ptn.tier),
        displayOrder: ptn.displayOrder || i + 1,
      },
      create: {
        id: ptn.id,
        name: ptn.name,
        category: ptn.category,
        websiteUrl: ptn.website,
        tier: mapPartnerTier(ptn.tier),
        commissionRate: "15% Recurring",
        displayOrder: ptn.displayOrder || i + 1,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // ----------------------------------------------------------------------------
  // 15. Website CMS (Pages, Sections, Navigation, Media Assets)
  // ----------------------------------------------------------------------------
  console.log("  → [15/17] Seeding Website CMS Pages, Sections, Navigation & Media...");

  // Media Assets
  const rawMedia = media.MOCK_MEDIA_ASSETS || [];
  for (const m of rawMedia) {
    await prisma.mediaAsset.upsert({
      where: { id: m.id },
      update: {
        name: m.name,
        altText: m.alt,
        filePath: m.path,
        dimensions: m.dimensions,
        usageCount: m.usageCount || 0,
      },
      create: {
        id: m.id,
        name: m.name,
        altText: m.alt,
        filePath: m.path,
        mimeType: "image/jpeg",
        sizeBytes: 384000,
        dimensions: m.dimensions,
        assetType: AssetType.PRODUCT_ART,
        usageCount: m.usageCount || 0,
      },
    });
  }

  // Website Pages
  const rawPages = pages.MOCK_WEBSITE_PAGES || [];
  const pageRecordMap = new Map<string, string>();
  for (const pg of rawPages) {
    const pageRec = await prisma.websitePage.upsert({
      where: { slug: pg.slug },
      update: {
        title: pg.title,
        pageType: pg.pageType,
        template: pg.template,
        status: pg.status === "Published" ? PublishStatus.PUBLISHED : PublishStatus.DRAFT,
      },
      create: {
        slug: pg.slug,
        title: pg.title,
        pageType: pg.pageType,
        template: pg.template,
        status: pg.status === "Published" ? PublishStatus.PUBLISHED : PublishStatus.DRAFT,
        publishedAt: new Date(),
      },
    });
    pageRecordMap.set(pg.slug, pageRec.id);
  }

  // Homepage Sections
  const homePageId = pageRecordMap.get("/");
  if (homePageId) {
    const rawSections = website.MOCK_HOMEPAGE_SECTIONS || [];
    for (let i = 0; i < rawSections.length; i++) {
      const sec = rawSections[i];
      await prisma.pageSection.upsert({
        where: {
          pageId_sectionKey: {
            pageId: homePageId,
            sectionKey: sec.id,
          },
        },
        update: {
          name: sec.name,
          displayOrder: sec.order || i + 1,
          isEnabled: sec.enabled !== false,
          headline: sec.headline,
          subheadline: sec.subheadline,
        },
        create: {
          pageId: homePageId,
          sectionKey: sec.id,
          name: sec.name,
          displayOrder: sec.order || i + 1,
          isEnabled: sec.enabled !== false,
          headline: sec.headline,
          subheadline: sec.subheadline,
          settings: { source: "admin_homepage_builder" },
        },
      });
    }
  }

  // Header Navigation Items
  const navHeader = website.MOCK_NAVIGATION_STRUCTURE?.header || [];
  for (let i = 0; i < navHeader.length; i++) {
    const item = navHeader[i];
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: {
        label: item.label,
        href: item.href,
        menuLocation: MenuLocation.HEADER,
        hasMegaMenu: !!item.hasMega,
        displayOrder: i + 1,
      },
      create: {
        id: item.id,
        label: item.label,
        href: item.href,
        menuLocation: MenuLocation.HEADER,
        hasMegaMenu: !!item.hasMega,
        displayOrder: i + 1,
      },
    });
  }

  // Footer Navigation Columns & Links
  const footerCols = website.MOCK_NAVIGATION_STRUCTURE?.footerColumns || [];
  for (let colIdx = 0; colIdx < footerCols.length; colIdx++) {
    const col = footerCols[colIdx];
    const parentId = `nav_footer_col_${colIdx + 1}`;
    await prisma.navigationItem.upsert({
      where: { id: parentId },
      update: { label: col.title, href: "#", displayOrder: colIdx + 1, menuLocation: MenuLocation.FOOTER },
      create: { id: parentId, label: col.title, href: "#", displayOrder: colIdx + 1, menuLocation: MenuLocation.FOOTER },
    });

    if (col.links && Array.isArray(col.links)) {
      for (let lIdx = 0; lIdx < col.links.length; lIdx++) {
        const link = col.links[lIdx];
        const childId = `nav_footer_col_${colIdx + 1}_link_${lIdx + 1}`;
        await prisma.navigationItem.upsert({
          where: { id: childId },
          update: { label: link.label, href: link.href, parentId, displayOrder: lIdx + 1, menuLocation: MenuLocation.FOOTER },
          create: { id: childId, label: link.label, href: link.href, parentId, displayOrder: lIdx + 1, menuLocation: MenuLocation.FOOTER },
        });
      }
    }
  }

  // 16. Inbound Leads, Demos & Newsletter
  
  console.log("  → [16/17] Seeding Inbound CRM Leads & Demo Requests...");
  const rawLeads = crm.MOCK_LEADS_DATA || [];
  for (const l of rawLeads) {
    await prisma.leadEnquiry.upsert({
      where: { id: l.id },
      update: {
        name: l.name,
        company: l.company,
        email: l.email,
        country: l.country,
        requirement: l.notes || l.inquiryType || "Enterprise inquiry",
        source: mapLeadSource(l.source),
        status: mapLeadStatus(l.status),
        priority: mapLeadPriority(l.priority),
        estimatedValueUsd: l.estimatedValueUsd || 10000,
        timeline: l.timeline || [],
      },
      create: {
        id: l.id,
        name: l.name,
        company: l.company,
        email: l.email,
        country: l.country,
        requirement: l.notes || l.inquiryType || "Enterprise inquiry",
        source: mapLeadSource(l.source),
        status: mapLeadStatus(l.status),
        priority: mapLeadPriority(l.priority),
        estimatedValueUsd: l.estimatedValueUsd || 10000,
        timeline: l.timeline || [],
        submittedAt: new Date(),
      },
    });
  }

  const rawDemos = demos.MOCK_DEMOS_DATA || [];
  for (const d of rawDemos) {
    await prisma.demoRequest.upsert({
      where: { id: d.id },
      update: {
        contactName: d.contactName,
        company: d.company,
        businessEmail: d.businessEmail,
        productSlug: d.product?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "schooly-core",
        country: d.country,
        preferredDate: d.preferredDate,
        preferredTime: d.preferredTime,
        timeZone: d.timeZone || "UTC",
        meetingLink: d.meetingLink,
        attendeesCount: d.attendees || 1,
        notes: d.notes,
        status: mapDemoStatus(d.status),
      },
      create: {
        id: d.id,
        contactName: d.contactName,
        company: d.company,
        businessEmail: d.businessEmail,
        productSlug: d.product?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "schooly-core",
        country: d.country,
        preferredDate: d.preferredDate,
        preferredTime: d.preferredTime,
        timeZone: d.timeZone || "UTC",
        meetingLink: d.meetingLink,
        attendeesCount: d.attendees || 1,
        notes: d.notes,
        status: mapDemoStatus(d.status),
      },
    });
  }

  // Newsletter Subscribers
  const sampleSubscribers = [
    { email: "subscriber.cloud@techcorp.com", source: "website_footer" },
    { email: "director.it@oxford-academy.edu", source: "blog_newsletter_form" },
    { email: "engineering@fintech-scale.io", source: "case_study_download" },
  ];
  for (const sub of sampleSubscribers) {
    await prisma.newsletterSubscription.upsert({
      where: { email: sub.email },
      update: { status: NewsletterStatus.SUBSCRIBED },
      create: { email: sub.email, source: sub.source, status: NewsletterStatus.SUBSCRIBED },
    });
  }


  // 17. System Audit Logs
  
  console.log("  → [17/17] Seeding Historical Audit Logs...");
  const rawAudit = audit.MOCK_AUDIT_LOGS || [];
  for (const a of rawAudit) {
    await prisma.auditLog.create({
      data: {
        adminName: a.administrator || "Shikha Gour",
        action: a.action,
        module: a.module,
        entityType: a.module,
        details: `${a.record}: ${a.details}`,
        result: a.result === "Success" ? AuditResult.SUCCESS : AuditResult.FAILURE,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminName: "System Automation",
      action: "Full Database Bootstrap & Master Seed",
      module: "System / Database",
      entityType: "PrismaSeed",
      entityId: "init_master_seed",
      details: "Successfully seeded all 34 relational tables with full website & admin datasets.",
      result: AuditResult.SUCCESS,
    },
  });

  console.log("✨ Master Seed completed successfully! All tables fully populated.");
}

main()
  .catch((e) => {
    console.error(" Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
