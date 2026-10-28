const http = require("http");

async function makeRequest(path, method = "GET", data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const reqHeaders = {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (postData) {
      reqHeaders["Content-Length"] = Buffer.byteLength(postData);
    }

    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 5001,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            resolve({ status: res.statusCode, data: json });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );

    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log("=== VERIFYING FORM SUBMISSION & ADMIN CRM PIPELINE ===");

  // 1. Submit "Talk to an Expert" Contact Form
  const testEmail = `lead-${Date.now()}@enterprise.com`;
  console.log(`\n1. Submitting 'Talk to an Expert' Contact Form for: ${testEmail}`);
  const contactRes = await makeRequest("/api/v1/contact", "POST", {
    name: "Dr. Rajesh Varma",
    company: "Varma Healthcare Systems",
    email: testEmail,
    phone: "+91 99887 76655",
    country: "India",
    companySize: "51–200",
    solution: "Healthcare & Hospital Management",
    budget: "$25,000 – $100,000",
    req: "Looking for an integrated hospital ERP with OPD token management, pharmacy billing, and NABH compliance.",
    source: "contact-sales",
  });
  console.log("Contact submission result:", contactRes.status, contactRes.data?.message);
  if (contactRes.status !== 201) {
    throw new Error(`Contact submission failed: ${JSON.stringify(contactRes)}`);
  }
  const createdLeadId = contactRes.data?.data?.id;

  // 2. Submit "Get Started" Demo Request
  const demoEmail = `demo-${Date.now()}@enterprise.com`;
  console.log(`\n2. Submitting 'Get Started' Demo Request for: ${demoEmail}`);
  const demoRes = await makeRequest("/api/v1/demo", "POST", {
    contactName: "Ananya Sharma",
    company: "Global EdTech Academy",
    businessEmail: demoEmail,
    country: "India",
    productSlug: "schooly-core",
    preferredDate: "Thursday, Nov 12",
    preferredTime: "11:30 AM",
    timeZone: "Asia/Kolkata",
    notes: "Requires deep dive into automatic report card generation and parent mobile app.",
  });
  console.log("Demo reservation result:", demoRes.status, demoRes.data?.message);
  if (demoRes.status !== 201) {
    throw new Error(`Demo submission failed: ${JSON.stringify(demoRes)}`);
  }
  const createdDemoId = demoRes.data?.data?.id;

  // 3. Login to Admin Console
  console.log("\n3. Authenticating as Super Admin...");
  const loginRes = await makeRequest("/api/v1/auth/login", "POST", {
    email: "admin@dezoryn.com",
    password: "SuperSecretAdminPassword2026!",
  });
  const token = loginRes.data?.data?.token;
  if (!token) throw new Error("Could not authenticate as admin");
  console.log("Super Admin authenticated successfully. Token length:", token.length);

  // 4. Verify Contact Lead in Admin CRM (/api/v1/admin/leads)
  console.log("\n4. Verifying lead arrival in Admin CRM (/api/v1/admin/leads)...");
  const leadsRes = await makeRequest("/api/v1/admin/leads", "GET", null, {
    Authorization: `Bearer ${token}`,
  });
  const leadList = leadsRes.data?.data || [];
  const foundLead = leadList.find((l) => l.id === createdLeadId || l.email === testEmail);
  if (!foundLead) {
    throw new Error(`Lead was not found in Admin Leads list! Total leads returned: ${leadList.length}`);
  }
  console.log("FOUND LEAD IN ADMIN PANEL:");
  console.log({
    id: foundLead.id,
    name: foundLead.name,
    company: foundLead.company,
    email: foundLead.email,
    phone: foundLead.phone,
    source: foundLead.source,
    solution: foundLead.interestedSolution,
    budget: foundLead.budgetRange,
    requirement: foundLead.requirement?.slice(0, 50) + "...",
    status: foundLead.status,
  });

  // 5. Verify Demo in Admin CRM (/api/v1/admin/demos)
  console.log("\n5. Verifying demo booking arrival in Admin CRM (/api/v1/admin/demos)...");
  const demosRes = await makeRequest("/api/v1/admin/demos", "GET", null, {
    Authorization: `Bearer ${token}`,
  });
  const demoList = demosRes.data?.data || [];
  const foundDemo = demoList.find((d) => d.id === createdDemoId || d.businessEmail === demoEmail);
  if (!foundDemo) {
    throw new Error(`Demo was not found in Admin Demos list! Total demos returned: ${demoList.length}`);
  }
  console.log("FOUND DEMO IN ADMIN PANEL:");
  console.log({
    id: foundDemo.id,
    contactName: foundDemo.contactName,
    company: foundDemo.company,
    businessEmail: foundDemo.businessEmail,
    productSlug: foundDemo.productSlug,
    preferredDate: foundDemo.preferredDate,
    preferredTime: foundDemo.preferredTime,
    notes: foundDemo.notes?.slice(0, 50) + "...",
    status: foundDemo.status,
  });

  console.log("\n=== ALL CRM PIPELINE VERIFICATION CHECKS PASSED PERFECTLY! ===");
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});

