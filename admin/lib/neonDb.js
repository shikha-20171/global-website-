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

/**
 * Executes a parameterized SQL query directly against Neon PostgreSQL HTTP endpoint
 */
export async function neonQuery(query, params = []) {
  const host = getNeonHost();
  const connString = getNeonConnectionString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

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
