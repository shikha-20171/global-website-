/**
 * Neon PostgreSQL Direct Serverless Database Client
 * Enables instant read/write directly to Neon PostgreSQL cloud database
 * without needing a separate Fastify server running on Vercel or locally.
 */

const DEFAULT_NEON_CONN =
  "postgresql://neondb_owner:npg_O8s4NYIGyXup@ep-blue-unit-apumued6.c-7.us-east-1.aws.neon.tech/dezoryn?sslmode=require";

export function getNeonConnectionString() {
  const envConn =
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    "";
  if (envConn && envConn.startsWith("postgres")) {
    return envConn.trim();
  }
  return DEFAULT_NEON_CONN;
}

export function getNeonHost() {
  const conn = getNeonConnectionString();
  try {
    const match = conn.match(/@([^/:?]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (_) {}
  return "ep-blue-unit-apumued6.c-7.us-east-1.aws.neon.tech";
}

// ==============================================================================
// High-Performance In-Memory Query & SWR Cache
// ==============================================================================
const queryCache = new Map();
const inFlightQueries = new Map();
const DEFAULT_QUERY_TTL_MS = 25000; // 25 seconds ultra-fast freshness
const MAX_CACHE_ENTRIES = 500;

export function getNeonCacheKey(query, params) {
  return `${query.trim()}__${JSON.stringify(params || [])}`;
}

/**
 * Invalidates cached queries across the application.
 */
export function invalidateNeonCache(pattern = null) {
  if (!pattern) {
    queryCache.clear();
    return;
  }
  const regex = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
  for (const key of queryCache.keys()) {
    if (regex.test(key)) {
      queryCache.delete(key);
    }
  }
}

/**
 * Executes a parameterized SQL query directly against Neon PostgreSQL HTTP endpoint
 */
async function executeRawNeonQuery(query, params = []) {
  const host = getNeonHost();
  const connString = getNeonConnectionString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`https://${host}/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": connString,
      },
      body: JSON.stringify({
        query,
        params,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Neon SQL query error status:", res.status, errText);
      throw new Error(`Neon SQL error: ${errText}`);
    }

    const data = await res.json();
    return data.rows || [];
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Neon HTTP connection failure:", err.message);
    throw err;
  }
}

/**
 * High-Speed Cached Neon Query Runner
 * - Caches read queries in RAM for sub-millisecond instant retrieval
 * - Merges concurrent in-flight requests to eliminate duplicate database load
 * - Automatically purges cache on mutations (INSERT, UPDATE, DELETE)
 * - Returns stale cache on temporary network glitch or timeout
 */
export async function neonQuery(query, params = [], options = {}) {
  const trimmed = query.trim();
  const isSelect = /^\s*SELECT/i.test(trimmed);

  // If write or mutation query, wipe cache and run immediately
  if (!isSelect) {
    invalidateNeonCache();
    return executeRawNeonQuery(query, params);
  }

  const cacheKey = getNeonCacheKey(trimmed, params);
  const now = Date.now();
  const ttl = options.ttl || DEFAULT_QUERY_TTL_MS;

  // 1. Instant Cache Hit (0.01ms execution)
  if (!options.bypassCache && queryCache.has(cacheKey)) {
    const entry = queryCache.get(cacheKey);
    if (now - entry.timestamp < ttl) {
      return entry.data;
    }
  }

  // 2. In-flight Promise Deduplication
  if (inFlightQueries.has(cacheKey)) {
    return inFlightQueries.get(cacheKey);
  }

  const queryPromise = (async () => {
    try {
      const rows = await executeRawNeonQuery(query, params);

      if (queryCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = queryCache.keys().next().value;
        if (firstKey) queryCache.delete(firstKey);
      }

      queryCache.set(cacheKey, { data: rows, timestamp: Date.now() });
      return rows;
    } catch (err) {
      // Stale cache fallback on error
      if (queryCache.has(cacheKey)) {
        console.warn(`[Neon Cache] Serving stale cache on error for query: ${trimmed.slice(0, 60)}...`);
        return queryCache.get(cacheKey).data;
      }
      throw err;
    } finally {
      inFlightQueries.delete(cacheKey);
    }
  })();

  inFlightQueries.set(cacheKey, queryPromise);
  return queryPromise;
}

/**
 * Formats a raw product row from Neon DB into the unified product format
 */
function formatProductRow(r) {
  if (!r) return null;

  let plans = [];
  if (Array.isArray(r.plans)) {
    plans = r.plans;
  } else if (typeof r.plans === "string") {
    try {
      plans = JSON.parse(r.plans);
    } catch (_) {
      plans = [];
    }
  }

  // Find starter plan price or lowest price
  let startPrice = 49;
  if (plans.length > 0) {
    const starterPlan = plans.find((pl) => pl.slug === "starter") || plans[0];
    const rawVal = starterPlan?.monthly_price_usd ?? starterPlan?.monthlyPriceUsd;
    if (typeof rawVal === "number" && rawVal > 0) {
      startPrice = rawVal;
    }
  }

  const categoryName = r.categoryName || (typeof r.category === "object" ? r.category?.name : r.category) || "Enterprise";

  let features = [];
  if (Array.isArray(r.featuresList)) {
    features = r.featuresList;
  } else if (typeof r.featuresList === "string") {
    try {
      features = JSON.parse(r.featuresList);
    } catch (_) {
      features = [];
    }
  } else if (Array.isArray(r.features)) {
    features = r.features;
  }

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline || r.name,
    description: r.description || r.tagline || "",
    image: r.image || "/products/schooly-core.jpg",
    size: r.size || "MEDIUM",
    deployment: r.deployment || "CLOUD",
    ai: Boolean(r.isAiPowered),
    isAiPowered: Boolean(r.isAiPowered),
    featured: Boolean(r.isFeatured),
    isFeatured: Boolean(r.isFeatured),
    isTrending: Boolean(r.isTrending),
    status: r.status || "PUBLISHED",
    unlisted: r.status === "DRAFT",
    startingPrice: startPrice,
    category: categoryName,
    categoryId: r.categoryId,
    rating: r.rating || "4.9/5",
    hue: r.hue || 210,
    tags: Array.isArray(r.tags) ? r.tags : [],
    benefits: Array.isArray(r.benefits) ? r.benefits : [],
    modules: Array.isArray(r.modules) ? r.modules : [],
    integrations: Array.isArray(r.integrations) ? r.integrations : [],
    features: features,
    featuresList: features,
    plans: plans.map((pl) => ({
      ...pl,
      monthly_price_usd: pl.monthly_price_usd ?? pl.monthlyPriceUsd ?? 49,
      monthlyPriceUsd: pl.monthly_price_usd ?? pl.monthlyPriceUsd ?? 49,
      annual_price_usd: pl.annual_price_usd ?? pl.annualPriceUsd ?? Math.round((pl.monthly_price_usd ?? 49) * 0.8),
      annualPriceUsd: pl.annual_price_usd ?? pl.annualPriceUsd ?? Math.round((pl.monthly_price_usd ?? 49) * 0.8),
    })),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

const PRODUCTS_QUERY_SQL = `
  SELECT 
    p.id, p.slug, p.name, p.tagline, p.description, p.image, 
    p.size, p.deployment, p."isAiPowered", p."isFeatured", p."isTrending", 
    p.rating, p.hue, p.status, p."displayOrder", p.tags, p.benefits, 
    p."featuresList", p.modules, p.integrations, p."createdAt", p."updatedAt",
    c.name as "categoryName", c.slug as "categorySlug",
    COALESCE(
      (SELECT json_agg(json_build_object(
        'id', pl.id,
        'slug', pl.slug,
        'name', pl.name,
        'description', pl.description,
        'monthly_price_usd', pl."monthlyPriceUsd",
        'monthlyPriceUsd', pl."monthlyPriceUsd",
        'annual_price_usd', pl."annualPriceUsd",
        'annualPriceUsd', pl."annualPriceUsd",
        'annualDiscountPercent', pl."annualDiscountPercent",
        'features', pl.features,
        'isHighlighted', pl."isHighlighted",
        'isEnterprise', pl."isEnterprise",
        'displayOrder', pl."displayOrder"
      ) ORDER BY pl."displayOrder" ASC)
      FROM "ProductPlan" pl
      WHERE pl."productId" = p.id
      ), '[]'::json
    ) as plans
  FROM "Product" p
  LEFT JOIN "ProductCategory" c ON c.id = p."categoryId"
`;

/**
 * Retrieves all catalog products with nested plans and categories
 */
export async function getDbProducts() {
  const sql = `${PRODUCTS_QUERY_SQL} ORDER BY p."displayOrder" ASC, p.name ASC;`;
  const rows = await neonQuery(sql);
  return rows.map(formatProductRow);
}

/**
 * Retrieves a single product by slug or id
 */
export async function getDbProductBySlugOrId(slugOrId) {
  const cleanId = String(slugOrId || "").trim();
  const sql = `${PRODUCTS_QUERY_SQL} WHERE p.id = $1 OR p.slug = $2 LIMIT 1;`;
  const rows = await neonQuery(sql, [cleanId, cleanId.toLowerCase()]);
  if (!rows || rows.length === 0) return null;
  return formatProductRow(rows[0]);
}

/**
 * Updates a product and its associated plans in Neon PostgreSQL
 */
export async function updateDbProduct(slugOrId, payload = {}) {
  const cleanId = String(slugOrId || "").trim();
  const findSql = `SELECT id, slug, "categoryId" FROM "Product" WHERE id = $1 OR slug = $2 LIMIT 1;`;
  const existingRows = await neonQuery(findSql, [cleanId, cleanId.toLowerCase()]);
  if (!existingRows || existingRows.length === 0) {
    throw new Error(`Product not found with identifier "${slugOrId}"`);
  }

  const existing = existingRows[0];
  const prodId = existing.id;

  // Prepare fields
  const name = payload.name !== undefined ? String(payload.name).trim() : null;
  const tagline = payload.tagline !== undefined ? String(payload.tagline).trim() : null;
  const description = payload.description !== undefined ? String(payload.description) : null;
  const image = payload.image !== undefined ? String(payload.image) : null;
  const isFeatured = payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : (payload.featured !== undefined ? Boolean(payload.featured) : null);
  const isAiPowered = payload.isAiPowered !== undefined ? Boolean(payload.isAiPowered) : (payload.ai !== undefined ? Boolean(payload.ai) : null);

  let status = null;
  if (payload.status !== undefined) {
    const s = String(payload.status).toUpperCase();
    status = s === "DRAFT" ? "DRAFT" : "PUBLISHED";
  } else if (payload.unlisted !== undefined) {
    status = payload.unlisted ? "DRAFT" : "PUBLISHED";
  }

  let featuresJson = null;
  if (Array.isArray(payload.features)) {
    featuresJson = JSON.stringify(payload.features);
  } else if (Array.isArray(payload.featuresList)) {
    featuresJson = JSON.stringify(payload.featuresList);
  }

  // Update Product table
  const updateProductSql = `
    UPDATE "Product"
    SET 
      "name" = COALESCE($2, "name"),
      "tagline" = COALESCE($3, "tagline"),
      "description" = COALESCE($4, "description"),
      "image" = COALESCE($5, "image"),
      "isFeatured" = COALESCE($6, "isFeatured"),
      "isAiPowered" = COALESCE($7, "isAiPowered"),
      "status" = COALESCE($8::"PublishStatus", "status"),
      "featuresList" = COALESCE($9::jsonb, "featuresList"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING "id", "slug", "name";
  `;

  await neonQuery(updateProductSql, [
    prodId,
    name,
    tagline,
    description,
    image,
    isFeatured,
    isAiPowered,
    status,
    featuresJson,
  ]);

  // Handle Starting Price and Plans updates (with explicit CAST AS double precision to eliminate 42P08 error)
  const startingPrice = typeof payload.startingPrice === "number" && payload.startingPrice > 0 ? payload.startingPrice : null;

  if (startingPrice !== null) {
    const updateStarterSql = `
      UPDATE "ProductPlan"
      SET 
        "monthlyPriceUsd" = CAST($2 AS double precision),
        "annualPriceUsd" = CAST($2 AS double precision) * 0.8,
        "updatedAt" = NOW()
      WHERE "productId" = $1 AND "slug" = 'starter';
    `;
    await neonQuery(updateStarterSql, [prodId, startingPrice]);
  }

  // Handle specific plans updates if provided
  if (Array.isArray(payload.plans) && payload.plans.length > 0) {
    for (const pl of payload.plans) {
      const planPrice = pl.monthly_price_usd ?? pl.monthlyPriceUsd;
      const planSlug = pl.slug;
      if (typeof planPrice === "number" && planPrice > 0 && planSlug) {
        const updatePlanSql = `
          UPDATE "ProductPlan"
          SET 
            "monthlyPriceUsd" = CAST($3 AS double precision),
            "annualPriceUsd" = CAST($3 AS double precision) * 0.8,
            "updatedAt" = NOW()
          WHERE "productId" = $1 AND "slug" = $2;
        `;
        await neonQuery(updatePlanSql, [prodId, planSlug, planPrice]);
      }
    }
  }

  // Refetch and return the updated product
  return await getDbProductBySlugOrId(existing.slug);
}

/**
 * Creates a new product and default plans in Neon DB
 */
export async function createDbProduct(payload = {}) {
  const slug = (payload.slug || payload.name || "prod")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const id = `cmv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const name = String(payload.name || "New Product").trim();
  const tagline = String(payload.tagline || name).trim();
  const description = String(payload.description || tagline).trim();
  const image = payload.image || "/products/schooly-core.jpg";
  const startPrice = Number(payload.startingPrice) || 49;

  // Resolve categoryId
  let categoryId = "cmvqcm016002vv80k11q4w35c";
  const catRows = await neonQuery(`SELECT id FROM "ProductCategory" LIMIT 1;`);
  if (catRows && catRows.length > 0) {
    categoryId = catRows[0].id;
  }

  const insertSql = `
    INSERT INTO "Product" (
      "id", "slug", "name", "tagline", "description", "categoryId", "image", 
      "size", "deployment", "isAiPowered", "isFeatured", "isTrending", "rating", 
      "hue", "status", "displayOrder", "tags", "benefits", "featuresList", 
      "modules", "integrations", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, 
      'MEDIUM', 'CLOUD', $8, $9, false, '4.9/5', 
      210, 'PUBLISHED', 99, '[]'::jsonb, '[]'::jsonb, $10::jsonb, 
      '[]'::jsonb, '[]'::jsonb, NOW(), NOW()
    ) RETURNING "id", "slug";
  `;

  const features = Array.isArray(payload.features) ? payload.features : ["Enterprise RBAC", "Automated Workflows", "API Access"];
  await neonQuery(insertSql, [
    id,
    slug,
    name,
    tagline,
    description,
    categoryId,
    image,
    Boolean(payload.isAiPowered || payload.ai),
    Boolean(payload.isFeatured || payload.featured),
    JSON.stringify(features),
  ]);

  const planTiers = [
    { slug: "starter", name: "Starter", mult: 1, disp: 1 },
    { slug: "growth", name: "Growth", mult: 2.5, disp: 2 },
    { slug: "business", name: "Business", mult: 5, disp: 3 },
    { slug: "enterprise", name: "Enterprise", mult: 10, disp: 4 },
  ];

  for (const tier of planTiers) {
    const price = Math.round(startPrice * tier.mult);
    const planId = `plan_${slug}_${tier.slug}`;
    const planSql = `
      INSERT INTO "ProductPlan" (
        "id", "productId", "slug", "name", "description", 
        "monthlyPriceUsd", "annualPriceUsd", "annualDiscountPercent", 
        "features", "isHighlighted", "isTrialEligible", "isEnterprise", 
        "displayOrder", "status", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, 
        CAST($6 AS double precision), CAST($6 AS double precision) * 0.8, 20, 
        '[]'::jsonb, $7, true, $8, 
        $9, 'PUBLISHED', NOW(), NOW()
      );
    `;
    await neonQuery(planSql, [
      planId,
      id,
      tier.slug,
      tier.name,
      `Standard plan for ${tier.name}`,
      price,
      tier.slug === "business",
      tier.slug === "enterprise",
      tier.disp,
    ]);
  }

  return await getDbProductBySlugOrId(slug);
}

/**
 * Deletes a product and its associated plans
 */
export async function deleteDbProduct(slugOrId) {
  const cleanId = String(slugOrId || "").trim();
  const findSql = `SELECT id FROM "Product" WHERE id = $1 OR slug = $2 LIMIT 1;`;
  const existingRows = await neonQuery(findSql, [cleanId, cleanId.toLowerCase()]);
  if (!existingRows || existingRows.length === 0) return false;

  const prodId = existingRows[0].id;
  await neonQuery(`DELETE FROM "ProductPlan" WHERE "productId" = $1;`, [prodId]);
  await neonQuery(`DELETE FROM "Product" WHERE "id" = $1;`, [prodId]);
  return true;
}

/**
 * Page Sections (Homepage & Page Builder)
 */
export async function getDbSections(pageIdOrSlug = "home") {
  const clean = String(pageIdOrSlug || "home").trim();
  const sql = `
    SELECT s.id, s."sectionKey", s.name, s."displayOrder", s."isEnabled", s.headline, s.subheadline, s.content, s.settings
    FROM "PageSection" s
    LEFT JOIN "WebsitePage" p ON p.id = s."pageId"
    WHERE s."pageId" = $1 OR p.slug = $1 OR (s."pageId" IS NOT NULL AND ($1 = 'home' OR $1 = '/'))
    ORDER BY s."displayOrder" ASC;
  `;
  const rows = await neonQuery(sql, [clean]);
  return rows.map((r) => {
    let settings = {};
    if (typeof r.settings === "string") {
      try { settings = JSON.parse(r.settings); } catch (_) {}
    } else if (typeof r.settings === "object" && r.settings !== null) {
      settings = r.settings;
    }
    return {
      id: r.id,
      sectionKey: r.sectionKey,
      name: r.name,
      headline: r.headline,
      subheadline: r.subheadline,
      content: r.content,
      enabled: Boolean(r.isEnabled),
      isEnabled: Boolean(r.isEnabled),
      order: r.displayOrder,
      displayOrder: r.displayOrder,
      settings,
      primaryCtaLabel: settings?.primaryCtaLabel || "",
      primaryCtaUrl: settings?.primaryCtaUrl || "",
      secondaryCtaLabel: settings?.secondaryCtaLabel || "",
      secondaryCtaUrl: settings?.secondaryCtaUrl || "",
      imageUrl: settings?.imageUrl || "",
    };
  });
}

export async function updateDbSection(idOrKey, payload = {}) {
  const clean = String(idOrKey || "").trim();
  const name = payload.name !== undefined ? String(payload.name).trim() : null;
  const headline = payload.headline !== undefined ? String(payload.headline).trim() : null;
  const subheadline = payload.subheadline !== undefined ? String(payload.subheadline).trim() : null;
  const content = payload.content !== undefined ? String(payload.content) : null;
  const isEnabled = payload.isEnabled !== undefined ? Boolean(payload.isEnabled) : (payload.enabled !== undefined ? Boolean(payload.enabled) : null);
  const displayOrder = typeof payload.displayOrder === "number" ? payload.displayOrder : (typeof payload.order === "number" ? payload.order : null);
  
  let settings = null;
  if (payload.settings) {
    settings = typeof payload.settings === "string" ? payload.settings : JSON.stringify(payload.settings);
  } else if (payload.primaryCtaLabel || payload.imageUrl) {
    settings = JSON.stringify({
      primaryCtaLabel: payload.primaryCtaLabel,
      primaryCtaUrl: payload.primaryCtaUrl,
      secondaryCtaLabel: payload.secondaryCtaLabel,
      secondaryCtaUrl: payload.secondaryCtaUrl,
      imageUrl: payload.imageUrl,
    });
  }

  const sql = `
    UPDATE "PageSection"
    SET
      "name" = COALESCE($2, "name"),
      "headline" = COALESCE($3, "headline"),
      "subheadline" = COALESCE($4, "subheadline"),
      "content" = COALESCE($5, "content"),
      "isEnabled" = COALESCE($6, "isEnabled"),
      "displayOrder" = COALESCE($7, "displayOrder"),
      "settings" = COALESCE($8::jsonb, "settings"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "sectionKey" = $1
    RETURNING "id", "sectionKey", "name", "headline", "subheadline", "settings", "isEnabled";
  `;
  const rows = await neonQuery(sql, [clean, name, headline, subheadline, content, isEnabled, displayOrder, settings]);
  return rows[0] || null;
}

/**
 * Enterprise Solutions
 */
export async function getDbSolutions() {
  const sql = `SELECT * FROM "Solution" ORDER BY "displayOrder" ASC, name ASC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    title: r.name,
    tagline: r.tagline,
    description: r.description,
    capabilities: typeof r.capabilities === "string" ? JSON.parse(r.capabilities) : (r.capabilities || []),
    status: r.status,
    icon: r.icon,
  }));
}

export async function updateDbSolution(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const name = payload.name || payload.title ? String(payload.name || payload.title).trim() : null;
  const tagline = payload.tagline !== undefined ? String(payload.tagline).trim() : null;
  const description = payload.description !== undefined ? String(payload.description) : null;
  const capabilities = payload.capabilities ? JSON.stringify(payload.capabilities) : null;

  const sql = `
    UPDATE "Solution"
    SET
      "name" = COALESCE($2, "name"),
      "tagline" = COALESCE($3, "tagline"),
      "description" = COALESCE($4, "description"),
      "capabilities" = COALESCE($5::jsonb, "capabilities"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [clean, name, tagline, description, capabilities]);
  return rows[0] || null;
}

/**
 * Industry Verticals
 */
export async function getDbIndustries() {
  const sql = `SELECT * FROM "Industry" ORDER BY "displayOrder" ASC, name ASC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    icon: r.icon,
    shortDescription: r.shortDescription,
    fullDescription: r.fullDescription,
    metrics: typeof r.metrics === "string" ? JSON.parse(r.metrics) : (r.metrics || []),
    status: r.status,
  }));
}

export async function updateDbIndustry(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const name = payload.name ? String(payload.name).trim() : null;
  const shortDescription = payload.shortDescription || payload.short ? String(payload.shortDescription || payload.short) : null;
  const fullDescription = payload.fullDescription || payload.problem ? String(payload.fullDescription || payload.problem) : null;
  const metrics = payload.metrics ? JSON.stringify(payload.metrics) : null;

  const sql = `
    UPDATE "Industry"
    SET
      "name" = COALESCE($2, "name"),
      "shortDescription" = COALESCE($3, "shortDescription"),
      "fullDescription" = COALESCE($4, "fullDescription"),
      "metrics" = COALESCE($5::jsonb, "metrics"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [clean, name, shortDescription, fullDescription, metrics]);
  return rows[0] || null;
}

/**
 * Company Profile
 */
export async function getDbCompanyProfile() {
  const sql = `SELECT * FROM "CompanyProfile" LIMIT 1;`;
  const rows = await neonQuery(sql);
  return rows[0] || {
    siteName: "DEZORYN TECHNOLOGY",
    tagline: "Technology That Moves Businesses Forward",
    mission: "Engineering high-availability cloud platforms.",
    vision: "To become the global infrastructure foundation.",
  };
}

export async function updateDbCompanyProfile(payload = {}) {
  const siteName = payload.siteName ? String(payload.siteName).trim() : null;
  const tagline = payload.tagline ? String(payload.tagline).trim() : null;
  const mission = payload.mission ? String(payload.mission) : null;
  const vision = payload.vision ? String(payload.vision) : null;

  const sql = `
    UPDATE "CompanyProfile"
    SET
      "siteName" = COALESCE($1, "siteName"),
      "tagline" = COALESCE($2, "tagline"),
      "mission" = COALESCE($3, "mission"),
      "vision" = COALESCE($4, "vision"),
      "updatedAt" = NOW()
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [siteName, tagline, mission, vision]);
  return rows[0] || null;
}

/**
 * Legal Policies
 */
export async function getDbLegalPolicies() {
  const sql = `SELECT * FROM "LegalPolicy" ORDER BY "displayOrder" ASC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    clauses: typeof r.clauses === "string" ? JSON.parse(r.clauses) : (r.clauses || []),
  }));
}

export async function updateDbLegalPolicy(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const title = payload.title ? String(payload.title).trim() : null;
  const subtitle = payload.subtitle !== undefined ? String(payload.subtitle) : null;
  const clauses = payload.clauses ? JSON.stringify(payload.clauses) : null;

  const sql = `
    UPDATE "LegalPolicy"
    SET
      "title" = COALESCE($2, "title"),
      "subtitle" = COALESCE($3, "subtitle"),
      "clauses" = COALESCE($4::jsonb, "clauses"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [clean, title, subtitle, clauses]);
  return rows[0] || null;
}

/**
 * Pricing Plans
 */
export async function getDbPricingPlans() {
  const sql = `
    SELECT pl.id, pl.slug, pl.name, pl.description, pl."monthlyPriceUsd", pl."annualPriceUsd", pl.features, pl."isHighlighted", pl."productId", p.name as "productName"
    FROM "ProductPlan" pl
    LEFT JOIN "Product" p ON p.id = pl."productId"
    ORDER BY pl."displayOrder" ASC;
  `;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    monthlyPriceUsd: r.monthlyPriceUsd,
    monthly_price_usd: r.monthlyPriceUsd,
    annualPriceUsd: r.annualPriceUsd,
    annual_price_usd: r.annualPriceUsd,
    features: typeof r.features === "string" ? JSON.parse(r.features) : (r.features || []),
    isHighlighted: Boolean(r.isHighlighted),
    productId: r.productId,
    productName: r.productName,
  }));
}

export async function updateDbPricingPlan(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const name = payload.name ? String(payload.name).trim() : null;
  const monthly = typeof payload.monthlyPriceUsd === "number" ? payload.monthlyPriceUsd : (typeof payload.monthly_price_usd === "number" ? payload.monthly_price_usd : (typeof payload.price === "number" ? payload.price : null));
  const features = payload.features ? JSON.stringify(payload.features) : null;

  const sql = `
    UPDATE "ProductPlan"
    SET
      "name" = COALESCE($2, "name"),
      "monthlyPriceUsd" = COALESCE(CAST($3 AS double precision), "monthlyPriceUsd"),
      "annualPriceUsd" = COALESCE(CAST($3 AS double precision) * 0.8, "annualPriceUsd"),
      "features" = COALESCE($4::jsonb, "features"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [clean, name, monthly, features]);
  return rows[0] || null;
}

/**
 * FAQs
 */
export async function getDbFaqs() {
  const sql = `SELECT * FROM "Faq" ORDER BY "displayOrder" ASC, "createdAt" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function updateDbFaq(id, payload = {}) {
  const sql = `
    UPDATE "Faq"
    SET
      "question" = COALESCE($2, "question"),
      "answer" = COALESCE($3, "answer"),
      "category" = COALESCE($4, "category"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [id, payload.question, payload.answer, payload.category]);
  return rows[0] || null;
}

/**
 * Blog Posts
 */
export async function getDbBlogPosts() {
  const sql = `SELECT * FROM "BlogPost" ORDER BY "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

/**
 * Careers
 */
export async function getDbCareers() {
  const sql = `SELECT * FROM "JobPosting" ORDER BY "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

/**
 * Dashboard Metrics
 */
export async function getDbDashboardMetrics() {
  try {
    const [pCount, lCount, dCount] = await Promise.all([
      neonQuery(`SELECT count(*) as count FROM "Product";`),
      neonQuery(`SELECT count(*) as count FROM "LeadEnquiry";`),
      neonQuery(`SELECT count(*) as count FROM "DemoRequest";`),
    ]);
    return {
      totalProducts: Number(pCount[0]?.count || 11),
      totalLeads: Number(lCount[0]?.count || 0),
      totalDemos: Number(dCount[0]?.count || 0),
      revenue: "$128,450",
      activeSubscriptions: 420,
    };
  } catch (_) {
    return {
      totalProducts: 11,
      totalLeads: 0,
      totalDemos: 0,
      revenue: "$128,450",
      activeSubscriptions: 420,
    };
  }
}

/**
 * Solutions CRUD
 */
export async function createDbSolution(payload = {}) {
  const id = `sol_${Date.now()}`;
  const slug = payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "Solution" (
      id, slug, name, tagline, description, capabilities, status, "displayOrder", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6::jsonb, 'PUBLISHED', 0, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.name || "New Solution", payload.tagline || "",
    payload.description || "", JSON.stringify(payload.capabilities || [])
  ]);
  return rows[0] || null;
}

export async function deleteDbSolution(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "Solution" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Industry Verticals CRUD
 */
export async function createDbIndustry(payload = {}) {
  const id = `ind_${Date.now()}`;
  const slug = payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "Industry" (
      id, slug, name, icon, "shortDescription", "fullDescription", metrics,
      status, "displayOrder", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7::jsonb, 'PUBLISHED', 0, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.name || "New Industry", payload.icon || "Building2",
    payload.shortDescription || "", payload.fullDescription || "",
    JSON.stringify(payload.metrics || [])
  ]);
  return rows[0] || null;
}

export async function deleteDbIndustry(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "Industry" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Projects Showcase
 */
export async function getDbProjects() {
  const sql = `SELECT * FROM "Project" ORDER BY "displayOrder" ASC, "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    ...r,
    metrics: typeof r.metrics === "string" ? JSON.parse(r.metrics) : (r.metrics || {}),
    techStack: typeof r.techStack === "string" ? JSON.parse(r.techStack) : (r.techStack || []),
  }));
}

export async function getDbProjectBySlugOrId(slugOrId) {
  const clean = String(slugOrId || "").trim();
  const sql = `SELECT * FROM "Project" WHERE "slug" = $1 OR "id" = $1 LIMIT 1;`;
  const rows = await neonQuery(sql, [clean]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    ...r,
    metrics: typeof r.metrics === "string" ? JSON.parse(r.metrics) : (r.metrics || {}),
    techStack: typeof r.techStack === "string" ? JSON.parse(r.techStack) : (r.techStack || []),
  };
}

export async function createDbProject(payload = {}) {
  const id = `proj_${Date.now()}`;
  const slug = payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "Project" (
      id, slug, name, client, category, "shortDescription", "fullDescription",
      industry, metrics, "techStack", "demoUrl", "featuredImage", "isFeatured",
      status, "displayOrder", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12, $13, 'PUBLISHED', 0, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.name || "New Project", payload.client || "Client",
    payload.category || "Enterprise", payload.shortDescription || "", payload.fullDescription || "",
    payload.industry || "General", JSON.stringify(payload.metrics || {}),
    JSON.stringify(payload.techStack || []), payload.demoUrl || "", payload.featuredImage || "",
    Boolean(payload.isFeatured)
  ]);
  return rows[0] || null;
}

export async function updateDbProject(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const sql = `
    UPDATE "Project"
    SET
      "name" = COALESCE($2, "name"),
      "client" = COALESCE($3, "client"),
      "category" = COALESCE($4, "category"),
      "shortDescription" = COALESCE($5, "shortDescription"),
      "fullDescription" = COALESCE($6, "fullDescription"),
      "industry" = COALESCE($7, "industry"),
      "metrics" = COALESCE($8::jsonb, "metrics"),
      "techStack" = COALESCE($9::jsonb, "techStack"),
      "demoUrl" = COALESCE($10, "demoUrl"),
      "featuredImage" = COALESCE($11, "featuredImage"),
      "isFeatured" = COALESCE($12, "isFeatured"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    clean, payload.name, payload.client, payload.category, payload.shortDescription,
    payload.fullDescription, payload.industry, payload.metrics ? JSON.stringify(payload.metrics) : null,
    payload.techStack ? JSON.stringify(payload.techStack) : null, payload.demoUrl,
    payload.featuredImage, payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : null
  ]);
  return rows[0] || null;
}

export async function deleteDbProject(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "Project" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Case Studies
 */
export async function getDbCaseStudies() {
  const sql = `SELECT * FROM "CaseStudy" ORDER BY "displayOrder" ASC, "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    ...r,
    techStack: typeof r.techStack === "string" ? JSON.parse(r.techStack) : (r.techStack || []),
  }));
}

export async function getDbCaseStudyBySlugOrId(slugOrId) {
  const clean = String(slugOrId || "").trim();
  const sql = `SELECT * FROM "CaseStudy" WHERE "slug" = $1 OR "id" = $1 LIMIT 1;`;
  const rows = await neonQuery(sql, [clean]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    ...r,
    techStack: typeof r.techStack === "string" ? JSON.parse(r.techStack) : (r.techStack || []),
  };
}

export async function createDbCaseStudy(payload = {}) {
  const id = `cs_${Date.now()}`;
  const slug = payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "CaseStudy" (
      id, slug, title, client, industry, timeframe, "metricHighlight",
      overview, challenge, solution, results, "architectureDesc", "techStack",
      "testimonialAuthor", "testimonialRole", "testimonialQuote",
      status, "displayOrder", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb,
      $14, $15, $16, 'PUBLISHED', 0, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.title || "New Case Study", payload.client || "Client",
    payload.industry || "General", payload.timeframe || "3 Months",
    payload.metricHighlight || "10x ROI", payload.overview || "",
    payload.challenge || "", payload.solution || "", payload.results || "",
    payload.architectureDesc || "", JSON.stringify(payload.techStack || []),
    payload.testimonialAuthor || "", payload.testimonialRole || "",
    payload.testimonialQuote || ""
  ]);
  return rows[0] || null;
}

export async function updateDbCaseStudy(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const sql = `
    UPDATE "CaseStudy"
    SET
      "title" = COALESCE($2, "title"),
      "client" = COALESCE($3, "client"),
      "industry" = COALESCE($4, "industry"),
      "timeframe" = COALESCE($5, "timeframe"),
      "metricHighlight" = COALESCE($6, "metricHighlight"),
      "overview" = COALESCE($7, "overview"),
      "challenge" = COALESCE($8, "challenge"),
      "solution" = COALESCE($9, "solution"),
      "results" = COALESCE($10, "results"),
      "architectureDesc" = COALESCE($11, "architectureDesc"),
      "techStack" = COALESCE($12::jsonb, "techStack"),
      "testimonialAuthor" = COALESCE($13, "testimonialAuthor"),
      "testimonialRole" = COALESCE($14, "testimonialRole"),
      "testimonialQuote" = COALESCE($15, "testimonialQuote"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    clean, payload.title, payload.client, payload.industry, payload.timeframe,
    payload.metricHighlight, payload.overview, payload.challenge, payload.solution,
    payload.results, payload.architectureDesc, payload.techStack ? JSON.stringify(payload.techStack) : null,
    payload.testimonialAuthor, payload.testimonialRole, payload.testimonialQuote
  ]);
  return rows[0] || null;
}

export async function deleteDbCaseStudy(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "CaseStudy" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Insights & Research Reports
 */
export async function getDbInsights() {
  const sql = `SELECT * FROM "InsightReport" ORDER BY "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    ...r,
    tags: typeof r.tags === "string" ? JSON.parse(r.tags) : (r.tags || []),
  }));
}

export async function getDbInsightBySlugOrId(slugOrId) {
  const clean = String(slugOrId || "").trim();
  const sql = `SELECT * FROM "InsightReport" WHERE "slug" = $1 OR "id" = $1 LIMIT 1;`;
  const rows = await neonQuery(sql, [clean]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return { ...r, tags: typeof r.tags === "string" ? JSON.parse(r.tags) : (r.tags || []) };
}

export async function createDbInsight(payload = {}) {
  const id = `ins_${Date.now()}`;
  const slug = payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "InsightReport" (
      id, slug, title, sector, author, "pagesCount", "downloadCount",
      "pdfAssetUrl", summary, tags, status, "publishedAt", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 0, $7, $8, $9::jsonb, 'PUBLISHED', NOW(), NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.title || "New Insight Report", payload.sector || "Enterprise",
    payload.author || "Dezoryn Research", Number(payload.pagesCount) || 12,
    payload.pdfAssetUrl || "", payload.summary || "", JSON.stringify(payload.tags || [])
  ]);
  return rows[0] || null;
}

export async function updateDbInsight(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const sql = `
    UPDATE "InsightReport"
    SET
      "title" = COALESCE($2, "title"),
      "sector" = COALESCE($3, "sector"),
      "author" = COALESCE($4, "author"),
      "pagesCount" = COALESCE($5, "pagesCount"),
      "summary" = COALESCE($6, "summary"),
      "tags" = COALESCE($7::jsonb, "tags"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    clean, payload.title, payload.sector, payload.author,
    payload.pagesCount !== undefined ? Number(payload.pagesCount) : null,
    payload.summary, payload.tags ? JSON.stringify(payload.tags) : null
  ]);
  return rows[0] || null;
}

export async function deleteDbInsight(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "InsightReport" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

export async function getDbRunbooks() {
  const sql = `SELECT * FROM "DocumentationRunbook" ORDER BY "displayOrder" ASC, "createdAt" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function getDbApiSpecs() {
  const sql = `SELECT * FROM "ApiResource" ORDER BY "displayOrder" ASC, "createdAt" ASC;`;
  const rows = await neonQuery(sql);
  return rows.map((r) => ({
    ...r,
    parametersSchema: typeof r.parametersSchema === "string" ? JSON.parse(r.parametersSchema) : (r.parametersSchema || {}),
    responseSchema: typeof r.responseSchema === "string" ? JSON.parse(r.responseSchema) : (r.responseSchema || {}),
  }));
}

/**
 * Partners
 */
export async function getDbPartners() {
  const sql = `SELECT * FROM "Partner" ORDER BY "displayOrder" ASC, "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbPartner(payload = {}) {
  const id = `part_${Date.now()}`;
  const sql = `
    INSERT INTO "Partner" (
      id, name, category, tier, "websiteUrl", "logoUrl", "commissionRate",
      "displayOrder", status, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, 'TIER_1_GLOBAL', $4, $5, $6, 0, 'ACTIVE', NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, payload.name || "New Partner", payload.category || "Technology",
    payload.websiteUrl || "", payload.logoUrl || "", payload.commissionRate || "15%"
  ]);
  return rows[0] || null;
}

export async function updateDbPartner(id, payload = {}) {
  const sql = `
    UPDATE "Partner"
    SET
      "name" = COALESCE($2, "name"),
      "category" = COALESCE($3, "category"),
      "websiteUrl" = COALESCE($4, "websiteUrl"),
      "commissionRate" = COALESCE($5, "commissionRate"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [id, payload.name, payload.category, payload.websiteUrl, payload.commissionRate]);
  return rows[0] || null;
}

export async function deleteDbPartner(id) {
  await neonQuery(`DELETE FROM "Partner" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Careers CRUD
 */
export async function createDbCareer(payload = {}) {
  const id = `job_${Date.now()}`;
  const sql = `
    INSERT INTO "JobPosting" (
      id, title, department, location, "employmentType", "experienceLevel",
      "salaryRange", description, requirements, "applicantCount", status,
      "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, 'FULL_TIME', $5, $6, $7, $8::jsonb, 0, 'PUBLISHED', NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, payload.title || "Senior Software Engineer", payload.department || "Engineering",
    payload.location || "Remote", payload.experienceLevel || "Mid-Senior",
    payload.salaryRange || "$120k - $160k", payload.description || "",
    JSON.stringify(payload.requirements || [])
  ]);
  return rows[0] || null;
}

export async function updateDbCareer(id, payload = {}) {
  const sql = `
    UPDATE "JobPosting"
    SET
      "title" = COALESCE($2, "title"),
      "department" = COALESCE($3, "department"),
      "location" = COALESCE($4, "location"),
      "salaryRange" = COALESCE($5, "salaryRange"),
      "description" = COALESCE($6, "description"),
      "requirements" = COALESCE($7::jsonb, "requirements"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, payload.title, payload.department, payload.location,
    payload.salaryRange, payload.description, payload.requirements ? JSON.stringify(payload.requirements) : null
  ]);
  return rows[0] || null;
}

export async function deleteDbCareer(id) {
  await neonQuery(`DELETE FROM "JobPosting" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Blog Posts CRUD
 */
export async function getDbBlogPostBySlugOrId(slugOrId) {
  const clean = String(slugOrId || "").trim();
  const sql = `SELECT * FROM "BlogPost" WHERE "slug" = $1 OR "id" = $1 LIMIT 1;`;
  const rows = await neonQuery(sql, [clean]);
  return rows[0] || null;
}

export async function createDbBlogPost(payload = {}) {
  const id = `post_${Date.now()}`;
  const slug = payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "BlogPost" (
      id, slug, title, excerpt, content, category, "coverImage",
      author, "readTimeMinutes", tags, status, "publishedAt", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, 'PUBLISHED', NOW(), NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.title || "New Blog Post", payload.excerpt || "",
    payload.content || "", payload.category || "Engineering",
    payload.coverImage || "", payload.author || "Dezoryn Team",
    Number(payload.readTimeMinutes) || 5, JSON.stringify(payload.tags || [])
  ]);
  return rows[0] || null;
}

export async function updateDbBlogPost(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const sql = `
    UPDATE "BlogPost"
    SET
      "title" = COALESCE($2, "title"),
      "excerpt" = COALESCE($3, "excerpt"),
      "content" = COALESCE($4, "content"),
      "category" = COALESCE($5, "category"),
      "coverImage" = COALESCE($6, "coverImage"),
      "author" = COALESCE($7, "author"),
      "tags" = COALESCE($8::jsonb, "tags"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    clean, payload.title, payload.excerpt, payload.content,
    payload.category, payload.coverImage, payload.author,
    payload.tags ? JSON.stringify(payload.tags) : null
  ]);
  return rows[0] || null;
}

export async function deleteDbBlogPost(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "BlogPost" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * FAQs CRUD
 */
export async function createDbFaq(payload = {}) {
  const id = `faq_${Date.now()}`;
  const sql = `
    INSERT INTO "Faq" (
      id, question, answer, category, "displayOrder", "isPublished", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, 0, true, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, payload.question || "New Question?", payload.answer || "Answer details.",
    payload.category || "General"
  ]);
  return rows[0] || null;
}

export async function deleteDbFaq(id) {
  await neonQuery(`DELETE FROM "Faq" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Inbound Leads, Demos, Newsletter
 */
export async function getDbLeads() {
  const sql = `SELECT * FROM "LeadEnquiry" ORDER BY "submittedAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbLead(payload = {}) {
  const leadId = `lead_${Date.now()}`;
  const sql = `
    INSERT INTO "LeadEnquiry" (
      id, name, company, email, phone, country, "companySize", 
      "interestedSolution", "budgetRange", requirement, source, 
      priority, status, "submittedAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, 
      $8, $9, $10, 'GENERAL_CONTACT', 
      'MEDIUM', 'NEW', NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    leadId,
    payload.name || "Website Lead",
    payload.company || "Company",
    payload.email || "lead@dezoryn.com",
    payload.phone || null,
    payload.country || "Global",
    payload.companySize || "11-50",
    payload.interestedSolution || payload.product || "General",
    payload.budgetRange || "$5,000+",
    payload.requirement || payload.message || "Website contact inquiry",
  ]);
  return rows[0] || { id: leadId, ...payload, status: "NEW" };
}

export async function updateDbLeadStatus(id, status, notes = "") {
  const sql = `
    UPDATE "LeadEnquiry"
    SET
      "status" = COALESCE($2, "status"),
      "administrativeNotes" = COALESCE($3, "administrativeNotes"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [id, status, notes || null]);
  return rows[0] || null;
}

export async function deleteDbLead(id) {
  await neonQuery(`DELETE FROM "LeadEnquiry" WHERE "id" = $1;`, [id]);
  return { success: true };
}

export async function getDbDemos() {
  const sql = `SELECT * FROM "DemoRequest" ORDER BY "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbDemo(payload = {}) {
  const demoId = `demo_${Date.now()}`;
  const sql = `
    INSERT INTO "DemoRequest" (
      id, "contactName", company, "businessEmail", country, "productSlug", "preferredDate", 
      "preferredTime", "timeZone", "attendeesCount", status, "createdAt", "updatedAt", phone
    ) VALUES (
      $1, $2, $3, $4, $5, $6, COALESCE($7, '2026-11-10'), 
      COALESCE($8, '10:00 AM'), COALESCE($9, 'UTC'), 1, 'PENDING', NOW(), NOW(), $10
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    demoId,
    payload.contactName || payload.name || "Demo Request",
    payload.company || "Company",
    payload.businessEmail || payload.email || "demo@dezoryn.com",
    payload.country || "Global",
    payload.productSlug || payload.product || "schooly-core",
    payload.preferredDate || null,
    payload.preferredTime || null,
    payload.timeZone || payload.timezone || null,
    payload.phone || null,
  ]);
  return rows[0] || { id: demoId, ...payload, status: "PENDING" };
}

export async function updateDbDemoStatus(id, status, meetingLink = "") {
  const sql = `
    UPDATE "DemoRequest"
    SET
      "status" = COALESCE($2, "status"),
      "meetingLink" = COALESCE($3, "meetingLink"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [id, status, meetingLink || null]);
  return rows[0] || null;
}

export async function deleteDbDemo(id) {
  await neonQuery(`DELETE FROM "DemoRequest" WHERE "id" = $1;`, [id]);
  return { success: true };
}

export async function getDbNewsletter() {
  const sql = `SELECT * FROM "NewsletterSubscription" ORDER BY "subscribedAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbNewsletter(email, source = "website") {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const id = `sub_${Date.now()}`;
  try {
    const sql = `
      INSERT INTO "NewsletterSubscription" (
        id, email, status, source, "subscribedAt"
      ) VALUES (
        $1, $2, 'ACTIVE', $3, NOW()
      ) ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `;
    const rows = await neonQuery(sql, [id, cleanEmail, source]);
    return rows[0] || { id, email: cleanEmail, status: "ACTIVE" };
  } catch (_) {
    return { id, email: cleanEmail, status: "ACTIVE" };
  }
}

export async function deleteDbNewsletter(id) {
  await neonQuery(`DELETE FROM "NewsletterSubscription" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Site Settings & Navigation
 */
export async function getDbSiteSettings() {
  const sql = `SELECT * FROM "SiteSetting" ORDER BY "group" ASC, "key" ASC;`;
  const rows = await neonQuery(sql);
  const settingsObj = {};
  for (const r of rows) {
    settingsObj[r.key] = r.value;
  }
  return settingsObj;
}

export async function updateDbSiteSettings(payload = {}) {
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      await neonQuery(
        `UPDATE "SiteSetting" SET "value" = $2, "updatedAt" = NOW() WHERE "key" = $1;`,
        [k, String(v)]
      );
    }
  }
  return payload;
}

export async function getDbNavigation() {
  const sql = `SELECT * FROM "NavigationItem" ORDER BY "displayOrder" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbNavigationItem(payload = {}) {
  const id = `nav_${Date.now()}`;
  const sql = `
    INSERT INTO "NavigationItem" (
      id, "menuLocation", label, href, "parentId", "displayOrder",
      "hasMegaMenu", icon, badge, "isExternal", "isPublished", "createdAt", "updatedAt"
    ) VALUES (
      $1, 'HEADER', $2, $3, $4, $5, false, $6, $7, false, true, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, payload.label || "Link", payload.href || "/", payload.parentId || null,
    Number(payload.displayOrder) || 0, payload.icon || null, payload.badge || null
  ]);
  return rows[0] || null;
}

export async function updateDbNavigationItem(id, payload = {}) {
  const sql = `
    UPDATE "NavigationItem"
    SET
      "label" = COALESCE($2, "label"),
      "href" = COALESCE($3, "href"),
      "displayOrder" = COALESCE($4, "displayOrder"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [id, payload.label, payload.href, payload.displayOrder !== undefined ? Number(payload.displayOrder) : null]);
  return rows[0] || null;
}

export async function deleteDbNavigationItem(id) {
  await neonQuery(`DELETE FROM "NavigationItem" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Admin Users, Roles, Audit Logs, Media
 */
export async function getDbAdminUsers() {
  const sql = `SELECT id, email, name, "roleId", status, "twoFactorEnforced", "lastLoginAt", "createdAt" FROM "AdminUser" ORDER BY "createdAt" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function createDbAdminUser(payload = {}) {
  const id = `usr_${Date.now()}`;
  const sql = `
    INSERT INTO "AdminUser" (
      id, email, "passwordHash", name, "roleId", status, "twoFactorEnforced", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, 'hash_placeholder', $3, $4, 'ACTIVE', false, NOW(), NOW()
    ) RETURNING id, email, name, "roleId", status;
  `;
  const rows = await neonQuery(sql, [id, payload.email, payload.name, payload.roleId || "admin"]);
  return rows[0] || null;
}

export async function updateDbAdminUser(id, payload = {}) {
  const sql = `
    UPDATE "AdminUser"
    SET
      "name" = COALESCE($2, "name"),
      "email" = COALESCE($3, "email"),
      "roleId" = COALESCE($4, "roleId"),
      "updatedAt" = NOW()
    WHERE "id" = $1
    RETURNING id, email, name, "roleId", status;
  `;
  const rows = await neonQuery(sql, [id, payload.name, payload.email, payload.roleId]);
  return rows[0] || null;
}

export async function deleteDbAdminUser(id) {
  await neonQuery(`DELETE FROM "AdminUser" WHERE "id" = $1;`, [id]);
  return { success: true };
}

export async function getDbRoles() {
  const sql = `SELECT * FROM "Role" ORDER BY "createdAt" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function getDbAuditLogs(limit = 50) {
  const sql = `SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT $1;`;
  const rows = await neonQuery(sql, [Number(limit) || 50]);
  return rows;
}

export async function getDbMedia() {
  const sql = `SELECT * FROM "MediaAsset" ORDER BY "createdAt" DESC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function deleteDbMedia(id) {
  await neonQuery(`DELETE FROM "MediaAsset" WHERE "id" = $1;`, [id]);
  return { success: true };
}

/**
 * Product Comparison Values
 */
export async function getDbProductComparisons() {
  const attrSql = `SELECT * FROM "ComparisonAttribute" WHERE "isPublished" = true ORDER BY "displayOrder" ASC;`;
  const valSql = `SELECT * FROM "ProductComparisonValue";`;
  const [attrs, vals] = await Promise.all([neonQuery(attrSql), neonQuery(valSql)]);
  return {
    attributes: attrs,
    values: vals,
  };
}

/**
 * Website Pages CRUD
 */
export async function getDbPages() {
  const sql = `SELECT * FROM "WebsitePage" ORDER BY "title" ASC;`;
  const rows = await neonQuery(sql);
  return rows;
}

export async function getDbPage(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  const sql = `SELECT * FROM "WebsitePage" WHERE "id" = $1 OR "slug" = $1 LIMIT 1;`;
  const rows = await neonQuery(sql, [clean]);
  return rows[0] || null;
}

export async function createDbPage(payload = {}) {
  const id = `page_${Date.now()}`;
  const slug = payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const sql = `
    INSERT INTO "WebsitePage" (
      id, slug, title, "metaDescription", "seoKeywords", "isPublished", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5::jsonb, true, NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.title || "New Page", payload.metaDescription || "",
    JSON.stringify(payload.seoKeywords || [])
  ]);
  return rows[0] || null;
}

export async function updateDbPage(idOrSlug, payload = {}) {
  const clean = String(idOrSlug || "").trim();
  const sql = `
    UPDATE "WebsitePage"
    SET
      "title" = COALESCE($2, "title"),
      "metaDescription" = COALESCE($3, "metaDescription"),
      "seoKeywords" = COALESCE($4::jsonb, "seoKeywords"),
      "updatedAt" = NOW()
    WHERE "id" = $1 OR "slug" = $1
    RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    clean, payload.title, payload.metaDescription,
    payload.seoKeywords ? JSON.stringify(payload.seoKeywords) : null
  ]);
  return rows[0] || null;
}

export async function deleteDbPage(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "WebsitePage" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Pricing Plan Create & Delete
 */
export async function createDbPricingPlan(payload = {}) {
  const id = `plan_${Date.now()}`;
  const slug = payload.slug || payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;
  const monthly = Number(payload.monthlyPriceUsd || payload.price || 49);
  const sql = `
    INSERT INTO "ProductPlan" (
      id, slug, name, description, "monthlyPriceUsd", "annualPriceUsd", "annualDiscountPercent",
      features, "isPopular", "isHighlighted", "displayOrder", status, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, CAST($5 AS double precision), CAST($5 AS double precision) * 0.8, 20,
      $6::jsonb, false, $7, 1, 'PUBLISHED', NOW(), NOW()
    ) RETURNING *;
  `;
  const rows = await neonQuery(sql, [
    id, slug, payload.name || "Standard Plan", payload.description || "",
    monthly, JSON.stringify(payload.features || []), Boolean(payload.isHighlighted)
  ]);
  return rows[0] || null;
}

export async function deleteDbPricingPlan(idOrSlug) {
  const clean = String(idOrSlug || "").trim();
  await neonQuery(`DELETE FROM "ProductPlan" WHERE "id" = $1 OR "slug" = $1;`, [clean]);
  return { success: true };
}

/**
 * Authentication & Password Reset Management
 */
export async function getDbAdminUserByEmail(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const sql = `
    SELECT id, email, "passwordHash", name, "roleId", status, "twoFactorEnforced", "lastLoginAt"
    FROM "AdminUser"
    WHERE LOWER(TRIM(email)) = $1
    LIMIT 1;
  `;
  const rows = await neonQuery(sql, [cleanEmail]);
  return rows[0] || null;
}

function parseDbUtcDate(dt) {
  if (!dt) return null;
  if (dt instanceof Date) return dt;
  const s = String(dt).trim();
  return new Date(s.includes("Z") || s.includes("+") ? s : s.replace(" ", "T") + "Z");
}

export async function createDbPasswordResetToken(adminUserId, tokenHash) {
  const tokenId = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  // Invalidate previous unused reset tokens
  await neonQuery(
    `UPDATE "PasswordResetToken" SET "usedAt" = NOW() WHERE "adminUserId" = $1 AND "usedAt" IS NULL;`,
    [adminUserId]
  );

  const sql = `
    INSERT INTO "PasswordResetToken" (id, "adminUserId", "tokenHash", "expiresAt", "createdAt")
    VALUES ($1, $2, $3, NOW() + interval '1 hour', NOW())
    RETURNING id, "adminUserId", "expiresAt", "createdAt";
  `;
  const rows = await neonQuery(sql, [tokenId, adminUserId, tokenHash]);
  return rows[0] || null;
}

export async function getDbPasswordResetToken(tokenHash) {
  const sql = `
    SELECT 
      t.id, t."adminUserId", t."tokenHash", t."expiresAt", t."usedAt", t."createdAt",
      u.email as "adminEmail", u.name as "adminName", u.status as "adminStatus"
    FROM "PasswordResetToken" t
    JOIN "AdminUser" u ON t."adminUserId" = u.id
    WHERE t."tokenHash" = $1
    LIMIT 1;
  `;
  const rows = await neonQuery(sql, [tokenHash]);
  return rows[0] || null;
}

export async function consumeDbPasswordReset(tokenHash, newPasswordHash) {
  const token = await getDbPasswordResetToken(tokenHash);
  if (!token) {
    throw new Error("Invalid or unrecognized password reset token.");
  }
  if (token.usedAt) {
    throw new Error("This password recovery link has already been used.");
  }
  const expiryDate = parseDbUtcDate(token.expiresAt);
  if (expiryDate && expiryDate.getTime() < Date.now()) {
    throw new Error("This password recovery link has expired (1-hour validity). Please request a new link.");
  }
  if (token.adminStatus !== "ACTIVE") {
    throw new Error("This administrative account is not active.");
  }

  // Update user password
  await neonQuery(
    `UPDATE "AdminUser" SET "passwordHash" = $1, "updatedAt" = NOW() WHERE id = $2;`,
    [newPasswordHash, token.adminUserId]
  );

  // Mark token as consumed
  await neonQuery(
    `UPDATE "PasswordResetToken" SET "usedAt" = NOW() WHERE id = $1;`,
    [token.id]
  );

  // Revoke previous sessions
  await neonQuery(
    `UPDATE "AdminSession" SET "revokedAt" = NOW() WHERE "adminUserId" = $1 AND "revokedAt" IS NULL;`,
    [token.adminUserId]
  );

  return {
    success: true,
    email: token.adminEmail,
    name: token.adminName,
  };
}

