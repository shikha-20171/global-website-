import {
  products,
  getProduct,
  industries,
  getIndustry,
  projects,
  posts,
  getPost,
  CATEGORIES,
  enterpriseSections,
} from "./data";
import api, { getBaseUrl } from "./axios";

export { api, getBaseUrl };


function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramUrl = params.get("api_url") || params.get("backend");
      if (paramUrl) {
        localStorage.setItem("dezoryn_backend_url", paramUrl);
        return paramUrl.replace(/\/+$/, "");
      }
      const custom = localStorage.getItem("dezoryn_backend_url");
      if (custom) return custom.replace(/\/+$/, "");
    } catch (_) { }
  }

  const envUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_RENDER_URL ||
    process.env.BACKEND_URL ||
    process.env.RENDER_URL ||
    process.env.RENDER_BACKEND_URL ||
    process.env.API_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    ""
  ).trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // Running on server (SSR/Node)
  if (typeof window === "undefined") {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return "";
    }
    return "http://127.0.0.1:5001";
  }

  // Running in browser
  return "";
}


async function request(url, options = {}) {
  const base = getApiBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${base}${url}`;
  const isServer = typeof window === "undefined";

  // If on serverless host without a valid backend URL, skip remote fetch immediately
  if (isServer && !base && !url.startsWith("http")) {
    const err = new Error("Backend URL not configured on serverless runtime");
    err.code = "NO_BACKEND_URL";
    throw err;
  }

  const timeoutMs = options.timeout || (isServer ? 3500 : 50000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isGet = !options.method || options.method === "GET";
    const fetchOptions = {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    };

    if (isServer && isGet && !fetchOptions.next && !fetchOptions.cache) {
      fetchOptions.next = { revalidate: 60 };
    } else if (!fetchOptions.cache) {
      fetchOptions.cache = "default";
    }

    const res = await fetch(fullUrl, fetchOptions);
    clearTimeout(timer);

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}`;
      try {
        const errData = await res.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch (_) { }
      const err = new Error(errorMsg);
      err.status = res.status;
      throw err;
    }

    const json = await res.json();
    return json?.data !== undefined ? json.data : json;
  } catch (err) {
    clearTimeout(timer);

    // On client: if proxy failed and direct backend URL is configured, retry directly once
    const directBase = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_RENDER_URL ||
      (typeof window !== "undefined" ? localStorage.getItem("dezoryn_backend_url") : null) ||
      ""
    ).replace(/\/+$/, "");

    if (
      !isServer &&
      directBase &&
      !url.startsWith("http") &&
      !options._isRetry &&
      directBase !== base
    ) {
      return request(`${directBase}${url}`, { ...options, _isRetry: true });
    }

    throw err;
  }
}

// Safe HTTP request helpers
async function get(url, params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );
  const query = new URLSearchParams(cleanParams).toString();
  const target = query ? `${url}${url.includes("?") ? "&" : "?"}${query}` : url;
  return request(target, { method: "GET" });
}

async function post(url, payload = {}) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const apiClient = {
  get: (url, config = {}) => get(url, config?.params),
  post: (url, data) => post(url, data),
};

// Normalize product data shape
export function normalizeProduct(p) {
  if (!p) return p;
  const categoryStr =
    typeof p.category === "object" && p.category !== null
      ? p.category.name || p.category.slug || "Enterprise"
      : p.category || "Enterprise";

  let normalizedFeatures = p.features;
  if (Array.isArray(p.features) && p.features.length > 0) {
    normalizedFeatures = p.features.map((f) => {
      if (Array.isArray(f)) return f;
      if (typeof f === "object" && f !== null) {
        return [f.title || f.name || "Feature", f.description || f.desc || ""];
      }
      return [String(f), ""];
    });
  }

  return {
    ...p,
    category: categoryStr,
    features: normalizedFeatures || [],
    industries: Array.isArray(p.industries) ? p.industries : [],
    plans: Array.isArray(p.plans) && p.plans.length > 0
      ? p.plans.map((pl) => {
        const monthly = Number(pl.monthlyPriceUsd ?? pl.monthly_price_usd ?? pl.price ?? 49);
        const annual = Number(pl.annualPriceUsd ?? pl.annual_price_usd ?? pl.annual ?? Math.round(monthly * 0.8));
        return {
          ...pl,
          id: pl.id || pl.slug || `plan-${monthly}`,
          name: pl.name || "Standard",
          for: pl.for || pl.description || "For modern organizations",
          price: monthly,
          monthlyPriceUsd: monthly,
          monthly_price_usd: monthly,
          annual: annual,
          annualPriceUsd: annual,
          annual_price_usd: annual,
          highlight: Boolean(pl.isHighlighted || pl.highlighted),
          highlighted: Boolean(pl.isHighlighted || pl.highlighted),
          features: Array.isArray(pl.features) ? pl.features : [],
        };
      })
      : [],
  };
}

