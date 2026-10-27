import { SITE_URL } from "@/lib/seo";
import { products, industries, posts, projects } from "@/lib/data";

export default async function sitemap() {
  const now = new Date().toISOString();

  // 1. Core static and marketing pages
  const staticRoutes = [
    { url: "", changeFrequency: "daily", priority: 1.0 },
    { url: "/products", changeFrequency: "weekly", priority: 0.9 },
    { url: "/marketplace", changeFrequency: "weekly", priority: 0.9 },
    { url: "/solutions", changeFrequency: "weekly", priority: 0.9 },
    { url: "/industries", changeFrequency: "weekly", priority: 0.9 },
    { url: "/case-studies", changeFrequency: "weekly", priority: 0.85 },
    { url: "/portfolio", changeFrequency: "weekly", priority: 0.85 },
    { url: "/pricing", changeFrequency: "weekly", priority: 0.85 },
    { url: "/compare", changeFrequency: "monthly", priority: 0.8 },
    { url: "/company", changeFrequency: "monthly", priority: 0.8 },
    { url: "/mission", changeFrequency: "monthly", priority: 0.7 },
    { url: "/careers", changeFrequency: "weekly", priority: 0.8 },
    { url: "/partners", changeFrequency: "weekly", priority: 0.8 },
    { url: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { url: "/contact-sales", changeFrequency: "monthly", priority: 0.8 },
    { url: "/demo", changeFrequency: "monthly", priority: 0.8 },
    { url: "/blog", changeFrequency: "daily", priority: 0.85 },
    { url: "/resources", changeFrequency: "weekly", priority: 0.8 },
    { url: "/resources/api", changeFrequency: "weekly", priority: 0.8 },
    { url: "/resources/docs", changeFrequency: "monthly", priority: 0.75 },
    { url: "/resources/guides", changeFrequency: "monthly", priority: 0.75 },
    { url: "/resources/insights", changeFrequency: "monthly", priority: 0.75 },
    { url: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { url: "/legal/privacy", changeFrequency: "yearly", priority: 0.5 },
    { url: "/legal/terms", changeFrequency: "yearly", priority: 0.5 },
    { url: "/legal/cookies", changeFrequency: "yearly", priority: 0.5 },
    { url: "/legal/security", changeFrequency: "yearly", priority: 0.5 },
    { url: "/legal/refund", changeFrequency: "yearly", priority: 0.5 },
    { url: "/legal/acceptable-use", changeFrequency: "yearly", priority: 0.5 },
  ].map((route) => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Dynamic SaaS Product Pages
  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Dynamic Solutions Pages
  const solutionSlugs = [
    "enterprise",
    "ai",
    "automation",
    "custom-software",
    "digital-transformation",
    "cloud",
    "mobile",
  ];
  const solutionRoutes = solutionSlugs.map((slug) => ({
    url: `${SITE_URL}/solutions/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 4. Dynamic Industry Vertical Pages
  const industryRoutes = industries.map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 5. Dynamic Customer Success Case Studies
  const caseStudyRoutes = projects.map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 6. Dynamic Project Portfolio Specification Pages
  const projectSpecRoutes = projects.map((pr) => ({
    url: `${SITE_URL}/projects/${pr.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 7. Dynamic Marketplace Category Pages
  const categoriesList = [
    "education",
    "healthcare",
    "real-estate",
    "hr",
    "finance",
    "communication",
    "security",
    "operations",
    "business-management",
  ];
  const categoryRoutes = categoriesList.map((slug) => ({
    url: `${SITE_URL}/marketplace/category/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 8. Dynamic Blog Articles
  const blogRoutes = posts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.date || now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...solutionRoutes,
    ...industryRoutes,
    ...caseStudyRoutes,
    ...projectSpecRoutes,
    ...categoryRoutes,
    ...blogRoutes,
  ];
}
