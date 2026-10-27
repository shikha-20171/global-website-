const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Safe native HTTP request helper compatible with Next.js Server & Client components
async function request(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}`;
      try {
        const errData = await res.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch (_) {}
      const err = new Error(errorMsg);
      err.status = res.status;
      throw err;
    }

    const json = await res.json();
    return json?.data !== undefined ? json.data : json;
  } catch (err) {
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

// Fetch all live products
export async function getLiveProducts(params = {}) {
  const res = await get("/api/v1/products", params);
  const list = res?.data || res?.products || (Array.isArray(res) ? res : null);
  if (Array.isArray(list)) {
    return list.map(normalizeProduct);
  }
  return [];
}

// Fetch product specifications by slug
export async function getLiveProductBySlug(slug) {
  const res = await get(`/api/v1/products/${slug}`);
  const prod = res?.data || res?.product || res;
  return normalizeProduct(prod);
}

// Fetch product categories with counts
export async function getLiveProductCategories() {
  return get("/api/v1/products/categories");
}

// Fetch feature comparison matrix across products
export async function getLiveComparisonMatrix() {
  return get("/api/v1/products/compare");
}

// Fetch enterprise solution blueprints
export async function getLiveSolutions() {
  return get("/api/v1/solutions");
}

// Fetch solution blueprint by slug
export async function getLiveSolutionBySlug(slug) {
  return get(`/api/v1/solutions/${slug}`);
}

// Fetch all supported industry verticals
export async function getLiveIndustries() {
  return get("/api/v1/industries");
}

// Fetch industry vertical specifications by slug
export async function getLiveIndustryBySlug(slug) {
  return get(`/api/v1/industries/${slug}`);
}

// Fetch customer implementation projects
export async function getLiveProjects() {
  const res = await get("/api/v1/projects");
  const list = Array.isArray(res) ? res : res?.data || [];
  return Array.isArray(list) ? list.map(normalizeProject) : [];
}

// Fetch project implementation details by slug
export async function getLiveProjectBySlug(slug) {
  const res = await get(`/api/v1/projects/${slug}`);
  const item = res?.data || res;
  return item ? normalizeProject(item) : null;
}

// Fetch published customer case studies
export async function getLiveCaseStudies() {
  return get("/api/v1/case-studies");
}

// Fetch in-depth case study report by slug
export async function getLiveCaseStudyBySlug(slug) {
  return get(`/api/v1/case-studies/${slug}`);
}

// Fetch published blog posts and articles
export async function getLiveBlogPosts(params = {}) {
  const res = await get("/api/v1/content/blog", params);
  const list = res?.items || res?.posts || (Array.isArray(res) ? res : null);
  if (Array.isArray(list)) {
    return list.map(normalizeBlogPost);
  }
  return [];
}

// Fetch single blog post content by slug
export async function getLiveBlogPostBySlug(slug) {
  const res = await get(`/api/v1/content/blog/${slug}`);
  return normalizeBlogPost(res);
}

// Fetch frequently asked questions by category
export async function getLiveFaqs(params = {}) {
  return get("/api/v1/content/faqs", params);
}

// Fetch active job openings
export async function getLiveCareers() {
  return get("/api/v1/content/careers");
}

// Fetch partner program tracks
export async function getLivePartners() {
  return get("/api/v1/content/partners");
}

// Fetch research whitepapers and benchmark reports
export async function getLiveWhitepapers() {
  try {
    return await get("/api/v1/content/insights");
  } catch {
    return get("/api/v1/content/whitepapers");
  }
}

// Fetch engineering runbooks and documentation
export async function getLiveRunbooks() {
  try {
    return await get("/api/v1/content/docs");
  } catch {
    return get("/api/v1/content/runbooks");
  }
}

// Fetch public REST API references
export async function getLiveApiResources() {
  try {
    return await get("/api/v1/content/api-reference");
  } catch {
    return get("/api/v1/content/api-resources");
  }
}

// Fetch platform pricing plans and billing cycles
export async function getLivePricingPlans() {
  return get("/api/v1/pricing");
}

// Fetch corporate company profile
export async function getLiveCompanyProfile() {
  return get("/api/v1/company");
}

// Fetch public website settings
export async function getLiveSiteSettings() {
  return get("/api/v1/settings/public");
}

// Fetch all published legal policies
export async function getLiveLegalPolicies() {
  const res = await get("/api/v1/legal");
  const list = Array.isArray(res) ? res : res?.data || [];
  return Array.isArray(list) ? list.map(normalizeLegalPolicy) : [];
}

// Fetch legal policy clauses by slug
export async function getLiveLegalPolicy(slug) {
  const res = await get(`/api/v1/legal/${slug}`);
  return normalizeLegalPolicy(res);
}

// Fetch navigation menus and link trees
export async function getLiveNavigation() {
  return get("/api/v1/navigation");
}

// Fetch all published CMS pages
export async function getLivePages() {
  return get("/api/v1/pages");
}

// Fetch published CMS page by slug
export async function getLivePage(slug) {
  return get(`/api/v1/pages/${slug}`);
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
  return get("/api/v1/media");
}

// Search published SaaS products
export async function searchLiveProducts(query) {
  return get("/api/v1/products", { search: query });
}

// Check backend service health and database probe
export async function checkBackendHealth() {
  return get("/health");
}

export default apiClient;

