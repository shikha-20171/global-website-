import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow Vercel serverless function up to 60s for Render cold starts

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

async function handleProxy(request, { params }) {
  const backendBase = getBackendBase();

  if (!backendBase) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Backend URL not configured on Vercel. Please add NEXT_PUBLIC_API_URL or BACKEND_URL in Vercel Project Settings > Environment Variables (e.g. https://your-backend.onrender.com).",
      },
      { status: 503 }
    );
  }

  // Next.js 14/15 compatibility for params
  const resolvedParams = await Promise.resolve(params);
  const pathSegments = resolvedParams?.path || [];
  const pathStr = Array.isArray(pathSegments) ? pathSegments.join("/") : String(pathSegments);

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

  const method = request.method ? request.method.toUpperCase() : "GET";
  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(method);
  let body = undefined;

  if (hasBody) {
    try {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        body = arrayBuffer;
      }
    } catch (_) {
      // Body empty or already consumed
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 55000);

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const resContentType = backendRes.headers.get("content-type") || "";
    const resBody = await backendRes.arrayBuffer();

    const responseHeaders = new Headers();
    if (resContentType) {
      responseHeaders.set("Content-Type", resContentType);
    }

    // Pass through set-cookie if backend returns session cookies
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("Set-Cookie", setCookie);
    }

    return new NextResponse(resBody, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === "AbortError";
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Connecting to database server timed out or is spinning up (Render cold-start). Please retry in a few seconds."
          : `Failed to proxy request to backend: ${err.message}`,
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}

export async function GET(request, context) {
  return handleProxy(request, context);
}

export async function POST(request, context) {
  return handleProxy(request, context);
}

export async function PUT(request, context) {
  return handleProxy(request, context);
}

export async function PATCH(request, context) {
  return handleProxy(request, context);
}

export async function DELETE(request, context) {
  return handleProxy(request, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
    },
  });
}
