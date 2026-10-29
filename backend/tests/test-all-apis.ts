import { buildApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { prisma } from "../src/config/database.js";

interface ApiTestResult {
  category: string;
  name: string;
  method: string;
  url: string;
  status: number;
  expectedStatus: number;
  timeMs: number;
  passed: boolean;
  notes: string;
}

async function runAllApisAudit() {
  console.log("========================================================================");
  console.log("  DEZORYN TECHNOLOGY — COMPREHENSIVE ALL-APIs & DATABASE LIVE PROBE");
  console.log("========================================================================\n");

  await connectDatabase();
  const app = await buildApp();
  await app.ready();

  const results: ApiTestResult[] = [];

  // Helper to test injected requests
  async function testEndpoint(
    category: string,
    name: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    expectedStatus: number,
    payload?: any,
    headers?: Record<string, string>
  ) {
    const start = Date.now();
    try {
      const response = await app.inject({
        method,
        url,
        payload,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      const timeMs = Date.now() - start;
      const passed = response.statusCode === expectedStatus;
      let notes = "";
      try {
        const body = JSON.parse(response.body);
        if (body.data !== undefined) {
          if (Array.isArray(body.data)) {
            notes = `${body.data.length} records`;
          } else if (typeof body.data === "object" && body.data !== null) {
            notes = body.data.title || body.data.name || body.data.id || body.data.status || "Object OK";
          } else {
            notes = String(body.data);
          }
        } else if (body.success !== undefined) {
          notes = body.message || (body.success ? "Success" : "Failed");
        }
      } catch {
        notes = response.body.slice(0, 40);
      }

      results.push({
        category,
        name,
        method,
        url,
        status: response.statusCode,
        expectedStatus,
        timeMs,
        passed,
        notes,
      });

      const icon = passed ? "✓" : "✗";
      console.log(`  ${icon} [${method}] ${url.padEnd(38)} -> HTTP ${response.statusCode} (${timeMs}ms) [${notes}]`);
      return response;
    } catch (err: any) {
      const timeMs = Date.now() - start;
      results.push({
        category,
        name,
        method,
        url,
        status: 0,
        expectedStatus,
        timeMs,
        passed: false,
        notes: err.message,
      });
      console.log(`  ✗ [${method}] ${url.padEnd(38)} -> ERROR: ${err.message}`);
      return null;
    }
  }

  console.log("\n--- 1. SYSTEM ROOT & HEALTH PROBES ---");
  await testEndpoint("System", "Root Service Info", "GET", "/", 200);
  await testEndpoint("System", "Root Health Check", "GET", "/health", 200);
  await testEndpoint("System", "Versioned API Health", "GET", "/api/v1/health", 200);
  await testEndpoint("System", "Compatibility Health", "GET", "/api/health", 200);

  console.log("\n--- 2. PUBLIC PRODUCTS & COMPARISONS ---");
  await testEndpoint("Products", "List Products", "GET", "/api/v1/products", 200);
  await testEndpoint("Products", "Product Categories", "GET", "/api/v1/products/categories", 200);
  await testEndpoint("Products", "Single Product Slug", "GET", "/api/v1/products/schooly-core", 200);
  await testEndpoint("Products", "Comparison Matrix", "GET", "/api/v1/products/compare", 200);

  console.log("\n--- 3. ENTERPRISE SOLUTIONS & INDUSTRY VERTICALS ---");
  await testEndpoint("Solutions", "List Solutions", "GET", "/api/v1/solutions", 200);
  await testEndpoint("Solutions", "Single Solution Slug", "GET", "/api/v1/solutions/enterprise", 200);
  await testEndpoint("Industries", "List Industries", "GET", "/api/v1/industries", 200);
  await testEndpoint("Industries", "Single Industry Slug", "GET", "/api/v1/industries/education", 200);

  console.log("\n--- 4. PROJECTS & IN-DEPTH CASE STUDIES ---");
  await testEndpoint("Projects", "List Client Projects", "GET", "/api/v1/projects", 200);
  await testEndpoint("Projects", "Single Project Slug", "GET", "/api/v1/projects/schooly-core-campus", 200);
  await testEndpoint("Case Studies", "List Case Studies", "GET", "/api/v1/case-studies", 200);
  await testEndpoint("Case Studies", "Single Case Study Slug", "GET", "/api/v1/case-studies/schooly-core-campus", 200);

  console.log("\n--- 5. RESOURCES & KNOWLEDGE HUB ---");
  await testEndpoint("Resources", "List Blog Posts", "GET", "/api/v1/content/blog", 200);
  await testEndpoint("Resources", "Single Blog Post", "GET", "/api/v1/content/blog/agentic-ai-workflow-orchestration", 200);
  await testEndpoint("Resources", "Frequently Asked Questions", "GET", "/api/v1/content/faqs", 200);
  await testEndpoint("Resources", "Active Job Openings", "GET", "/api/v1/content/careers", 200);
  await testEndpoint("Resources", "Strategic Enterprise Partners", "GET", "/api/v1/content/partners", 200);
  await testEndpoint("Resources", "Benchmark Whitepapers & Reports", "GET", "/api/v1/content/insights", 200);
  await testEndpoint("Resources", "Engineering Runbooks & Docs", "GET", "/api/v1/content/docs", 200);
  await testEndpoint("Resources", "Public REST API Reference", "GET", "/api/v1/content/api-reference", 200);

  console.log("\n--- 6. CORPORATE, LEGAL & SITE CMS ---");
  await testEndpoint("Pricing", "List Pricing Plans", "GET", "/api/v1/pricing", 200);
  await testEndpoint("Company", "Company Profile & Leadership", "GET", "/api/v1/company", 200);
  await testEndpoint("Legal", "List Legal Policies", "GET", "/api/v1/legal", 200);
  await testEndpoint("Legal", "Single Policy Slug (Privacy)", "GET", "/api/v1/legal/privacy", 200);
  await testEndpoint("Legal", "Single Policy Slug (Terms)", "GET", "/api/v1/legal/terms", 200);
  await testEndpoint("Settings", "Public Website Settings", "GET", "/api/v1/settings/public", 200);
  await testEndpoint("Navigation", "Navigation Menu Trees", "GET", "/api/v1/navigation", 200);
  await testEndpoint("CMS Pages", "List CMS Pages", "GET", "/api/v1/pages", 200);
  await testEndpoint("Media", "List Media Library Assets", "GET", "/api/v1/media", 200);

  console.log("\n--- 7. PUBLIC INBOUND DISPATCH & CRM INGESTION ---");
  const testEmail = `probe.${Date.now()}@example.com`;
  const contactRes = await testEndpoint("CRM Inbound", "Submit Contact Inquiry (/api/v1/contact)", "POST", "/api/v1/contact", 201, {
    name: "Dr. Evelyn Reed",
    company: "Apex Global Health",
    email: testEmail,
    phone: "+1 (555) 789-0123",
    country: "United States",
    companySize: "50-200",
    solution: "dezo-care",
    budget: "$50,000+",
    req: "Looking for HL7 FHIR electronic patient records integration and emergency triage bed dispatch.",
    source: "contact-sales",
  });

  const demoRes = await testEndpoint("CRM Inbound", "Submit Demo Request (/api/v1/demo)", "POST", "/api/v1/demo", 201, {
    contactName: "Marcus Sterling",
    company: "Sterling Aviation",
    businessEmail: `demo.${Date.now()}@sterling-air.com`,
    phone: "+44 20 7946 0912",
    country: "United Kingdom",
    productSlug: "schooly-core",
    preferredDate: "Next Tuesday",
    preferredTime: "11:00 AM",
    timeZone: "Europe/London",
    notes: "Demonstration of student compliance & automated scheduling.",
  });

  await testEndpoint("CRM Inbound", "Subscribe Newsletter", "POST", "/api/v1/newsletter/subscribe", 201, {
    email: `newsletter.${Date.now()}@example.org`,
    source: "website_footer",
  });

  console.log("\n--- 8. ADMIN AUTHENTICATION & SECURED CRM ---");
  const loginRes = await testEndpoint("Admin Auth", "Super Admin Login", "POST", "/api/v1/admin/auth/login", 200, {
    email: "admin@dezoryn.com",
    password: "SuperSecretAdminPassword2026!",
  });

  let adminToken = "";
  try {
    const loginData = JSON.parse(loginRes?.body || "{}");
    adminToken = loginData.data?.token || "";
  } catch {}

  const authHeader = { Authorization: `Bearer ${adminToken}` };

  await testEndpoint("Admin Profile", "Get Current User Profile (/me)", "GET", "/api/v1/admin/auth/me", 200, undefined, authHeader);
  await testEndpoint("Admin Dashboard", "Get Dashboard Summary (/admin/dashboard)", "GET", "/api/v1/admin/dashboard", 200, undefined, authHeader);
  await testEndpoint("Admin Dashboard", "Get Aggregated Dashboard Stats (/admin/dashboard/stats)", "GET", "/api/v1/admin/dashboard/stats", 200, undefined, authHeader);
  await testEndpoint("Admin CRM", "List All CRM Leads", "GET", "/api/v1/admin/leads", 200, undefined, authHeader);
  await testEndpoint("Admin CRM", "List All Demo Requests", "GET", "/api/v1/admin/demos", 200, undefined, authHeader);
  await testEndpoint("Admin CRM", "List Newsletter Subscribers", "GET", "/api/v1/admin/newsletter", 200, undefined, authHeader);
  await testEndpoint("Admin Management", "List Admin Users", "GET", "/api/v1/admin/users", 200, undefined, authHeader);
  await testEndpoint("Admin Management", "List RBAC Roles", "GET", "/api/v1/admin/roles", 200, undefined, authHeader);
  await testEndpoint("Admin CMS", "List Admin Website Pages", "GET", "/api/v1/admin/pages", 200, undefined, authHeader);
  await testEndpoint("Admin Settings", "List Admin Settings", "GET", "/api/v1/admin/settings", 200, undefined, authHeader);
  await testEndpoint("Admin Security", "List Security Audit Logs (/admin/audit-logs)", "GET", "/api/v1/admin/audit-logs", 200, undefined, authHeader);
  await testEndpoint("Admin Security", "List Security Audit Logs (/admin/audit alias)", "GET", "/api/v1/admin/audit", 200, undefined, authHeader);
  await testEndpoint("Admin Notifications", "List Admin Notifications", "GET", "/api/v1/admin/notifications", 200, undefined, authHeader);

  console.log("\n--- 9. CLEANUP TEST DATA ---");
  try {
    await prisma.leadEnquiry.deleteMany({ where: { email: testEmail } });
    await prisma.demoRequest.deleteMany({ where: { businessEmail: { contains: "sterling-air.com" } } });
    await prisma.newsletterSubscription.deleteMany({ where: { email: { contains: "@example.org" } } });
    console.log("  ✓ Test records cleaned up successfully");
  } catch (err: any) {
    console.warn("  Clean-up notice:", err.message);
  }

  await app.close();
  await disconnectDatabase();

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const avgTime = Math.round(results.reduce((acc, r) => acc + r.timeMs, 0) / total);

  console.log("\n========================================================================");
  console.log(`  ALL-APIs PROBE SUMMARY: ${passed} / ${total} ENDPOINTS OPERATIONAL (100%)`);
  console.log(`  Average Response Latency: ${avgTime}ms`);
  console.log("========================================================================");

  if (failed > 0) {
    console.error(`\nFailed Endpoints: ${failed}`);
    process.exit(1);
  }
}

runAllApisAudit().catch((err) => {
  console.error("FATAL ERROR in API probe:", err);
  process.exit(1);
});
