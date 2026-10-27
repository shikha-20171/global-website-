/**
 * DEZORYN TECHNOLOGY — Complete 85+ API Verification Test Suite
 * Executes live HTTP requests against all documented public and administrative endpoints.
 * Usage: npx tsx scripts/test-all-85-apis.ts
 */

import { prisma } from "../src/config/database.js";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5001";
const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@dezoryn.com";
const ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD || "SuperSecretAdminPassword2026!";

interface TestReport {
  id: number;
  group: string;
  name: string;
  method: string;
  endpoint: string;
  status: "PASS" | "FAIL";
  httpCode: number;
  expectedCode: string;
  latencyMs: number;
  details?: string;
}

const report: TestReport[] = [];
let testIndex = 0;

async function executeTest(
  group: string,
  name: string,
  method: string,
  endpoint: string,
  expectedCode: number | number[],
  headers: Record<string, string> = {},
  body?: any
): Promise<{ success: boolean; data: any; statusCode: number }> {
  testIndex++;
  const url = `${BASE_URL}${endpoint}`;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const latencyMs = Date.now() - start;
    const statusCode = res.status;
    const isSuccess = Array.isArray(expectedCode)
      ? expectedCode.includes(statusCode)
      : statusCode === expectedCode;
    const data = await res.json().catch(() => ({}));

    const expectedStr = Array.isArray(expectedCode) ? expectedCode.join("/") : expectedCode.toString();

    report.push({
      id: testIndex,
      group,
      name,
      method,
      endpoint,
      status: isSuccess ? "PASS" : "FAIL",
      httpCode: statusCode,
      expectedCode: expectedStr,
      latencyMs,
      details: isSuccess ? undefined : data?.message || JSON.stringify(data).slice(0, 100),
    });

    const symbol = isSuccess ? "✓ PASS" : "✗ FAIL";
    console.log(
      `[${testIndex.toString().padStart(2, "0")}] ${symbol} | ${method.padEnd(6)} ${endpoint.padEnd(44)} | HTTP ${statusCode} (${latencyMs}ms) — ${name}`
    );

    return { success: isSuccess, data, statusCode };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    const expectedStr = Array.isArray(expectedCode) ? expectedCode.join("/") : expectedCode.toString();
    report.push({
      id: testIndex,
      group,
      name,
      method,
      endpoint,
      status: "FAIL",
      httpCode: 0,
      expectedCode: expectedStr,
      latencyMs,
      details: err.message,
    });

    console.log(
      `[${testIndex.toString().padStart(2, "0")}] ✗ FAIL | ${method.padEnd(6)} ${endpoint.padEnd(44)} | ERROR: ${err.message}`
    );

    return { success: false, data: null, statusCode: 0 };
  }
}

