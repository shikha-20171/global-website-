/**
 * Dashboard KPIs and Executive metrics (Development demonstration data).
 * Structured to be easily swapped for REST/GraphQL API response.
 */
export const MOCK_DASHBOARD_METRICS = [
  { id: "products", label: "Published Products", value: "18", change: "+2 this month", trend: "up", subtext: "100% catalog active" },
  { id: "pages", label: "Total Website Pages", value: "34", change: "123 static routes", trend: "neutral", subtext: "Zero broken links" },
  { id: "articles", label: "Published Articles", value: "14", change: "+3 this week", trend: "up", subtext: "Zero-Trust & FinOps" },
  { id: "pricing", label: "Active Pricing Plans", value: "12", change: "USD Base currency", trend: "neutral", subtext: "Starter to Enterprise" },
  { id: "leads", label: "New Leads", value: "28", change: "+14.2% vs last week", trend: "up", subtext: "7 requiring response" },
  { id: "demos", label: "Pending Demo Requests", value: "9", change: "3 scheduled today", trend: "up", subtext: "Avg. lead time 4h" },
  { id: "drafts", label: "Draft Content", value: "4", change: "2 awaiting review", trend: "neutral", subtext: "Articles & case studies" },
  { id: "conversions", label: "Recent Conversions", value: "3.8%", change: "+0.6% vs avg", trend: "up", subtext: "High-intent inquiries" },
];

export const MOCK_TOP_LANDING_PAGES = [
  { route: "/", title: "Global Homepage", views: "48,290", convRate: "4.2%" },
  { route: "/products/schooly-core", title: "Schooly Core ERP", views: "14,830", convRate: "5.8%" },
  { route: "/marketplace", title: "SaaS Marketplace", views: "12,400", convRate: "3.1%" },
  { route: "/pricing", title: "Transparent Pricing", views: "9,640", convRate: "6.4%" },
  { route: "/industries/healthcare", title: "Healthcare Cloud ERP", views: "6,920", convRate: "4.9%" },
];

export const MOCK_MOST_VIEWED_PRODUCTS = [
  { slug: "schooly-core", name: "Schooly Core Campus ERP", views: 18450, growth: "+24%" },
  { slug: "dezo-care", name: "Dezo Care Hospital Operations", views: 15210, growth: "+18%" },
  { slug: "real-estate", name: "Real Estate Property Platform", views: 11980, growth: "+15%" },
  { slug: "hrms", name: "HRMS Enterprise Workforce Platform", views: 9430, growth: "+9%" },
];

export const MOCK_HEALTH_CHECKLIST = [
  { id: "ssg", label: "Static Site Generation", status: "Optimal", detail: "All production pages prerendered" },
  { id: "seo", label: "Meta Descriptions & OpenGraph", status: "Optimal", detail: "100% pages configured" },
  { id: "sitemap", label: "Sitemap.xml Auto-Build", status: "Optimal", detail: "Synchronized on publish" },
  { id: "robots", label: "Robots Shield Policy", status: "Protected", detail: "Admin paths blocked from crawling" },
  { id: "security", label: "Zero-Trust RBAC Simulation", status: "Active", detail: "Admin boundaries enforced" },
];
