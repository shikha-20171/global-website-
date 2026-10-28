import { buildApp } from "../src/app.js";
import { prisma, connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { COOKIE_NAME } from "../src/config/constants.js";

async function runTestSuite() {
  console.log("========================================================================");
  console.log("🧪 RUNNING COMPREHENSIVE DEZORYN TECHNOLOGY BACKEND TEST SUITE");
  console.log("========================================================================");

  await connectDatabase();
  const app = buildApp();
  try {
    await app.ready();
  } catch (err) {
    console.error("App startup error:", err);
    throw err;
  }

  let passed = 0;
  let failed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      process.exitCode = 1;
    }
  }

  // Track created fixtures for safe cleanup
  const cleanupIds = {
    testProductId: "",
    testPageId: "",
    testLeadId: "",
    testDemoId: "",
    testNewsletterEmail: "",
    sessionToken: "",
    sessionCookie: "",
  };

  try {
    // --------------------------------------------------------------------------
    // 1. Health Checks & Database Ping
    // --------------------------------------------------------------------------
    console.log("\n[Group 1] Health & Connectivity");
    const healthRes = await app.inject({ method: "GET", url: "/health" });
    assert(healthRes.statusCode === 200, "Root Health Check /health", `HTTP ${healthRes.statusCode}`);
    const healthJson = healthRes.json();
    assert(healthJson.data?.database?.status === "connected", "Database Connectivity Probe", healthJson.data?.database?.dialect);

    const v1HealthRes = await app.inject({ method: "GET", url: "/api/v1/health" });
    assert(v1HealthRes.statusCode === 200, "Versioned Health Check /api/v1/health", `HTTP ${v1HealthRes.statusCode}`);

    // --------------------------------------------------------------------------
    // 2. Authentication & Session Management
    // --------------------------------------------------------------------------
    console.log("\n[Group 2] Authentication & Session Management");
    
    // Invalid credentials rejection
    const badLoginRes = await app.inject({
      method: "POST",
      url: "/api/v1/admin/auth/login",
      payload: { email: "admin@dezoryn.com", password: "IncorrectPassword123!" },
    });
    assert(badLoginRes.statusCode === 401, "Auth Rejection on Invalid Password", `HTTP ${badLoginRes.statusCode}`);

    // Valid Super Admin Login
    const goodLoginRes = await app.inject({
      method: "POST",
      url: "/api/v1/admin/auth/login",
      payload: { email: "admin@dezoryn.com", password: "SuperSecretAdminPassword2026!" },
    });
    assert(goodLoginRes.statusCode === 200, "Super Admin Login Succeeded", `HTTP ${goodLoginRes.statusCode}`);
    const loginJson = goodLoginRes.json();
    assert(!!loginJson.data?.token, "Session Token Returned in Payload");
    assert(loginJson.data?.user?.roleId === "super_admin", "Super Admin Role Verified", loginJson.data?.user?.role);
    
    cleanupIds.sessionToken = loginJson.data?.token;

    // Check Set-Cookie header for HttpOnly session cookie
    const cookiesHeader = goodLoginRes.headers["set-cookie"];
    assert(!!cookiesHeader, "HttpOnly Session Cookie Delivered", String(cookiesHeader).slice(0, 40) + "...");
    if (typeof cookiesHeader === "string") {
      cleanupIds.sessionCookie = cookiesHeader.split(";")[0];
    } else if (Array.isArray(cookiesHeader) && cookiesHeader[0]) {
      cleanupIds.sessionCookie = cookiesHeader[0].split(";")[0];
    }

    // Verify /admin/auth/me with Bearer token
    const meRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/auth/me",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(meRes.statusCode === 200, "Authenticated Admin Profile (/admin/auth/me)", meRes.json().data?.email);

    // Verify /admin/auth/me with Cookie
    const meCookieRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/auth/me",
      headers: { cookie: cleanupIds.sessionCookie },
    });
    assert(meCookieRes.statusCode === 200, "Authenticated Admin Profile via Cookie", meCookieRes.json().data?.name);

    // Unauthenticated rejection on protected route
    const unauthRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/dashboard",
    });
    assert(unauthRes.statusCode === 401, "Unauthorized Request Denied on Protected Route", `HTTP ${unauthRes.statusCode}`);

    // --------------------------------------------------------------------------
    // 3. Admin Dashboard
    // --------------------------------------------------------------------------
    console.log("\n[Group 3] Executive Admin Dashboard");
    const dashRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/dashboard",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(dashRes.statusCode === 200, "Admin Dashboard Metrics Retrieved", `HTTP ${dashRes.statusCode}`);
    const dashData = dashRes.json().data;
    assert(dashData?.products?.total >= 11, "Dashboard Real Product Count", `${dashData?.products?.total} products`);
    assert(dashData?.cms?.totalPages >= 26, "Dashboard Real CMS Page Count", `${dashData?.cms?.totalPages} pages`);
    assert(Array.isArray(dashData?.recentActivity), "Dashboard Recent Activity Stream", `${dashData?.recentActivity?.length} logs`);

    // --------------------------------------------------------------------------
    // 4. Public Website Endpoints & Publication Integrity
    // --------------------------------------------------------------------------
    console.log("\n[Group 4] Public Website Endpoints");
    
    // Products
    const prodsRes = await app.inject({ method: "GET", url: "/api/v1/products" });
    assert(prodsRes.statusCode === 200, "Public Published Products (/api/v1/products)", `${prodsRes.json().data?.length} items`);

    const singleProdRes = await app.inject({ method: "GET", url: "/api/v1/products/schooly-core" });
    assert(singleProdRes.statusCode === 200, "Single Product by Slug (/api/v1/products/schooly-core)", singleProdRes.json().data?.name);

    const catsRes = await app.inject({ method: "GET", url: "/api/v1/products/categories" });
    assert(catsRes.statusCode === 200, "Product Categories (/api/v1/products/categories)", `${catsRes.json().data?.length} categories`);

    const compareRes = await app.inject({ method: "GET", url: "/api/v1/products/compare" });
    assert(compareRes.statusCode === 200, "Comparison Matrix (/api/v1/products/compare)", `${compareRes.json().data?.attributes?.length} attributes`);

    // Solutions & Industries
    const solsRes = await app.inject({ method: "GET", url: "/api/v1/solutions" });
    assert(solsRes.statusCode === 200, "Public Solutions (/api/v1/solutions)", `${solsRes.json().data?.length} solutions`);

    const indsRes = await app.inject({ method: "GET", url: "/api/v1/industries" });
    assert(indsRes.statusCode === 200, "Public Industries (/api/v1/industries)", `${indsRes.json().data?.length} verticals`);

    // Projects & Case Studies
    const projsRes = await app.inject({ method: "GET", url: "/api/v1/projects" });
    assert(projsRes.statusCode === 200, "Public Projects (/api/v1/projects)", `${projsRes.json().data?.length} projects`);

    const csRes = await app.inject({ method: "GET", url: "/api/v1/case-studies" });
    assert(csRes.statusCode === 200, "Public Case Studies (/api/v1/case-studies)", `${csRes.json().data?.length} case studies`);

    // Content Hub (Blog, FAQs, Careers, Partners)
    const blogRes = await app.inject({ method: "GET", url: "/api/v1/content/blog" });
    assert(blogRes.statusCode === 200, "Public Blog Articles (/api/v1/content/blog)", `${blogRes.json().data?.length} articles`);

    const faqsRes = await app.inject({ method: "GET", url: "/api/v1/content/faqs" });
    assert(faqsRes.statusCode === 200, "Public FAQs (/api/v1/content/faqs)", `${faqsRes.json().data?.length} FAQs`);

    // Pricing & Navigation & Company & Settings
    const pricingRes = await app.inject({ method: "GET", url: "/api/v1/pricing" });
    assert(pricingRes.statusCode === 200, "Public Pricing Plans (/api/v1/pricing)", `${pricingRes.json().data?.totalPlans} plans`);

    const navRes = await app.inject({ method: "GET", url: "/api/v1/navigation" });
    assert(navRes.statusCode === 200, "Public Navigation Menus (/api/v1/navigation)", `${navRes.json().data?.header?.length} header items`);

    const compRes = await app.inject({ method: "GET", url: "/api/v1/company" });
    assert(compRes.statusCode === 200, "Corporate Profile (/api/v1/company)", compRes.json().data?.siteName);

    const settingsRes = await app.inject({ method: "GET", url: "/api/v1/settings/public" });
    assert(settingsRes.statusCode === 200, "Public Settings Sanity (/api/v1/settings/public)", `site_name: ${settingsRes.json().data?.site_name}`);
    assert(!settingsRes.json().data?.jwt_secret && !settingsRes.json().data?.database_url, "No Secrets Exposed in Public Settings");

    // --------------------------------------------------------------------------
    // 5. Inbound Leads, Demo Calendar & Newsletter (with Spam Defense)
    // --------------------------------------------------------------------------
    console.log("\n[Group 5] Inbound Leads & Spam Defense");
    cleanupIds.testNewsletterEmail = `audit.test.${Date.now()}@corporate-enterprise.com`;

    // 1. Submit Contact Inquiry
    const contactRes = await app.inject({
      method: "POST",
      url: "/api/v1/contact",
      payload: {
        name: "Devon Vance",
        company: "Vance Aerospace",
        email: cleanupIds.testNewsletterEmail,
        country: "United States",
        companySize: "501–1000",
        solution: "Cloud Infrastructure",
        budget: "$100,000+",
        req: "Need autonomous Kubernetes edge deployment runbooks and high-throughput telemetry.",
        source: "contact-sales",
      },
    });
    assert(contactRes.statusCode === 201, "Contact Inquiry Submission (/api/v1/contact)", `Lead ID: ${contactRes.json().data?.id}`);
    cleanupIds.testLeadId = contactRes.json().data?.id;

    // 2. Duplicate submission within 2 minutes must be throttled (429)
    const duplicateContactRes = await app.inject({
      method: "POST",
      url: "/api/v1/contact",
      payload: {
        name: "Devon Vance",
        company: "Vance Aerospace",
        email: cleanupIds.testNewsletterEmail,
        country: "United States",
        req: "Need autonomous Kubernetes edge deployment runbooks.",
      },
    });
    assert(duplicateContactRes.statusCode === 429, "Duplicate Inquiry Throttling (429 Too Many Requests)", "Spam defense active");

    // 3. Demo Booking
    const demoRes = await app.inject({
      method: "POST",
      url: "/api/v1/demo",
      payload: {
        contactName: "Devon Vance",
        company: "Vance Aerospace",
        businessEmail: `demo.${Date.now()}@vance-aero.com`,
        country: "United States",
        productSlug: "schooly-core",
        preferredDate: "Friday, Nov 10",
        preferredTime: "15:00",
        timeZone: "EST",
      },
    });
    assert(demoRes.statusCode === 201, "Demo Booking Request (/api/v1/demo)", `Demo ID: ${demoRes.json().data?.id}`);
    cleanupIds.testDemoId = demoRes.json().data?.id;

    // 4. Newsletter Subscription & Idempotent Duplicate
    const news1 = await app.inject({
      method: "POST",
      url: "/api/v1/newsletter/subscribe",
      payload: { email: cleanupIds.testNewsletterEmail, source: "website_footer" },
    });
    assert(news1.statusCode === 201, "Newsletter First Subscription", "SUBSCRIBED");

    const news2 = await app.inject({
      method: "POST",
      url: "/api/v1/newsletter/subscribe",
      payload: { email: cleanupIds.testNewsletterEmail, source: "website_footer" },
    });
    assert(news2.statusCode === 200 && news2.json().data?.status === "ALREADY_SUBSCRIBED", "Newsletter Idempotent Duplicate Handling", "Graceful 200 response");

    // --------------------------------------------------------------------------
    // 6. Admin Content Lifecycle & Draft Isolation
    // --------------------------------------------------------------------------
    console.log("\n[Group 6] Content Publishing & Draft Isolation Rules");
    const testSlug = `audit-test-product-${Date.now()}`;
    const category = await prisma.productCategory.findFirst();

    // 1. Create product as DRAFT
    const createProdRes = await app.inject({
      method: "POST",
      url: "/api/v1/admin/products",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
      payload: {
        slug: testSlug,
        name: "Dezoryn Edge Mesh",
        tagline: "Autonomous Distributed Mesh Gateway",
        description: "Zero-latency peer-to-peer data transport layer for edge compute nodes.",
        categoryId: category?.id,
        status: "DRAFT",
      },
    });
    assert(createProdRes.statusCode === 201, "Admin Product Creation (as DRAFT)", `ID: ${createProdRes.json().data?.id}`);
    cleanupIds.testProductId = createProdRes.json().data?.id;

    // 2. Verify DRAFT is hidden from public API
    const pubCheck1 = await app.inject({ method: "GET", url: "/api/v1/products" });
    const isDraftVisible = pubCheck1.json().data?.some((p: any) => p.slug === testSlug);
    assert(!isDraftVisible, "Draft Product Hidden from Public Website", "Status: DRAFT isolated");

    // 3. Publish product
    const pubProdRes = await app.inject({
      method: "POST",
      url: `/api/v1/admin/products/${cleanupIds.testProductId}/publish`,
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
      payload: { status: "PUBLISHED" },
    });
    assert(pubProdRes.statusCode === 200, "Admin Published Product", "Status changed to PUBLISHED");

    // 4. Verify product is now live on public website
    const pubCheck2 = await app.inject({ method: "GET", url: "/api/v1/products" });
    const isNowVisible = pubCheck2.json().data?.some((p: any) => p.slug === testSlug);
    assert(isNowVisible, "Published Product Live on Public Website", "Live on /api/v1/products");

    // --------------------------------------------------------------------------
    // 7. Admin CRM Pipeline Management
    // --------------------------------------------------------------------------
    console.log("\n[Group 7] Admin CRM Pipeline Transitions");
    const leadUpdateRes = await app.inject({
      method: "PATCH",
      url: `/api/v1/admin/inquiries/${cleanupIds.testLeadId}/status`,
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
      payload: { status: "QUALIFIED", notes: "Qualification call completed with enterprise team" },
    });
    assert(leadUpdateRes.statusCode === 200 && leadUpdateRes.json().data?.status === "QUALIFIED", "Lead Pipeline Status -> QUALIFIED", "Timeline updated");

    // --------------------------------------------------------------------------
    // 8. Audit Log Recording
    // --------------------------------------------------------------------------
    console.log("\n[Group 8] Audit Trail Verification");
    const auditRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/audit-logs?limit=5",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(auditRes.statusCode === 200, "Admin Audit Trail Inspection", `${auditRes.json().data?.length} records`);
    const recentAudit = auditRes.json().data?.[0];
    assert(!!recentAudit?.action, "Audit Record Fields Verified", `Action: ${recentAudit?.action} on ${recentAudit?.entityType}`);

    // --------------------------------------------------------------------------
    // 9. Backwards Compatibility (/api/... route aliases)
    // --------------------------------------------------------------------------
    console.log("\n[Group 9] Backwards Compatibility (/api route layer)");
    const legacyProdRes = await app.inject({ method: "GET", url: "/api/products" });
    assert(legacyProdRes.statusCode === 200, "Legacy Route Support /api/products", `${legacyProdRes.json().data?.length} products`);

    const legacyLeadRes = await app.inject({
      method: "GET",
      url: "/api/admin/leads?limit=5",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(legacyLeadRes.statusCode === 200, "Legacy Route Support /api/admin/leads", `HTTP ${legacyLeadRes.statusCode}`);

    // --------------------------------------------------------------------------
    // 10. Logout and Session Invalidation
    // --------------------------------------------------------------------------
    console.log("\n[Group 10] Session Revocation & Logout");
    const logoutRes = await app.inject({
      method: "POST",
      url: "/api/v1/admin/auth/logout",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(logoutRes.statusCode === 200, "Admin Logout Succeeded", "Session revoked");

    // Verify token is now rejected after logout
    const afterLogoutRes = await app.inject({
      method: "GET",
      url: "/api/v1/admin/auth/me",
      headers: { authorization: `Bearer ${cleanupIds.sessionToken}` },
    });
    assert(afterLogoutRes.statusCode === 401, "Revoked Session Token Rejected (401)", `HTTP ${afterLogoutRes.statusCode}`);
  } finally {
    // --------------------------------------------------------------------------
    // Clean up all test fixtures safely
    // --------------------------------------------------------------------------
    if (cleanupIds.testProductId) {
      await prisma.product.deleteMany({ where: { id: cleanupIds.testProductId } });
    }
    if (cleanupIds.testLeadId) {
      await prisma.leadEnquiry.deleteMany({ where: { id: cleanupIds.testLeadId } });
    }
    if (cleanupIds.testDemoId) {
      await prisma.demoRequest.deleteMany({ where: { id: cleanupIds.testDemoId } });
    }
    if (cleanupIds.testNewsletterEmail) {
      await prisma.newsletterSubscription.deleteMany({ where: { email: cleanupIds.testNewsletterEmail } });
    }

    console.log("========================================================================");
    console.log(`📊 TEST SUITE SUMMARY: ${passed} / ${total} tests passed (${failed} failed)`);
    console.log("========================================================================");

    await app.close();
    await disconnectDatabase();
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution encountered an error:", err);
  process.exit(1);
});
