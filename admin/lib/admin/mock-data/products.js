import { products, CATEGORIES } from "@/lib/data";

export const MOCK_PRODUCT_CATEGORIES = CATEGORIES.map((c, i) => ({
  id: c.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: c,
  slug: c.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  description: `Enterprise grade ${c.toLowerCase()} SaaS solutions engineered for global scale and reliability.`,
  displayOrder: i + 1,
  productCount: products.filter((p) => p.category === c).length,
  featured: i < 4,
  status: "Published",
}));

export const MOCK_COMPARISON_ATTRIBUTES = [
  { id: "attr_multi_tenant", name: "Isolated Multi-Tenant DB", category: "Architecture", type: "boolean" },
  { id: "attr_rbac", name: "Fine-Grained RBAC & Auditing", category: "Security", type: "boolean" },
  { id: "attr_sla", name: "Availability SLA Guarantee", category: "Operations", type: "text", defaultValue: "99.95% High Availability" },
  { id: "attr_api", name: "High-Throughput REST & Webhook APIs", category: "Integration", type: "boolean" },
  { id: "attr_backup", name: "Continuous Snapshot & Disaster Recovery", category: "Data", type: "text", defaultValue: "15-min RPO / 1-hr RTO" },
  { id: "attr_sso", name: "SAML 2.0 & OIDC Single Sign-On", category: "Security", type: "boolean" },
  { id: "attr_compliance", name: "SOC 2 Type II / HIPAA Readiness", category: "Compliance", type: "text", defaultValue: "Enterprise Vault Protected" },
];

export const MOCK_PRODUCTS_DATA = products.map((p) => ({
  ...p,
  status: p.unlisted ? "Draft" : "Published",
  featured: ["schooly-core", "dezo-care", "real-estate", "society-management"].includes(p.slug),
  lastUpdated: "Oct 14, 2026",
  startingPriceUsd: p.plans?.[0]?.monthly_price_usd || 29,
}));