async function runAllTests() {
  console.log("\n================================================================================");
  console.log("🚀 DEZORYN TECHNOLOGY — FULL 85+ API ENDPOINT LIVE VERIFICATION SUITE");
  console.log(`📡 Target API Gateway: ${BASE_URL}`);
  console.log(`⏰ Executed At: ${new Date().toISOString()}`);
  console.log("================================================================================\n");

  const cleanup = {
    userId: "",
    productId: "",
    categoryId: "",
    pricingId: "",
    solutionId: "",
    industryId: "",
    projectId: "",
    caseStudyId: "",
    blogId: "",
    faqId: "",
    careerId: "",
    partnerId: "",
    pageId: "",
    leadId: "",
    demoId: "",
    mediaId: "",
    newsletterEmail: `test-${Date.now()}@dezoryn-verify.com`,
  };

  // --------------------------------------------------------------------------
  // Group 1: System Health, Diagnostic Probes & Swagger Docs
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 1] System Health & Documentation ---");
  await executeTest("Health", "Root Service Health Probe", "GET", "/health", 200);
  await executeTest("Health", "Versioned Service Health Probe", "GET", "/api/v1/health", 200);
  await executeTest("Health", "Legacy Root Health Alias", "GET", "/api/health", 200);
  await executeTest("Docs", "OpenAPI Interactive Swagger Docs", "GET", "/docs/json", 200);

  // --------------------------------------------------------------------------
  // Group 2: Authentication, Password Recovery & Sessions
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 2] Super Admin Authentication & Profile ---");
  const loginRes = await executeTest(
    "Auth",
    "Super Admin Authenticated Login",
    "POST",
    "/api/v1/admin/auth/login",
    200,
    {},
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  );

  const token = loginRes.data?.data?.token || "";
  const authHeaders = { Authorization: `Bearer ${token}` };

  await executeTest("Auth", "Super Admin Profile Verification (/me)", "GET", "/api/v1/admin/auth/me", 200, authHeaders);
  await executeTest(
    "Auth",
    "Forgot Password Link Dispatch",
    "POST",
    "/api/v1/admin/auth/forgot-password",
    200,
    {},
    { email: ADMIN_EMAIL }
  );
  await executeTest("Dashboard", "Executive Admin Dashboard Metrics", "GET", "/api/v1/admin/dashboard", 200, authHeaders);
  await executeTest("Audit", "Security Audit Trail Inspection", "GET", "/api/v1/admin/audit-logs", 200, authHeaders);
  await executeTest("Notifications", "System Admin Notifications", "GET", "/api/v1/admin/notifications", 200, authHeaders);

  // --------------------------------------------------------------------------
  // Group 3: RBAC Users, Roles & Permissions
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 3] RBAC Users, Roles & Permissions ---");
  await executeTest("Users", "List Administrative Users", "GET", "/api/v1/admin/users", 200, authHeaders);

  const testUserEmail = `verify-${Date.now()}@dezoryn.com`;
  const createUserRes = await executeTest(
    "Users",
    "Create Managed Admin Account",
    "POST",
    "/api/v1/admin/users",
    201,
    authHeaders,
    {
      name: "Temporary Verification User",
      email: testUserEmail,
      password: "TestPassword123!",
      roleId: "super_admin",
    }
  );
  cleanup.userId = createUserRes.data?.data?.id || "";

  if (cleanup.userId) {
    await executeTest("Users", "Get User Details by ID", "GET", `/api/v1/admin/users/${cleanup.userId}`, 200, authHeaders);
    await executeTest(
      "Users",
      "Update Admin Account Details",
      "PUT",
      `/api/v1/admin/users/${cleanup.userId}`,
      200,
      authHeaders,
      { name: "Updated Verification User" }
    );
    await executeTest("Users", "Delete Managed Admin Account", "DELETE", `/api/v1/admin/users/${cleanup.userId}`, 200, authHeaders);
  }

  await executeTest("Roles", "List Platform Roles & Grant Matrices", "GET", "/api/v1/admin/roles", 200, authHeaders);
  await executeTest("Permissions", "List Fine-Grained RBAC Permissions", "GET", "/api/v1/admin/permissions", 200, authHeaders);

  // --------------------------------------------------------------------------
  // Group 4: Website CMS, Navigation, Company & Legal Policies
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 4] Website CMS, Pages, Navigation & Corporate Policies ---");
  await executeTest("CMS", "Public Published CMS Pages", "GET", "/api/v1/pages", 200);
  await executeTest("CMS", "Public Page by Slug (/home)", "GET", "/api/v1/pages/home", 200);
  await executeTest("Navigation", "Public Global Navigation Structure", "GET", "/api/v1/navigation", 200);
  await executeTest("Company", "Public Corporate Company Profile", "GET", "/api/v1/company", 200);
  await executeTest("Legal", "Public Corporate Legal Policies", "GET", "/api/v1/legal", 200);
  await executeTest("Legal", "Public Legal Policy by Slug (/privacy)", "GET", "/api/v1/legal/privacy", 200);
  await executeTest("Settings", "Public Sanitized Site Settings", "GET", "/api/v1/settings/public", 200);

  // Admin CMS
  await executeTest("CMS", "Admin List All Website Pages", "GET", "/api/v1/admin/pages", 200, authHeaders);
  const testPageSlug = `verify-page-${Date.now()}`;
  const createPageRes = await executeTest(
    "CMS",
    "Admin Create New CMS Page",
    "POST",
    "/api/v1/admin/pages",
    201,
    authHeaders,
    {
      title: "Automated Verification Page",
      slug: testPageSlug,
      description: "Ephemeral verification page",
      isPublished: false,
    }
  );
  cleanup.pageId = createPageRes.data?.data?.id || "";

  if (cleanup.pageId) {
    await executeTest("CMS", "Admin Get Page Details by ID", "GET", `/api/v1/admin/pages/${cleanup.pageId}`, 200, authHeaders);
    await executeTest(
      "CMS",
      "Admin Update CMS Page",
      "PUT",
      `/api/v1/admin/pages/${cleanup.pageId}`,
      200,
      authHeaders,
      { title: "Updated Automated Page" }
    );
    await executeTest("CMS", "Admin Delete CMS Page", "DELETE", `/api/v1/admin/pages/${cleanup.pageId}`, 200, authHeaders);
  }

  await executeTest("CMS", "Admin List Homepage Sections", "GET", "/api/v1/admin/sections", 200, authHeaders);
  await executeTest("Navigation", "Admin Navigation Hierarchies", "GET", "/api/v1/admin/navigation", 200, authHeaders);
  await executeTest("Settings", "Admin Site Configuration Parameters", "GET", "/api/v1/admin/settings", 200, authHeaders);
  await executeTest("Company", "Admin Company Profile Details", "GET", "/api/v1/admin/company", 200, authHeaders);
  await executeTest("Legal", "Admin Legal Policy Documents", "GET", "/api/v1/admin/legal", 200, authHeaders);

  // --------------------------------------------------------------------------
  // Group 5: SaaS Products, Marketplace & Comparisons
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 5] SaaS Products, Marketplace, Categories & Comparisons ---");
  await executeTest("Products", "Public Published SaaS Catalog", "GET", "/api/v1/products", 200);
  await executeTest("Products", "Public Product by Slug (/schooly-core)", "GET", "/api/v1/products/schooly-core", 200);
  const catListRes = await executeTest("Products", "Public Product Categories with Counts", "GET", "/api/v1/products/categories", 200);
  const fallbackCatId = Array.isArray(catListRes.data?.data) && catListRes.data.data.length > 0
    ? catListRes.data.data[0].id
    : "";

  await executeTest("Products", "Public Product Comparison Matrix", "GET", "/api/v1/products/compare", 200);
  await executeTest("Products", "Admin List All SaaS Products", "GET", "/api/v1/admin/products", 200, authHeaders);

  // Categories CRUD First
  const testCatSlug = `cat-verify-${Date.now()}`;
  const createCatRes = await executeTest(
    "Products",
    "Admin Create Product Category",
    "POST",
    "/api/v1/admin/categories",
    201,
    authHeaders,
    { name: "Verification Systems", slug: testCatSlug, description: "Automated validation" }
  );
  cleanup.categoryId = createCatRes.data?.data?.id || "";

  const activeCategoryId = cleanup.categoryId || fallbackCatId;

  const testProductSlug = `verify-prod-${Date.now()}`;
  const createProdRes = await executeTest(
    "Products",
    "Admin Create Draft Product",
    "POST",
    "/api/v1/admin/products",
    201,
    authHeaders,
    {
      name: "DezoVerify Autonomous Gateway",
      slug: testProductSlug,
      tagline: "High-throughput validation platform",
      description: "Automated engine for system-level verification",
      categoryId: activeCategoryId,
      status: "DRAFT",
      featuresList: ["Self-Healing Mesh", "Telemetry Pipeline"],
    }
  );
  cleanup.productId = createProdRes.data?.data?.id || "";

  if (cleanup.productId) {
    await executeTest("Products", "Admin Get Product Details by ID", "GET", `/api/v1/admin/products/${cleanup.productId}`, 200, authHeaders);
    await executeTest(
      "Products",
      "Admin Update SaaS Product",
      "PUT",
      `/api/v1/admin/products/${cleanup.productId}`,
      200,
      authHeaders,
      { tagline: "Updated high-throughput validation" }
    );
    await executeTest("Products", "Admin Delete SaaS Product", "DELETE", `/api/v1/admin/products/${cleanup.productId}`, 200, authHeaders);
  }

  if (cleanup.categoryId) {
    await executeTest(
      "Products",
      "Admin Update Product Category",
      "PUT",
      `/api/v1/admin/categories/${cleanup.categoryId}`,
      200,
      authHeaders,
      { name: "Updated Verification Systems" }
    );
    await executeTest("Products", "Admin Delete Product Category", "DELETE", `/api/v1/admin/categories/${cleanup.categoryId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 6: Commercial Pricing Plans
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 6] Commercial Pricing Plans ---");
  await executeTest("Pricing", "Public Pricing Plans & Ladders", "GET", "/api/v1/pricing", 200);
  await executeTest("Pricing", "Admin List Pricing Tiers", "GET", "/api/v1/admin/pricing", 200, authHeaders);

  const testPlanSlug = `plan-verify-${Date.now()}`;
  const createPlanRes = await executeTest(
    "Pricing",
    "Admin Create Pricing Tier",
    "POST",
    "/api/v1/admin/pricing",
    201,
    authHeaders,
    {
      name: "Automated Test Plan",
      slug: testPlanSlug,
      monthlyPriceUsd: 99,
      annualPriceUsd: 990,
      annualDiscountPercent: 20,
      userLimit: "10 Users",
      usageQuota: "Unlimited",
      features: ["Verification Mode"],
      status: "PUBLISHED",
    }
  );
  cleanup.pricingId = createPlanRes.data?.data?.id || "";

  if (cleanup.pricingId) {
    await executeTest(
      "Pricing",
      "Admin Update Pricing Tier",
      "PUT",
      `/api/v1/admin/pricing/${cleanup.pricingId}`,
      200,
      authHeaders,
      { monthlyPriceUsd: 119 }
    );
    await executeTest("Pricing", "Admin Delete Pricing Tier", "DELETE", `/api/v1/admin/pricing/${cleanup.pricingId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 7: Solutions Architecture & Industry Verticals
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 7] Enterprise Solutions & Industry Frameworks ---");
  await executeTest("Solutions", "Public Solutions Architecture Blueprints", "GET", "/api/v1/solutions", 200);
  await executeTest("Solutions", "Public Solution Blueprint (/enterprise)", "GET", "/api/v1/solutions/enterprise", 200);
  await executeTest("Solutions", "Admin List Enterprise Solutions", "GET", "/api/v1/admin/solutions", 200, authHeaders);

  const testSolSlug = `sol-verify-${Date.now()}`;
  const createSolRes = await executeTest(
    "Solutions",
    "Admin Create Enterprise Solution",
    "POST",
    "/api/v1/admin/solutions",
    201,
    authHeaders,
    {
      name: "Autonomous Cloud Operations",
      slug: testSolSlug,
      tagline: "Autonomous multi-cloud management",
      description: "Self-governing enterprise infrastructure",
      capabilities: ["Auto-scale", "Zero-trust"],
    }
  );
  cleanup.solutionId = createSolRes.data?.data?.id || "";

  if (cleanup.solutionId) {
    await executeTest(
      "Solutions",
      "Admin Update Enterprise Solution",
      "PUT",
      `/api/v1/admin/solutions/${cleanup.solutionId}`,
      200,
      authHeaders,
      { name: "Updated Cloud Operations" }
    );
    await executeTest("Solutions", "Admin Delete Enterprise Solution", "DELETE", `/api/v1/admin/solutions/${cleanup.solutionId}`, 200, authHeaders);
  }

  // Industries
  await executeTest("Industries", "Public Industry Frameworks", "GET", "/api/v1/industries", 200);
  await executeTest("Industries", "Public Industry by Slug (/education)", "GET", "/api/v1/industries/education", 200);
  await executeTest("Industries", "Admin List Industry Verticals", "GET", "/api/v1/admin/industries", 200, authHeaders);

  const testIndSlug = `ind-verify-${Date.now()}`;
  const createIndRes = await executeTest(
    "Industries",
    "Admin Create Industry Vertical",
    "POST",
    "/api/v1/admin/industries",
    201,
    authHeaders,
    {
      name: "Aerospace & Defense",
      slug: testIndSlug,
      shortDescription: "Mission-critical defense systems",
      fullDescription: "Mission-critical aerospace platforms and high-reliability software architectures.",
    }
  );
  cleanup.industryId = createIndRes.data?.data?.id || "";

  if (cleanup.industryId) {
    await executeTest(
      "Industries",
      "Admin Update Industry Vertical",
      "PUT",
      `/api/v1/admin/industries/${cleanup.industryId}`,
      200,
      authHeaders,
      { name: "Updated Aerospace Systems" }
    );
    await executeTest("Industries", "Admin Delete Industry Vertical", "DELETE", `/api/v1/admin/industries/${cleanup.industryId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 8: Projects Showcase & Customer Case Studies
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 8] Customer Projects & Case Studies ---");
  await executeTest("Projects", "Public Engineering Client Projects", "GET", "/api/v1/projects", 200);
  await executeTest("Projects", "Public Project by Slug (/schooly-core-campus)", "GET", "/api/v1/projects/schooly-core-campus", 200);
  await executeTest("Projects", "Admin List Showcase Projects", "GET", "/api/v1/admin/projects", 200, authHeaders);

  const testProjSlug = `proj-verify-${Date.now()}`;
  const createProjRes = await executeTest(
    "Projects",
    "Admin Create Engineering Project",
    "POST",
    "/api/v1/admin/projects",
    201,
    authHeaders,
    {
      name: "Autonomous High-Speed Trading Pipeline",
      slug: testProjSlug,
      client: "Apex Quant Global",
      industry: "Financial Services",
      shortDescription: "Sub-millisecond trade execution",
      techStack: ["Rust", "Fastify", "PostgreSQL"],
    }
  );
  cleanup.projectId = createProjRes.data?.data?.id || "";

  if (cleanup.projectId) {
    await executeTest(
      "Projects",
      "Admin Update Engineering Project",
      "PUT",
      `/api/v1/admin/projects/${cleanup.projectId}`,
      200,
      authHeaders,
      { name: "Updated Quant Trading Pipeline" }
    );
    await executeTest("Projects", "Admin Delete Engineering Project", "DELETE", `/api/v1/admin/projects/${cleanup.projectId}`, 200, authHeaders);
  }

  // Case Studies
  await executeTest("CaseStudies", "Public Customer Case Studies", "GET", "/api/v1/case-studies", 200);
  await executeTest("CaseStudies", "Public Case Study by Slug (/schooly-core-campus)", "GET", "/api/v1/case-studies/schooly-core-campus", 200);
  await executeTest("CaseStudies", "Admin List Customer Case Studies", "GET", "/api/v1/admin/case-studies", 200, authHeaders);

  const testCsSlug = `cs-verify-${Date.now()}`;
  const createCsRes = await executeTest(
    "CaseStudies",
    "Admin Create Customer Case Study",
    "POST",
    "/api/v1/admin/case-studies",
    201,
    authHeaders,
    {
      title: "Scalable Healthcare Network Deployment",
      slug: testCsSlug,
      client: "Global MedGroup",
      industry: "Healthcare",
      metricHighlight: "82% Cost Reduction",
      overview: "Transformation of hospital ledger records across 45 facilities.",
      challenge: "Legacy siloed EHR systems causing latency and downtime.",
      solution: "Engineered high-concurrency microservices mesh with automated failover.",
      results: "82% reduction in query latency and 99.999% uptime achieved.",
    }
  );
  cleanup.caseStudyId = createCsRes.data?.data?.id || "";

  if (cleanup.caseStudyId) {
    await executeTest(
      "CaseStudies",
      "Admin Update Customer Case Study",
      "PUT",
      `/api/v1/admin/case-studies/${cleanup.caseStudyId}`,
      200,
      authHeaders,
      { title: "Updated MedGroup Case Study" }
    );
    await executeTest("CaseStudies", "Admin Delete Customer Case Study", "DELETE", `/api/v1/admin/case-studies/${cleanup.caseStudyId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 9: Resources Hub (Blog, Whitepapers, Runbooks, APIs, FAQs, Careers, Partners)
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 9] Resources Hub (Blog, Whitepapers, Runbooks, FAQs, Careers) ---");
  await executeTest("Resources", "Public Published Blog Articles", "GET", "/api/v1/content/blog", 200);
  await executeTest("Resources", "Public Blog Post by Slug", "GET", "/api/v1/content/blog/agentic-ai-workflow-orchestration", 200);
  await executeTest("Resources", "Admin List Blog Articles", "GET", "/api/v1/admin/blog", 200, authHeaders);

  const testBlogSlug = `blog-verify-${Date.now()}`;
  const createBlogRes = await executeTest(
    "Resources",
    "Admin Create Blog Post",
    "POST",
    "/api/v1/admin/blog",
    201,
    authHeaders,
    {
      title: "Next-Gen Multi-Agent Systems in Production",
      slug: testBlogSlug,
      authorName: "Shikha Gour",
      excerpt: "Architecting autonomous agents for enterprise grade reliability.",
      content: "# Autonomous Architecture\n\nFull production runbook.",
      category: "Engineering",
      status: "PUBLISHED",
    }
  );
  cleanup.blogId = createBlogRes.data?.data?.id || "";

  if (cleanup.blogId) {
    await executeTest(
      "Resources",
      "Admin Update Blog Post",
      "PUT",
      `/api/v1/admin/blog/${cleanup.blogId}`,
      200,
      authHeaders,
      { title: "Updated Multi-Agent Architecture" }
    );
    await executeTest("Resources", "Admin Delete Blog Post", "DELETE", `/api/v1/admin/blog/${cleanup.blogId}`, 200, authHeaders);
  }

  await executeTest("Resources", "Public Research Whitepapers & Insights", "GET", "/api/v1/content/insights", 200);
  await executeTest("Resources", "Public Engineering Runbooks", "GET", "/api/v1/content/docs", 200);
  await executeTest("Resources", "Public REST API Reference Specs", "GET", "/api/v1/content/api-reference", 200);
  await executeTest("Resources", "Public Frequently Asked Questions", "GET", "/api/v1/content/faqs", 200);
  await executeTest("Resources", "Admin List Frequently Asked Questions", "GET", "/api/v1/admin/faqs", 200, authHeaders);

  const createFaqRes = await executeTest(
    "Resources",
    "Admin Create FAQ Item",
    "POST",
    "/api/v1/admin/faqs",
    201,
    authHeaders,
    {
      question: "How does DEZORYN maintain 99.99% availability?",
      answer: "Through multi-cloud autonomous self-healing topologies.",
      category: "General",
    }
  );
  cleanup.faqId = createFaqRes.data?.data?.id || "";
  if (cleanup.faqId) {
    await executeTest("Resources", "Admin Delete FAQ Item", "DELETE", `/api/v1/admin/faqs/${cleanup.faqId}`, 200, authHeaders);
  }

  // Careers & Partners
  await executeTest("Resources", "Public Career Openings", "GET", "/api/v1/content/careers", 200);
  await executeTest("Resources", "Admin List Career Openings", "GET", "/api/v1/admin/careers", 200, authHeaders);

  const createCareerRes = await executeTest(
    "Resources",
    "Admin Create Career Opening",
    "POST",
    "/api/v1/admin/careers",
    201,
    authHeaders,
    {
      title: "Principal Distributed Systems Engineer",
      department: "Core Engineering",
      location: "San Francisco, CA / Remote",
      description: "Lead distributed consensus protocols and telemetry engines.",
    }
  );
  cleanup.careerId = createCareerRes.data?.data?.id || "";
  if (cleanup.careerId) {
    await executeTest("Resources", "Admin Delete Career Opening", "DELETE", `/api/v1/admin/careers/${cleanup.careerId}`, 200, authHeaders);
  }

  await executeTest("Resources", "Public Partner Programs", "GET", "/api/v1/content/partners", 200);
  await executeTest("Resources", "Admin List Partner Records", "GET", "/api/v1/admin/partners", 200, authHeaders);

  const createPartnerRes = await executeTest(
    "Resources",
    "Admin Create Partner Program",
    "POST",
    "/api/v1/admin/partners",
    201,
    authHeaders,
    {
      name: "Autonomous Alliance Network",
      category: "Cloud Infrastructure",
      websiteUrl: "https://partner.example.com",
    }
  );
  cleanup.partnerId = createPartnerRes.data?.data?.id || "";
  if (cleanup.partnerId) {
    await executeTest("Resources", "Admin Delete Partner Program", "DELETE", `/api/v1/admin/partners/${cleanup.partnerId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 10: Inbound CRM, Leads, Demos & Newsletter
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 10] Inbound CRM, Leads, Demos & Newsletter ---");
  const leadEmail = `lead-${Date.now()}@example.com`;
  const contactRes = await executeTest(
    "CRM",
    "Public Contact Inquiry Submission",
    "POST",
    "/api/v1/contact",
    201,
    {},
    {
      name: "Enterprise Client",
      email: leadEmail,
      company: "Acme Enterprises",
      country: "United States",
      req: "Requesting comprehensive pricing and SLA for 500 licenses across global regions.",
    }
  );
  cleanup.leadId = contactRes.data?.data?.id || "";

  await executeTest(
    "CRM",
    "Public Sales Inquiry Submission Alias",
    "POST",
    "/api/v1/sales-inquiries",
    201,
    {},
    {
      name: "Enterprise Sales Director",
      email: `sales-${Date.now()}@example.com`,
      company: "Apex Global",
      country: "United Kingdom",
      req: "Exploring enterprise multi-region deployment and migration roadmap.",
    }
  );

  const demoRes = await executeTest(
    "CRM",
    "Public Architecture Demo Request",
    "POST",
    "/api/v1/demo",
    201,
    {},
    {
      contactName: "Chief Technology Officer",
      company: "MedGroup Network",
      businessEmail: `cto-${Date.now()}@medgroup.org`,
      country: "United States",
      productSlug: "schooly-core",
      preferredDate: "2026-11-01",
      preferredTime: "14:00 UTC",
    }
  );
  cleanup.demoId = demoRes.data?.data?.id || "";

  await executeTest(
    "CRM",
    "Public Newsletter Subscription",
    "POST",
    "/api/v1/newsletter/subscribe",
    [200, 201],
    {},
    { email: cleanup.newsletterEmail }
  );

  await executeTest(
    "CRM",
    "Public Newsletter Unsubscribe",
    "POST",
    "/api/v1/newsletter/unsubscribe",
    200,
    {},
    { email: cleanup.newsletterEmail }
  );

  await executeTest("CRM", "Admin List Inbound Leads (/inquiries)", "GET", "/api/v1/admin/inquiries", 200, authHeaders);
  await executeTest("CRM", "Admin List Inbound Leads Alias (/leads)", "GET", "/api/v1/admin/leads", 200, authHeaders);

  if (cleanup.leadId) {
    await executeTest("CRM", "Admin Get Lead Details by ID", "GET", `/api/v1/admin/inquiries/${cleanup.leadId}`, 200, authHeaders);
    await executeTest(
      "CRM",
      "Admin Update Lead Status Pipeline",
      "PATCH",
      `/api/v1/admin/inquiries/${cleanup.leadId}/status`,
      200,
      authHeaders,
      { status: "QUALIFIED", notes: "Verified budget and timeline" }
    );
    await executeTest("CRM", "Admin Delete Inbound Lead", "DELETE", `/api/v1/admin/inquiries/${cleanup.leadId}`, 200, authHeaders);
  }

  await executeTest("CRM", "Admin List Demo Bookings", "GET", "/api/v1/admin/demos", 200, authHeaders);
  if (cleanup.demoId) {
    await executeTest(
      "CRM",
      "Admin Update Demo Status",
      "PATCH",
      `/api/v1/admin/demos/${cleanup.demoId}/status`,
      200,
      authHeaders,
      { status: "CONFIRMED", meetingLink: "https://meet.google.com/abc-defg-hij" }
    );
    await executeTest("CRM", "Admin Delete Demo Booking", "DELETE", `/api/v1/admin/demos/${cleanup.demoId}`, 200, authHeaders);
  }

  await executeTest("CRM", "Admin List Newsletter Subscribers", "GET", "/api/v1/admin/subscribers", 200, authHeaders);

  // --------------------------------------------------------------------------
  // Group 11: Media Library & Asset Storage
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 11] Media Library & CDN Assets ---");
  await executeTest("Media", "Public Media Assets Catalog", "GET", "/api/v1/media", 200);
  await executeTest("Media", "Admin Media Assets Management", "GET", "/api/v1/admin/media", 200, authHeaders);

  const createMediaRes = await executeTest(
    "Media",
    "Admin Register Media Metadata",
    "POST",
    "/api/v1/admin/media",
    201,
    authHeaders,
    {
      name: "Architecture Diagram SVG",
      filePath: "https://cdn.dezoryn.com/diagrams/verify.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 42100,
    }
  );
  cleanup.mediaId = createMediaRes.data?.data?.id || "";

  if (cleanup.mediaId) {
    await executeTest("Media", "Admin Delete Media Metadata", "DELETE", `/api/v1/admin/media/${cleanup.mediaId}`, 200, authHeaders);
  }

  // --------------------------------------------------------------------------
  // Group 12: Backwards Compatibility Route Layer (/api/...)
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 12] Legacy Route Compatibility Layer (/api) ---");
  await executeTest("Legacy", "Legacy Products Route (/api/products)", "GET", "/api/products", 200);
  await executeTest("Legacy", "Legacy Solutions Route (/api/solutions)", "GET", "/api/solutions", 200);
  await executeTest("Legacy", "Legacy Industries Route (/api/industries)", "GET", "/api/industries", 200);
  await executeTest("Legacy", "Legacy Pricing Route (/api/pricing)", "GET", "/api/pricing", 200);
  await executeTest("Legacy", "Legacy Admin Leads Route (/api/admin/leads)", "GET", "/api/admin/leads", 200, authHeaders);

  // --------------------------------------------------------------------------
  // Group 13: Session Revocation & Security Invalidation
  // --------------------------------------------------------------------------
  console.log("\n--- [GROUP 13] Super Admin Logout & Token Invalidation ---");
  await executeTest("Auth", "Super Admin Logout (Revoke Session)", "POST", "/api/v1/admin/auth/logout", 200, authHeaders, {});
  await executeTest("Auth", "Revoked Token Access Rejection (401)", "GET", "/api/v1/admin/auth/me", 401, authHeaders);

  // --------------------------------------------------------------------------
  // Compile Results & Print Final Executive Summary
  // --------------------------------------------------------------------------
  const totalTests = report.length;
  const passedTests = report.filter((r) => r.status === "PASS").length;
  const failedTests = report.filter((r) => r.status === "FAIL").length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  console.log("\n================================================================================");
  console.log("📊 COMPREHENSIVE 85+ API ENDPOINT VERIFICATION SUMMARY");
  console.log("================================================================================");
  console.log(`Total Endpoints Tested : ${totalTests}`);
  console.log(`Passed (Valid HTTP)    : ${passedTests}`);
  console.log(`Failed                 : ${failedTests}`);
  console.log(`Success Rate           : ${successRate}%`);
  console.log("================================================================================");

  if (failedTests > 0) {
    console.log("\n⚠️ Failed Test Diagnostic Log:");
    report
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`  - [${r.method} ${r.endpoint}] Expected HTTP ${r.expectedCode}, got ${r.httpCode}: ${r.details || "No details"}`);
      });
  } else {
    console.log("\n🎉 ALL 85+ API ENDPOINTS ARE FULLY OPERATIONAL AND VERIFIED AGAINST LIVE BACKEND!");
  }

  // Database post-cleanup assurance
  try {
    await prisma.newsletterSubscription.deleteMany({ where: { email: cleanup.newsletterEmail } });
  } catch {
    // Ignore cleanup errors
  }
}

runAllTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test execution fatal error:", err);
    process.exit(1);
  });
