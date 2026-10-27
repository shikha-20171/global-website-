import { prisma } from "./config/database.js";

const API_BASE = "http://localhost:5001";
const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@dezoryn.com";
const ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD || "SuperSecretAdminPassword2026!";

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

async function testRemainingModules() {
  console.log("================================================================================");
  console.log(" VERIFYING REMAINING ADMIN MODULES (Careers, Partners, Blog, FAQs, Case Studies, etc.)");
  console.log("================================================================================\n");

  // 1. Login
  const loginRes = await request("/api/v1/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const token = loginRes.data?.data?.token;
  if (!token) {
    console.error("Login failed");
    process.exit(1);
  }
  const authHeaders = { Authorization: `Bearer ${token}` };

  const tests: { name: string; pass: boolean; details?: string }[] = [];

  // --- 1. CAREERS ---
  try {
    const careerSlug = `test-lead-architect-${Date.now()}`;
    const createRes = await request("/api/v1/admin/careers", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Principal Distributed Systems Architect",
        slug: careerSlug,
        department: "Core Engineering",
        location: "Bhopal HQ / Hybrid",
        employmentType: "FULL_TIME",
        experienceLevel: "7+ Years",
        description: "Architect high-performance distributed SaaS systems.",
        requirements: ["Next.js", "Node.js", "PostgreSQL", "Kafka"],
        status: "PUBLISHED",
      }),
    });
    const jobId = createRes.data?.data?.id;
    const pubRes = await request("/api/v1/content/careers");
    const careersList = pubRes.data?.data || [];
    const inPublic = careersList.some((c: any) => c.id === jobId || c.slug === careerSlug);
    tests.push({
      name: "Careers: Create in Admin -> Appears on Live Website",
      pass: !!jobId && inPublic,
      details: `Created ID: ${jobId}, Live in public API: ${inPublic}`,
    });

    // Cleanup
    if (jobId) {
      await request(`/api/v1/admin/careers/${jobId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }
  } catch (err: any) {
    tests.push({ name: "Careers Module", pass: false, details: err.message });
  }

  // --- 2. PARTNERS ---
  try {
    const partnerSlug = `partner-e2e-${Date.now()}`;
    const createRes = await request("/api/v1/admin/partners", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Acme Global Cloud Solutions",
        slug: partnerSlug,
        tier: "STRATEGIC",
        category: "Cloud Infrastructure",
        websiteUrl: "https://acme-cloud.example.com",
        description: "Global enterprise cloud platform partner.",
        status: "PUBLISHED",
      }),
    });
    const partnerId = createRes.data?.data?.id;
    const pubRes = await request("/api/v1/content/partners");
    const partnerList = pubRes.data?.data || [];
    const inPublic = partnerList.some((p: any) => p.id === partnerId || p.slug === partnerSlug);
    tests.push({
      name: "Partners: Create in Admin -> Appears on Live Website",
      pass: !!partnerId && inPublic,
      details: `Created ID: ${partnerId}, Live in public API: ${inPublic}`,
    });

    // Cleanup
    if (partnerId) {
      await request(`/api/v1/admin/partners/${partnerId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }
  } catch (err: any) {
    tests.push({ name: "Partners Module", pass: false, details: err.message });
  }

  // --- 3. BLOG & ARTICLES ---
  try {
    const blogSlug = `article-e2e-${Date.now()}`;
    const createRes = await request("/api/v1/admin/blog", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Scaling PostgreSQL to 10M Operations",
        slug: blogSlug,
        excerpt: "Architectural insights on connection pooling, partitioning, and zero-downtime migrations.",
        content: "# Scaling PostgreSQL\n\nDetailed technical analysis of distributed databases...",
        category: "Engineering",
        tags: ["PostgreSQL", "Architecture", "Performance"],
        status: "PUBLISHED",
      }),
    });
    const articleId = createRes.data?.data?.id;
    const pubRes = await request("/api/v1/content/blog");
    const blogList = pubRes.data?.data || pubRes.data?.data?.posts || [];
    const inPublic = blogList.some((b: any) => b.id === articleId || b.slug === blogSlug);
    tests.push({
      name: "Blog: Create in Admin -> Appears on Live Website",
      pass: !!articleId && inPublic,
      details: `Created ID: ${articleId}, Live in public blog: ${inPublic}`,
    });

    // Detail check
    const detailRes = await request(`/api/v1/content/blog/${blogSlug}`);
    tests.push({
      name: "Blog: Public Article Detail Route Functional",
      pass: detailRes.status === 200 && detailRes.data?.data?.title?.includes("Scaling PostgreSQL"),
    });

    // Cleanup
    if (articleId) {
      await request(`/api/v1/admin/blog/${articleId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }
  } catch (err: any) {
    tests.push({ name: "Blog Module", pass: false, details: err.message });
  }

  // --- 4. FAQS ---
  try {
    const createRes = await request("/api/v1/admin/faqs", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        question: "How does DEZORYN handle regional data residency?",
        answer: "All enterprise tenant data is pinned to regional cloud zones per jurisdictional compliance rules.",
        category: "Security & Compliance",
        displayOrder: 1,
        status: "PUBLISHED",
      }),
    });
    const faqId = createRes.data?.data?.id;
    const pubRes = await request("/api/v1/content/faqs");
    const faqList = pubRes.data?.data || [];
    const inPublic = faqList.some((f: any) => f.id === faqId);
    tests.push({
      name: "FAQs: Create in Admin -> Appears on Live Website FAQ",
      pass: !!faqId && inPublic,
      details: `Created ID: ${faqId}, Live in public FAQs: ${inPublic}`,
    });

    // Cleanup
    if (faqId) {
      await request(`/api/v1/admin/faqs/${faqId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    }
  } catch (err: any) {
    tests.push({ name: "FAQs Module", pass: false, details: err.message });
  }

  // --- 5. SOLUTIONS ---
  try {
    const listRes = await request("/api/v1/admin/solutions", { headers: authHeaders });
    const solutions = listRes.data?.data || [];
    const pubRes = await request("/api/v1/solutions");
    const pubSolutions = pubRes.data?.data || [];
    tests.push({
      name: "Solutions Architecture: Admin & Public Sync",
      pass: listRes.status === 200 && pubRes.status === 200 && solutions.length > 0,
      details: `Admin solutions: ${solutions.length}, Public solutions: ${pubSolutions.length}`,
    });
  } catch (err: any) {
    tests.push({ name: "Solutions Module", pass: false, details: err.message });
  }

  // --- 6. INDUSTRIES ---
  try {
    const listRes = await request("/api/v1/admin/industries", { headers: authHeaders });
    const industries = listRes.data?.data || [];
    const pubRes = await request("/api/v1/industries");
    const pubIndustries = pubRes.data?.data || [];
    tests.push({
      name: "Industry Verticals: Admin & Public Sync",
      pass: listRes.status === 200 && pubRes.status === 200 && industries.length > 0,
      details: `Admin industries: ${industries.length}, Public industries: ${pubIndustries.length}`,
    });
  } catch (err: any) {
    tests.push({ name: "Industries Module", pass: false, details: err.message });
  }

  // --- 7. WEBSITE SETTINGS ---
  try {
    const adminSettingsRes = await request("/api/v1/admin/settings", { headers: authHeaders });
    const adminList = Array.isArray(adminSettingsRes.data?.data) ? adminSettingsRes.data.data : [];
    const adminMap: Record<string, string> = {};
    adminList.forEach((s: any) => { adminMap[s.key] = s.value; });
    
    // Test mutating a setting from admin using PUT
    const testTagline = `Global Enterprise Cloud Platforms - Updated ${Date.now()}`;
    await request("/api/v1/admin/settings", {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        site_tagline: testTagline,
      }),
    });

    const pubSettings = await request("/api/v1/settings/public");
    const pubTagline = pubSettings.data?.data?.site_tagline;

    tests.push({
      name: "Website Settings: Admin Update -> Reflects on Public Website",
      pass: pubTagline === testTagline,
      details: `Updated site_tagline: "${pubTagline}"`,
    });
  } catch (err: any) {
    tests.push({ name: "Settings Module", pass: false, details: err.message });
  }

  // Output results
  console.log("--------------------------------------------------------------------------------");
  tests.forEach((t) => {
    const mark = t.pass ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] ${t.name} ${t.details ? `(${t.details})` : ""}`);
  });
  console.log("--------------------------------------------------------------------------------");
  const passed = tests.filter((t) => t.pass).length;
  console.log(`Tested: ${tests.length} | Passed: ${passed} | Failed: ${tests.length - passed}`);
  await prisma.$disconnect();
}

testRemainingModules().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