// Normalize blog post data shape
export function normalizeBlogPost(p) {
  if (!p) return p;
  const cat = p.category || p.cat || "Engineering";
  const author = p.author || p.authorName || "DEZORYN Engineering Team";
  const summary = p.summary || p.excerpt || "";
  const image = p.image || p.coverImage || null;
  const read = p.read || (p.readTimeMinutes ? `${p.readTimeMinutes} min` : "5 min");
  const date =
    p.date ||
    (p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "Recent");

  return {
    ...p,
    cat,
    category: cat,
    author,
    authorName: author,
    summary,
    excerpt: summary,
    image,
    coverImage: image,
    read,
    readTimeMinutes: p.readTimeMinutes || 5,
    date,
    publishedAt: p.publishedAt || date,
    content: p.content || "",
  };
}

// Normalize legal policy data shape
export function normalizeLegalPolicy(p) {
  if (!p) return p;
  const clauses = p.clauses || p.sections || [];
  return {
    ...p,
    sections: Array.isArray(clauses) ? clauses : [],
    clauses: Array.isArray(clauses) ? clauses : [],
    updated: p.lastReviewedDate || (p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Recent"),
  };
}

// Normalize project data shape
export function normalizeProject(p) {
  if (!p) return p;
  const tech = Array.isArray(p.tech)
    ? p.tech
    : Array.isArray(p.techStack)
      ? p.techStack
      : [];
  return {
    ...p,
    tech,
    techStack: tech,
    result: p.result || p.shortDescription || p.fullDescription || "",
    type: p.type || p.category || "Enterprise",
    industry: p.industry || "Enterprise SaaS",
    hue: p.hue || 220,
    image: p.image || p.featuredImage || null,
  };
}

// Submit public contact inquiry or job application
export async function submitContactInquiry(payload) {
  return post("/api/v1/contact", payload);
}

// Submit demo request
export async function submitDemoRequest(payload) {
  return post("/api/v1/demo", payload);
}

// Subscribe email address to newsletter
export async function subscribeNewsletter(email, source = "website_footer") {
  return post("/api/v1/newsletter/subscribe", { email, source });
}

// Fetch all live products with instant static fallback
export async function getLiveProducts(params = {}) {
  try {
    const res = await get("/api/v1/products", params);
    const list = res?.data || res?.products || (Array.isArray(res) ? res : null);
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeProduct);
    }
  } catch (_) { }
  return products.map(normalizeProduct);
}

// Fetch product specifications by slug with instant static fallback
export async function getLiveProductBySlug(slug) {
  try {
    const res = await get(`/api/v1/products/${slug}`);
    const prod = res?.data || res?.product || res;
    if (prod && (prod.slug || prod.name)) {
      return normalizeProduct(prod);
    }
  } catch (_) { }
  const fallback = getProduct(slug);
  return fallback ? normalizeProduct(fallback) : null;
}

// Fetch product categories with counts
export async function getLiveProductCategories() {
  try {
    const res = await get("/api/v1/products/categories");
    if (Array.isArray(res) && res.length > 0) return res;
  } catch (_) { }
  return CATEGORIES.map((c) => ({
    name: c,
    slug: c.toLowerCase().replace(/\s+/g, "-"),
    count: products.filter((p) => p.category === c).length,
  }));
}

