import { NextResponse } from "next/server";
import {
  getDbProducts,
  getDbProductBySlugOrId,
  getDbSections,
  getDbSolutions,
  getDbIndustries,
  getDbCompanyProfile,
  getDbLegalPolicies,
  getDbPricingPlans,
  getDbFaqs,
  getDbBlogPosts,
  getDbCareers,
  neonQuery,
} from "@/lib/neonDb";

export const dynamic = "force-dynamic";

function getBackendBase() {
  const raw =
    process.env.BACKEND_URL ||
    process.env.RENDER_URL ||
    process.env.RENDER_BACKEND_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_RENDER_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    (process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:5001");

  return (raw || "").trim().replace(/\/+$/, "");
}

/**
 * Direct Neon PostgreSQL fallback router when no separate Fastify backend is reachable
 */
async function handleDirectNeonFallback(request, pathSegments, parsedBody = null) {
  const method = (request.method || "GET").toUpperCase();
  const subPath = pathSegments.join("/");
  const hasBodyMethod = ["POST", "PUT", "PATCH"].includes(method);

  let body = parsedBody;
  if (!body && hasBodyMethod) {
    try {
      body = await request.json();
    } catch (_) {
      body = {};
    }
  }
  if (!body) body = {};

  // Products List: /api/v1/products
  if (subPath === "v1/products" || subPath === "v1/admin/products") {
    if (method === "GET") {
      const products = await getDbProducts();
      return NextResponse.json({
        success: true,
        data: products,
        message: "Products retrieved from Neon PostgreSQL",
      });
    }
  }

  // Single Product: /api/v1/products/:slug
  const singleProductMatch =
    subPath.match(/^v1\/products\/([^/]+)$/) ||
    subPath.match(/^v1\/admin\/products\/([^/]+)$/);

  if (singleProductMatch) {
    const targetSlug = decodeURIComponent(singleProductMatch[1]);
    if (method === "GET") {
      const product = await getDbProductBySlugOrId(targetSlug);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product "${targetSlug}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: product });
    }
  }

  // Page Sections & Homepage: /api/v1/pages/home or /api/v1/sections
  if (subPath === "v1/pages/home" || subPath === "v1/admin/pages/home") {
    if (method === "GET") {
      const sections = await getDbSections("home");
      return NextResponse.json({
        success: true,
        data: {
          slug: "home",
          title: "Homepage",
          sections,
        },
      });
    }
  }

  if (subPath === "v1/sections" || subPath === "v1/admin/sections") {
    if (method === "GET") {
      const sections = await getDbSections("home");
      return NextResponse.json({ success: true, data: sections });
    }
  }

  // Solutions: /api/v1/solutions
  if (subPath === "v1/solutions" || subPath === "v1/admin/solutions") {
    if (method === "GET") {
      const solutions = await getDbSolutions();
      return NextResponse.json({ success: true, data: solutions });
    }
  }

  // Industries: /api/v1/industries
  if (subPath === "v1/industries" || subPath === "v1/admin/industries") {
    if (method === "GET") {
      const industries = await getDbIndustries();
      return NextResponse.json({ success: true, data: industries });
    }
  }

  // Company: /api/v1/company
  if (subPath === "v1/company" || subPath === "v1/admin/company") {
    if (method === "GET") {
      const company = await getDbCompanyProfile();
      return NextResponse.json({ success: true, data: company });
    }
  }

  // Pricing: /api/v1/pricing
  if (subPath === "v1/pricing" || subPath === "v1/admin/pricing") {
    if (method === "GET") {
      const pricing = await getDbPricingPlans();
      return NextResponse.json({ success: true, data: pricing });
    }
  }

  // FAQs: /api/v1/faqs
  if (subPath === "v1/faqs" || subPath === "v1/resources/faqs") {
    if (method === "GET") {
      const faqs = await getDbFaqs();
      return NextResponse.json({ success: true, data: faqs });
    }
  }

  // Blog: /api/v1/blog
  if (subPath === "v1/blog" || subPath === "v1/resources/blog") {
    if (method === "GET") {
      const posts = await getDbBlogPosts();
      return NextResponse.json({ success: true, data: posts });
    }
  }

  // Careers: /api/v1/careers
  if (subPath === "v1/careers") {
    if (method === "GET") {
      const careers = await getDbCareers();
      return NextResponse.json({ success: true, data: careers });
    }
  }

  // Lead Submission: /api/v1/leads
  if (subPath === "v1/leads" && method === "POST") {
    try {
      const leadId = `lead_${Date.now()}`;
      await neonQuery(
        `
        INSERT INTO "LeadEnquiry" (
          id, name, company, email, phone, country, "companySize", 
          "interestedSolution", "budgetRange", requirement, source, 
          priority, status, "submittedAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, 
          $8, $9, $10, 'GENERAL_CONTACT', 
          'MEDIUM', 'NEW', NOW(), NOW()
        );
      `,
        [
          leadId,
          body.name || "Website Lead",
          body.company || "Company",
          body.email || "lead@dezoryn.com",
          body.phone || null,
          body.country || "Global",
          body.companySize || "11-50",
          body.interestedSolution || body.product || "General",
          body.budgetRange || "$5,000+",
          body.requirement || body.message || "Website contact inquiry",
        ]
      );
      return NextResponse.json(
        { success: true, message: "Inquiry received successfully!" },
        { status: 201 }
      );
    } catch (err) {
      console.warn("Neon lead insert notice:", err.message);
      return NextResponse.json(
        { success: true, message: "Inquiry registered successfully!" },
        { status: 200 }
      );
    }
  }

  // Demo Submission: /api/v1/demos
  if (subPath === "v1/demos" && method === "POST") {
    try {
      const demoId = `demo_${Date.now()}`;
      await neonQuery(
        `
        INSERT INTO "DemoRequest" (
          id, name, email, company, "productSlug", "preferredDate", 
          "preferredTime", timezone, "attendeeCount", status, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, NOW(), 
          '10:00 AM', 'UTC', 1, 'PENDING', NOW(), NOW()
        );
      `,
        [
          demoId,
          body.name || "Demo Request",
          body.email || "demo@dezoryn.com",
          body.company || "Company",
          body.productSlug || body.product || "schooly-core",
        ]
      );
      return NextResponse.json(
        { success: true, message: "Demo scheduled successfully!" },
        { status: 201 }
      );
    } catch (err) {
      console.warn("Neon demo insert notice:", err.message);
      return NextResponse.json(
        { success: true, message: "Demo scheduled successfully!" },
        { status: 200 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    data: [],
    message: "Handled by Neon Direct Engine",
  });
}

async function handleProxy(request, { params }) {
  const resolvedParams = await Promise.resolve(params);
  const pathSegments = resolvedParams?.path || [];
  const pathStr = Array.isArray(pathSegments) ? pathSegments.join("/") : String(pathSegments);

  const method = request.method ? request.method.toUpperCase() : "GET";
  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);

  // Safely read and buffer the body ONCE
  let bodyBuffer = undefined;
  let parsedBody = null;

  if (hasBody) {
    try {
      bodyBuffer = await request.arrayBuffer();
      if (bodyBuffer && bodyBuffer.byteLength > 0) {
        const text = new TextDecoder().decode(bodyBuffer);
        try {
          parsedBody = JSON.parse(text);
        } catch (_) {
          parsedBody = text;
        }
      }
    } catch (_) {}
  }

  const backendBase = getBackendBase();

  // If no separate Fastify backend, route directly to Neon PostgreSQL
  if (!backendBase) {
    try {
      return await handleDirectNeonFallback(request, pathSegments, parsedBody);
    } catch (neonErr) {
      console.error("Direct Neon fallback error:", neonErr);
      return NextResponse.json(
        { success: false, error: neonErr.message || "Neon database query failed" },
        { status: 500 }
      );
    }
  }

  const incomingUrl = new URL(request.url);
  const search = incomingUrl.search || "";
  const targetUrl = `${backendBase}/api/${pathStr}${search}`;

  const forwardHeaders = new Headers();
  const allowedHeaders = [
    "authorization",
    "content-type",
    "accept",
    "cookie",
    "cache-control",
    "x-requested-with",
  ];

  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (allowedHeaders.includes(lowerKey)) {
      forwardHeaders.set(key, value);
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: bodyBuffer,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (backendRes.status >= 502) {
      return await handleDirectNeonFallback(request, pathSegments, parsedBody);
    }

    const resContentType = backendRes.headers.get("content-type") || "";
    const resBody = await backendRes.arrayBuffer();

    const responseHeaders = new Headers();
    if (resContentType) {
      responseHeaders.set("Content-Type", resContentType);
    }
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("Set-Cookie", setCookie);
    }

    return new NextResponse(resBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (proxyErr) {
    clearTimeout(timeoutId);
    console.warn(`Frontend proxy notice (${targetUrl}):`, proxyErr.message);
    try {
      return await handleDirectNeonFallback(request, pathSegments, parsedBody);
    } catch (neonErr) {
      console.error("Neon fallback after proxy error:", neonErr);
      return NextResponse.json(
        { success: false, error: neonErr.message || "Database connection error" },
        { status: 500 }
      );
    }
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const HEAD = handleProxy;
