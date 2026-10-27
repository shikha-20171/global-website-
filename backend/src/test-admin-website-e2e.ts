import { prisma } from "./config/database.js";

const API_BASE = "http://localhost:5001";
const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@dezoryn.com";
const ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.BOOTSTRAP_ADMIN_PASSWORD || "SuperSecretAdminPassword2026!";

interface TestResult {
  suite: string;
  test: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function record(suite: string, test: string, passed: boolean, details?: string) {
  results.push({
    suite,
    test,
    status: passed ? "PASS" : "FAIL",
    details,
  });
  const symbol = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${symbol}] ${suite} :: ${test} ${details ? `(${details})` : ""}`);
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, headers: res.headers, data };
}

async function runE2EVerification() {
  console.log("================================================================================");
  console.log(" DEZORYN TECHNOLOGY — Admin Panel vs Global Website E2E Functional Verification");
  console.log("================================================================================\n");

  let adminToken = "";
  let sessionCookie = "";

  // 1. Super Admin Authentication
  try {
    const loginRes = await request("/api/v1/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    adminToken = loginRes.data?.data?.token;
    const cookieHeader = loginRes.headers.get("set-cookie");
    if (cookieHeader) {
      sessionCookie = cookieHeader;
    }
    record("Authentication", "Super Admin Login", !!adminToken, `User: ${loginRes.data?.data?.user?.email}`);
  } catch (err: any) {
    record("Authentication", "Super Admin Login", false, err.message);
    process.exit(1);
  }

  if (!adminToken) {
    console.error("FATAL: Could not obtain Super Admin token.");
    process.exit(1);
  }

  const authHeaders: Record<string, string> = {
    Authorization: `Bearer ${adminToken}`,
  };
  if (sessionCookie) {
    authHeaders.Cookie = sessionCookie;
  }

  // 2. Homepage Section Edit & Reflection Test
  let originalHeroHeadline = "";
  let originalHeroSubheadline = "";
  let heroSectionId = "";

  try {
    // A. Read current published homepage
    const homeRes = await request("/api/v1/pages/home");
    const heroSec = homeRes.data?.data?.sections?.find((s: any) => s.sectionKey === "sec_hero");
    heroSectionId = heroSec?.id;
    originalHeroHeadline = heroSec?.headline || "Technology That Moves Businesses Forward.";
    originalHeroSubheadline = heroSec?.subheadline || "We build intelligent SaaS platforms...";

    record("Homepage Workflow", "Fetch Public Homepage Sections", !!heroSectionId, `Found ${homeRes.data?.data?.sections?.length} sections`);

    // B. Super Admin edits the hero section headline
    const testHeadline = "Autonomous AI Platforms That Transform Global Enterprise (Live Test)";
    await request(`/api/v1/admin/sections/${heroSectionId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        headline: testHeadline,
        subheadline: "Updated dynamically through Super Admin Panel.",
      }),
    });

    // C. Verify immediately on the public website API
    const updatedHomeRes = await request("/api/v1/pages/home");
    const updatedHero = updatedHomeRes.data?.data?.sections?.find((s: any) => s.id === heroSectionId);
    const verifiedPublic = updatedHero?.headline === testHeadline;
    record("Homepage Workflow", "Admin Edit Appears on Public Website", verifiedPublic, `Public headline: "${updatedHero?.headline}"`);

    // D. Revert to original headline
    await request(`/api/v1/admin/sections/${heroSectionId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        headline: originalHeroHeadline,
        subheadline: originalHeroSubheadline,
      }),
    });
    const revertedRes = await request("/api/v1/pages/home");
    const revertedHero = revertedRes.data?.data?.sections?.find((s: any) => s.id === heroSectionId);
    record("Homepage Workflow", "Revert Homepage Section to Baseline", revertedHero?.headline === originalHeroHeadline);
  } catch (err: any) {
    record("Homepage Workflow", "Homepage Section Lifecycle", false, err.message);
  }

  // 3. Product Catalog Lifecycle (Create -> Publish -> Read -> Update -> Unpublish -> Delete)
  let testProductId = "";
  const testProductSlug = `test-e2e-saas-${Date.now()}`;

  try {
    // Find a valid category
    const cat = await prisma.productCategory.findFirst();
    const categoryId = cat?.id || "cat_general";

    // A. Create product as DRAFT
    const createRes = await request("/api/v1/admin/products", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "DezoSphere Quantum Analytics",
        slug: testProductSlug,
        tagline: "Real-time edge telemetry and AI modeling",
        description: "Autonomous data analytics platform created during E2E verification test.",
        categoryId,
        status: "DRAFT",
        size: "MEDIUM",
        deployment: "CLOUD",
        rating: "4.9/5",
        featuresList: ["Edge Telemetry", "Neural Network Query", "Air-gapped VPC"],
      }),
    });
    testProductId = createRes.data?.data?.id;
    record("Product Catalog", "Create Draft Product in Admin", !!testProductId, `ID: ${testProductId}`);

    // B. Verify DRAFT does NOT appear in public catalog
    const publicListDraft = await request("/api/v1/products");
    const draftArray = Array.isArray(publicListDraft.data?.data) ? publicListDraft.data.data : publicListDraft.data?.data?.products || [];
    const draftInPublic = draftArray.some((p: any) => p.slug === testProductSlug);
    record("Product Catalog", "Draft Product Hidden from Public Website", !draftInPublic);

    // C. Publish product
    await request(`/api/v1/admin/products/${testProductId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ status: "PUBLISHED" }),
    });

    // D. Verify PUBLISHED appears on public website
    const publicListPub = await request("/api/v1/products");
    const pubArray = Array.isArray(publicListPub.data?.data) ? publicListPub.data.data : publicListPub.data?.data?.products || [];
    const pubInPublic = pubArray.some((p: any) => p.slug === testProductSlug);
    record("Product Catalog", "Published Product Appears on Public Website", pubInPublic);

    // E. Read product detail on public website
    const publicDetail = await request(`/api/v1/products/${testProductSlug}`);
    const detailMatches = publicDetail.data?.data?.name === "DezoSphere Quantum Analytics";
    record("Product Catalog", "Public Product Detail Route Functional", detailMatches);

    // F. Unpublish product back to DRAFT
    await request(`/api/v1/admin/products/${testProductId}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ status: "DRAFT" }),
    });
    const publicDetailAfterUnpub = await request(`/api/v1/products/${testProductSlug}`);
    record("Product Catalog", "Unpublished Product Hidden from Detail Route (404)", publicDetailAfterUnpub.status === 404);

    // G. Delete product
    await request(`/api/v1/admin/products/${testProductId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const productInDb = await prisma.product.findUnique({ where: { id: testProductId } });
    record("Product Catalog", "Admin Delete Product Persists in DB", !productInDb);
  } catch (err: any) {
    record("Product Catalog", "Product Lifecycle Error", false, err.message);
    if (testProductId) {
      await prisma.product.deleteMany({ where: { id: testProductId } });
    }
  }

  // 4. Commercial Pricing Lifecycle
  let testPlanId = "";
  try {
    const planSlug = `plan-e2e-${Date.now()}`;
    const createPlanRes = await request("/api/v1/admin/pricing", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "E2E Scale Cluster",
        slug: planSlug,
        monthlyPriceUsd: 149,
        annualPriceUsd: 1490,
        annualDiscountPercent: 20,
        userLimit: "50 Seats",
        usageQuota: "1,000,000 queries",
        features: ["Dedicated Worker Nodes", "99.9% SLA"],
        isHighlighted: true,
        status: "PUBLISHED",
      }),
    });
    testPlanId = createPlanRes.data?.data?.id;
    record("Pricing Plans", "Create Pricing Plan via Admin", !!testPlanId);

    // Verify on public pricing API
    const publicPricing = await request("/api/v1/pricing");
    const allPlans = [
      ...(publicPricing.data?.data?.defaultTiers || []),
      ...(publicPricing.data?.data?.productSpecificTiers || []),
    ];
    const planInPublic = allPlans.some((p: any) => p.slug === planSlug || p.id === testPlanId);
    record("Pricing Plans", "Pricing Plan Visible on Public Website", planInPublic);

    // Delete plan
    await request(`/api/v1/admin/pricing/${testPlanId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const planInDb = await prisma.productPlan.findUnique({ where: { id: testPlanId } });
    record("Pricing Plans", "Admin Delete Pricing Plan", !planInDb);
  } catch (err: any) {
    record("Pricing Plans", "Pricing Lifecycle Error", false, err.message);
    if (testPlanId) {
      await prisma.productPlan.deleteMany({ where: { id: testPlanId } });
    }
  }

  // 5. Inbound CRM (Contact Inquiries, Demo Requests, Newsletter)
  const testEmail = `e2e.test.${Date.now()}@example.com`;

  try {
    // A. Submit public contact inquiry
    const contactRes = await request("/api/v1/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Marcus Aurelius",
        company: "Roman Enterprise",
        email: testEmail,
        country: "Italy",
        companySize: "1000+",
        solution: "Enterprise Architecture",
        req: "Evaluating DEZORYN platform for mission-critical core operations.",
      }),
    });
    const contactInquiryId = contactRes.data?.data?.id;
    record("CRM & Inbound", "Submit Public Contact Inquiry", !!contactInquiryId);

    // Verify in Admin Leads
    const leadsRes = await request("/api/v1/admin/leads", { headers: authHeaders });
    const leadInAdmin = leadsRes.data?.data?.find((l: any) => l.email === testEmail);
    record("CRM & Inbound", "Contact Inquiry Appears in Admin Leads", !!leadInAdmin);

    // Update status in Admin
    if (leadInAdmin) {
      await request(`/api/v1/admin/leads/${leadInAdmin.id}/status`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "QUALIFIED", notes: "Verified in E2E automated test suite." }),
      });
      const leadDb = await prisma.leadEnquiry.findUnique({ where: { id: leadInAdmin.id } });
      record("CRM & Inbound", "Update Lead Status in Admin (QUALIFIED)", leadDb?.status === "QUALIFIED");

      // Cleanup
      await request(`/api/v1/admin/leads/${leadInAdmin.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }

    // B. Submit public demo request
    const demoRes = await request("/api/v1/demo", {
      method: "POST",
      body: JSON.stringify({
        contactName: "Marcus Aurelius",
        company: "Roman Enterprise",
        businessEmail: testEmail,
        country: "Italy",
        productSlug: "schooly",
        preferredDate: "2026-11-01",
        preferredTime: "14:00 UTC",
        notes: "Need complete architectural review.",
      }),
    });
    const demoRequestId = demoRes.data?.data?.id;
    record("CRM & Inbound", "Submit Public Demo Request", !!demoRequestId);

    // Verify in Admin Demos
    const demosRes = await request("/api/v1/admin/demos", { headers: authHeaders });
    const demoInAdmin = demosRes.data?.data?.find((d: any) => d.businessEmail === testEmail || d.workEmail === testEmail);
    record("CRM & Inbound", "Demo Request Appears in Admin Demos", !!demoInAdmin);

    if (demoInAdmin) {
      await request(`/api/v1/admin/demos/${demoInAdmin.id}/status`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "CONFIRMED", meetingLink: "https://meet.dezoryn.com/demo-e2e" }),
      });
      const demoDb = await prisma.demoRequest.findUnique({ where: { id: demoInAdmin.id } });
      record("CRM & Inbound", "Update Demo Status (CONFIRMED)", demoDb?.status === "CONFIRMED");

      // Cleanup
      await request(`/api/v1/admin/demos/${demoInAdmin.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }

    // C. Newsletter Subscription
    const newsRes = await request("/api/v1/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        source: "e2e_test_footer",
      }),
    });
    record("CRM & Inbound", "Public Newsletter Subscription", newsRes.data?.success);

    const newsList = await request("/api/v1/admin/newsletter", { headers: authHeaders });
    const subInAdmin = newsList.data?.data?.find((s: any) => s.email === testEmail);
    record("CRM & Inbound", "Subscriber Appears in Admin Newsletter", !!subInAdmin);

    if (subInAdmin) {
      await request(`/api/v1/admin/newsletter/${subInAdmin.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }
  } catch (err: any) {
    record("CRM & Inbound", "CRM Flow Error", false, err.message);
  }

  // 6. Media Library & Storage
  try {
    const mediaRes = await request("/api/v1/admin/media", { headers: authHeaders });
    const hasMediaList = Array.isArray(mediaRes.data?.data);
    record("Media Management", "List Admin Media Assets", hasMediaList, `Found ${mediaRes.data?.data?.length || 0} assets`);
  } catch (err: any) {
    record("Media Management", "Media Assets Error", false, err.message);
  }

  // 7. Company Profile & Legal Policies
  try {
    const compRes = await request("/api/v1/company");
    record("Company Profile", "Public Company Profile Data", !!compRes.data?.data?.siteName);

    const legalRes = await request("/api/v1/legal/privacy");
    record("Legal Policies", "Public Legal Document (Privacy)", !!legalRes.data?.data?.title);
  } catch (err: any) {
    record("CMS & Policies", "Company & Legal APIs", false, err.message);
  }

  // 8. Super Admin Audit Trail Verification
  try {
    const auditRes = await request("/api/v1/admin/audit-logs?limit=10", { headers: authHeaders });
    const logs = auditRes.data?.data;
    const hasLogs = Array.isArray(logs) && logs.length > 0;
    record("Audit Logs", "Tamper-Evident Audit Logging Active", hasLogs, `Recent entries: ${logs?.length || 0}`);
  } catch (err: any) {
    record("Audit Logs", "Audit Trail Error", false, err.message);
  }

  console.log("\n================================================================================");
  console.log(" VERIFICATION SUMMARY");
  console.log("================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`Total Scenarios Tested : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`Success Rate           : ${((passed / total) * 100).toFixed(1)}%`);

  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

runE2EVerification().catch(async (e) => {
  console.error("Unhandled verification exception:", e);
  await prisma.$disconnect();
  process.exit(1);
});