// Fetch feature comparison matrix across products
export async function getLiveComparisonMatrix() {
  try {
    return await get("/api/v1/products/compare");
  } catch (_) {
    return null;
  }
}

// Fetch enterprise solution blueprints with static fallback
export async function getLiveSolutions() {
  try {
    const res = await get("/api/v1/solutions");
    if (Array.isArray(res) && res.length > 0) return res;
    if (Array.isArray(res?.data) && res.data.length > 0) return res.data;
  } catch (_) { }
  return enterpriseSections.map((s) => ({
    ...s,
    slug: s.slug || s.title?.toLowerCase().replace(/\s+/g, "-"),
    description: s.desc || s.description || "",
  }));
}

// Fetch solution blueprint by slug with static fallback
export async function getLiveSolutionBySlug(slug) {
  try {
    const res = await get(`/api/v1/solutions/${slug}`);
    const item = res?.data || res;
    if (item && (item.slug || item.title)) return item;
  } catch (_) { }
  const found = enterpriseSections.find(
    (s) => s.slug === slug || s.title?.toLowerCase().replace(/\s+/g, "-") === slug
  );
  return found || null;
}

// Fetch all supported industry verticals with static fallback
export async function getLiveIndustries() {
  try {
    const res = await get("/api/v1/industries");
    if (Array.isArray(res) && res.length > 0) return res;
    if (Array.isArray(res?.data) && res.data.length > 0) return res.data;
  } catch (_) { }
  return industries;
}

// Fetch industry vertical specifications by slug with static fallback
export async function getLiveIndustryBySlug(slug) {
  try {
    const res = await get(`/api/v1/industries/${slug}`);
    const item = res?.data || res;
    if (item && (item.slug || item.name)) return item;
  } catch (_) { }
  return getIndustry(slug) || null;
}

// Fetch customer implementation projects with static fallback
export async function getLiveProjects() {
  try {
    const res = await get("/api/v1/projects");
    const list = Array.isArray(res) ? res : res?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeProject);
    }
  } catch (_) { }
  return projects.map(normalizeProject);
}

// Fetch project implementation details by slug with static fallback
export async function getLiveProjectBySlug(slug) {
  try {
    const res = await get(`/api/v1/projects/${slug}`);
    const item = res?.data || res;
    if (item && (item.slug || item.name)) return normalizeProject(item);
  } catch (_) { }
  const found = projects.find((p) => p.slug === slug);
  return found ? normalizeProject(found) : null;
}

// Fetch published customer case studies with static fallback
export async function getLiveCaseStudies() {
  try {
    const res = await get("/api/v1/case-studies");
    const list = res?.caseStudies || (Array.isArray(res) ? res : res?.data || null);
    if (Array.isArray(list) && list.length > 0) return list;
  } catch (_) { }
  return projects.map(normalizeProject);
}

// Fetch in-depth case study report by slug with static fallback
export async function getLiveCaseStudyBySlug(slug) {
  try {
    const res = await get(`/api/v1/case-studies/${slug}`);
    const item = res?.data || res;
    if (item && (item.slug || item.title || item.name)) return item;
  } catch (_) { }
  const found = projects.find((p) => p.slug === slug);
  return found ? normalizeProject(found) : null;
}

// Fetch published blog posts and articles with static fallback
export async function getLiveBlogPosts(params = {}) {
  try {
    const res = await get("/api/v1/content/blog", params);
    const list = res?.items || res?.posts || (Array.isArray(res) ? res : null);
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeBlogPost);
    }
  } catch (_) { }
  return posts.map(normalizeBlogPost);
}

// Fetch single blog post content by slug with static fallback
export async function getLiveBlogPostBySlug(slug) {
  try {
    const res = await get(`/api/v1/content/blog/${slug}`);
    if (res && (res.slug || res.title)) {
      return normalizeBlogPost(res);
    }
  } catch (_) { }
  const fallback = getPost(slug);
  return fallback ? normalizeBlogPost(fallback) : null;
}

