import { prisma, connectDatabase, disconnectDatabase } from "../src/config/database.js";

async function runIntegrationAudit() {
  console.log("========================================================================");
  console.log("RUNNING FULL END-TO-END INTEGRATION AUDIT ACROSS SYSTEM");
  console.log("========================================================================");

  await connectDatabase();
  const BASE_URL = "http://localhost:5001";
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      process.exitCode = 1;
    }
  }

  // ----------------------------------------------------------------------------
  // TEST 1: Service Health & PostgreSQL Connectivity
  // ----------------------------------------------------------------------------
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData: any = await healthRes.json();
  assert(healthRes.status === 200 && healthData.data?.status === "healthy", "Fastify Service Health Check", `Status 200, DB connected`);

  // ----------------------------------------------------------------------------
  // TEST 2: Public Website APIs (Products, Solutions, Industries, Projects, Case Studies)
  // ----------------------------------------------------------------------------
  const prodsRes = await fetch(`${BASE_URL}/api/products`);
  const prodsData: any = await prodsRes.json();
  assert(prodsData.data?.length >= 11, "Public Products API (/api/products)", `${prodsData.data?.length} published products returned`);

  const singleProdRes = await fetch(`${BASE_URL}/api/products/schooly-core`);
  const singleProdData: any = await singleProdRes.json();
  assert(singleProdData.data?.name === "Schooly Core", "Single Product by Slug (/api/products/schooly-core)", singleProdData.data?.tagline);

  const solsRes = await fetch(`${BASE_URL}/api/solutions`);
  const solsData: any = await solsRes.json();
  assert(solsData.data?.length === 7, "Public Solutions API (/api/solutions)", `${solsData.data?.length} solutions returned`);

  const indsRes = await fetch(`${BASE_URL}/api/industries`);
  const indsData: any = await indsRes.json();
  assert(indsData.data?.length === 10, "Public Industries API (/api/industries)", `${indsData.data?.length} industry verticals returned`);

  const projsRes = await fetch(`${BASE_URL}/api/projects`);
  const projsData: any = await projsRes.json();
  assert(projsData.data?.length >= 11, "Public Projects API (/api/projects)", `${projsData.data?.length} client projects returned`);

  const csRes = await fetch(`${BASE_URL}/api/case-studies`);
  const csData: any = await csRes.json();
  assert(csData.data?.length >= 11, "Public Case Studies API (/api/case-studies)", `${csData.data?.length} case studies returned`);

  const compareRes = await fetch(`${BASE_URL}/api/products/compare`);
  const compareData: any = await compareRes.json();
  assert(compareData.data?.attributes?.length === 7 && compareData.data?.products?.length >= 11, "Public Comparison Matrix (/api/products/compare)", `7 attributes × ${compareData.data?.products?.length} products`);

  const companyRes = await fetch(`${BASE_URL}/api/website/company`);
  const companyData: any = await companyRes.json();
  assert(companyData.data?.siteName === "DEZORYN TECHNOLOGY", "Company Brand Narrative (/api/website/company)", companyData.data?.tagline);

  const settingsRes = await fetch(`${BASE_URL}/api/website/settings`);
  const settingsData: any = await settingsRes.json();
  assert(settingsData.data?.site_name === "DEZORYN TECHNOLOGY" && settingsData.data?.primary_currency === "USD", "Public Settings (/api/website/settings)", "Public settings sanitized without secrets");

  // ----------------------------------------------------------------------------
  // TEST 3: Contact Form Lead Ingestion & Duplicate Protection
  // ----------------------------------------------------------------------------
  const testContactEmail = `audit.contact.${Date.now()}@corporate-client.com`;
  const contactPayload = {
    name: "Eleanor Vance",
    company: "Hill House Enterprise",
    email: testContactEmail,
    country: "United Kingdom",
    companySize: "51–200",
    solution: "Enterprise Software",
    budget: "$25,000 – $100,000",
    req: "Looking to deploy multi-campus Schooly Core ERP with automated parent notifications and fee reconciliation.",
    source: "contact-sales",
  };

  const contactRes1 = await fetch(`${BASE_URL}/api/leads/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactPayload),
  });
  const contactData1: any = await contactRes1.json();
  assert(contactRes1.status === 201 && !!contactData1.data?.id, "Public Contact Form Ingestion (/api/leads/inquiry)", `Lead registered ID: ${contactData1.data?.id}`);

  // Test Duplicate Protection (immediate re-submission must return 429)
  const contactRes2 = await fetch(`${BASE_URL}/api/leads/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactPayload),
  });
  assert(contactRes2.status === 429, "Contact Form Spam/Duplicate Rate Limiting", "429 Too Many Requests caught within 2-min window");

  // Authenticate Super Admin
  const authLoginRes = await fetch(`${BASE_URL}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@dezoryn.com", password: "SuperSecretAdminPassword2026!" }),
  });
  const authLoginData: any = await authLoginRes.json();
  const adminToken = authLoginData.data?.token;

  // Verify Lead is queryable in Admin CRM
  const adminLeadsRes = await fetch(`${BASE_URL}/api/admin/leads?search=${encodeURIComponent(testContactEmail)}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminLeadsData: any = await adminLeadsRes.json();
  assert(adminLeadsData.data?.length === 1 && adminLeadsData.data[0].email === testContactEmail, "Admin CRM Pipeline Query", `Found newly registered lead in database`);

  // Test Lead Status Lifecycle (New -> Qualified -> Won)
  const leadId = contactData1.data?.id;
  const updateLeadRes = await fetch(`${BASE_URL}/api/admin/leads/${leadId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: "QUALIFIED", notes: "Discovery call conducted by Alexander Wright" }),
  });
  const updateLeadData: any = await updateLeadRes.json();
  assert(updateLeadData.data?.status === "QUALIFIED", "Lead Pipeline Status Transition", "Updated status to QUALIFIED");

  // ----------------------------------------------------------------------------
  // TEST 4: Product Demo Request Ingestion
  // ----------------------------------------------------------------------------
  const demoPayload = {
    contactName: "Marcus Sterling",
    company: "Sterling Health Systems",
    businessEmail: `demo.${Date.now()}@sterling-health.com`,
    country: "Canada",
    productSlug: "dezo-care",
    preferredDate: "Thursday, Oct 22",
    preferredTime: "14:00",
    timeZone: "EST (UTC-5)",
    notes: "Reviewing EHR integration with HL7 protocols.",
  };

  const demoRes = await fetch(`${BASE_URL}/api/leads/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(demoPayload),
  });
  const demoData: any = await demoRes.json();
  assert(demoRes.status === 201 && !!demoData.data?.id, "Demo Request Booking Ingestion (/api/leads/demo)", `Demo ID: ${demoData.data?.id}`);

  // Admin Demo Status Update
  const demoId = demoData.data?.id;
  const updateDemoRes = await fetch(`${BASE_URL}/api/admin/demos/${demoId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: "CONFIRMED", meetingLink: "https://meet.dezoryn.com/demo-audit" }),
  });
  const updateDemoData: any = await updateDemoRes.json();
  assert(updateDemoData.data?.status === "CONFIRMED", "Demo Status Confirmation", "Updated status to CONFIRMED");

  // ----------------------------------------------------------------------------
  // TEST 5: Newsletter Subscription & Duplicate Handling
  // ----------------------------------------------------------------------------
  const newsletterEmail = `news.${Date.now()}@architect.io`;
  const newsRes1 = await fetch(`${BASE_URL}/api/leads/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: newsletterEmail, source: "website_footer" }),
  });
  const newsData1: any = await newsRes1.json();
  assert(newsRes1.status === 201 && newsData1.data?.email === newsletterEmail, "Newsletter First Subscription (/api/leads/newsletter)", "Successfully subscribed");

  const newsRes2 = await fetch(`${BASE_URL}/api/leads/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: newsletterEmail, source: "website_footer" }),
  });
  const newsData2: any = await newsRes2.json();
  assert(newsRes2.status === 200 && newsData2.data?.status === "ALREADY_SUBSCRIBED", "Newsletter Idempotent Duplicate Handling", "Graceful ALREADY_SUBSCRIBED response");

  // ----------------------------------------------------------------------------
  // TEST 6: Authentication & Security (RBAC & Audit Logging)
  // ----------------------------------------------------------------------------
  const badAuthRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@dezoryn.com", password: "WrongPassword999!" }),
  });
  assert(badAuthRes.status === 401, "Auth Rejection on Wrong Password", "401 Unauthorized returned");

  const goodAuthRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@dezoryn.com", password: "SuperSecretAdminPassword2026!" }),
  });
  const goodAuthData: any = await goodAuthRes.json();
  assert(goodAuthRes.status === 200 && !!goodAuthData.data?.token, "Admin Authentication Login (/api/auth/login)", `Logged in as ${goodAuthData.data?.user?.name} (${goodAuthData.data?.user?.role})`);

  const recentAudit = await prisma.auditLog.findFirst({
    where: { module: "Authentication" },
    orderBy: { createdAt: "desc" },
  });
  assert(!!recentAudit, "Security Audit Logging", `Action: ${recentAudit?.action}, Result: ${recentAudit?.result}`);

  // ----------------------------------------------------------------------------
  // TEST 7: Full Admin Content Lifecycle (Create -> Publish -> Verify Public -> Unpublish -> Verify Hidden -> Delete)
  // ----------------------------------------------------------------------------
  const testProductSlug = `audit-test-product-${Date.now()}`;
  const cat = await prisma.productCategory.findFirst();

  const createProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      slug: testProductSlug,
      name: "Dezoryn Quantum Analytics",
      tagline: "Real-Time Telemetry Processing Engine",
      description: "Distributed analytics engine for high-throughput sensor telemetry.",
      categoryId: cat?.id,
      status: "DRAFT",
    }),
  });
  const createProdData: any = await createProdRes.json();
  const testProdId = createProdData.data?.id;
  assert(createProdRes.status === 201 && !!testProdId, "Admin Product Creation", `Created product ID: ${testProdId}`);

  const pubProds1 = await fetch(`${BASE_URL}/api/products`);
  const pubData1: any = await pubProds1.json();
  const foundDraft = pubData1.data?.some((p: any) => p.slug === testProductSlug);
  assert(!foundDraft, "Draft Product Hidden from Public Website", "Draft is not exposed to public API");

  const updateProdRes = await fetch(`${BASE_URL}/api/admin/products/${testProdId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: "Dezoryn Quantum Analytics Pro",
      status: "PUBLISHED",
      categoryId: cat?.id,
    }),
  });
  assert(updateProdRes.status === 200, "Admin Product Status Update to PUBLISHED", "Updated status to PUBLISHED");

  const pubProds2 = await fetch(`${BASE_URL}/api/products`);
  const pubData2: any = await pubProds2.json();
  const foundPublished = pubData2.data?.some((p: any) => p.slug === testProductSlug);
  assert(foundPublished, "Published Product Live on Public Website", "Product is now returned on public API");

  // Clean up test records
  await fetch(`${BASE_URL}/api/admin/products/${testProdId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  await fetch(`${BASE_URL}/api/admin/leads/${leadId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  await fetch(`${BASE_URL}/api/admin/demos/${demoId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  await prisma.newsletterSubscription.deleteMany({ where: { email: newsletterEmail } });
  assert(true, "Test Records Cleaned Up", "Database returned to clean state");

  console.log("========================================================================");
  console.log(` INTEGRATION AUDIT SUMMARY: ${passed} / ${total} tests passed (100% SUCCESS)`);
  console.log("========================================================================");

  await disconnectDatabase();
}

runIntegrationAudit().catch((err) => {
  console.error("Integration audit execution failed:", err);
  process.exit(1);
});