// Fetch frequently asked questions by category
export async function getLiveFaqs(params = {}) {
  try {
    return await get("/api/v1/content/faqs", params);
  } catch (_) {
    return { faqs: [] };
  }
}

// Fetch active job openings
export async function getLiveCareers() {
  try {
    const res = await get("/api/v1/content/careers");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
  } catch (_) { }
  return [];
}

// Fetch partner program tracks
export async function getLivePartners() {
  try {
    return await get("/api/v1/content/partners");
  } catch (_) {
    return [];
  }
}

// Fetch research whitepapers and benchmark reports
export async function getLiveWhitepapers() {
  try {
    return await get("/api/v1/content/insights");
  } catch (_) {
    try {
      return await get("/api/v1/content/whitepapers");
    } catch {
      return [];
    }
  }
}

// Fetch engineering runbooks and documentation
export async function getLiveRunbooks() {
  try {
    return await get("/api/v1/content/docs");
  } catch (_) {
    try {
      return await get("/api/v1/content/runbooks");
    } catch {
      return [];
    }
  }
}

// Fetch public REST API references
export async function getLiveApiResources() {
  try {
    return await get("/api/v1/content/api-reference");
  } catch (_) {
    try {
      return await get("/api/v1/content/api-resources");
    } catch {
      return [];
    }
  }
}

// Fetch platform pricing plans and billing cycles
export async function getLivePricingPlans() {
  try {
    return await get("/api/v1/pricing");
  } catch (_) {
    return null;
  }
}

// Fetch corporate company profile
export async function getLiveCompanyProfile() {
  try {
    const res = await get("/api/v1/company");
    if (res && typeof res === "object") return res;
  } catch (_) { }
  return {
    name: "DEZORYN TECHNOLOGY PRIVATE LIMITED",
    tagline: "Software Products, Enterprise Platforms & Digital Solutions",
    headquarters: "Bengaluru, Karnataka, India",
    email: "contact@dezoryn.com",
    phone: "+91 80 4123 4567",
  };
}

// Fetch public website settings
export async function getLiveSiteSettings() {
  try {
    return await get("/api/v1/settings/public");
  } catch (_) {
    return null;
  }
}

// Fetch all published legal policies
export async function getLiveLegalPolicies() {
  try {
    const res = await get("/api/v1/legal");
    const list = Array.isArray(res) ? res : res?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeLegalPolicy);
    }
  } catch (_) { }
  return [];
}

// Fetch legal policy clauses by slug
export async function getLiveLegalPolicy(slug) {
  try {
    const res = await get(`/api/v1/legal/${slug}`);
    if (res) return normalizeLegalPolicy(res);
  } catch (_) { }
  return null;
}

// Fetch navigation menus and link trees
export async function getLiveNavigation() {
  try {
    return await get("/api/v1/navigation");
  } catch (_) {
    return null;
  }
}

// Fetch all published CMS pages
export async function getLivePages() {
  try {
    const res = await get("/api/v1/pages");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
  } catch (_) { }
  return [];
}

// Fetch published CMS page by slug
export async function getLivePage(slug) {
  try {
    const res = await get(`/api/v1/pages/${slug}`);
    if (res && (res.slug || res.title || res.sections)) return res;
  } catch (_) { }
  return null;
}

// Submit enterprise sales inquiry
export async function submitSalesInquiry(payload) {
  return post("/api/v1/sales-inquiries", payload);
}

// Unsubscribe email address from newsletter
export async function unsubscribeNewsletter(email) {
  return post("/api/v1/newsletter/unsubscribe", { email });
}

// Fetch public media library assets
export async function getLiveMediaAssets() {
  try {
    return await get("/api/v1/media");
  } catch (_) {
    return [];
  }
}

// Search published SaaS products
export async function searchLiveProducts(query) {
  return getLiveProducts({ search: query });
}

// Check backend service health and database probe
export async function checkBackendHealth() {
  return get("/api/v1/health");
}

export default apiClient;
