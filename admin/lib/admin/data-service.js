import { MOCK_DASHBOARD_METRICS, MOCK_TOP_LANDING_PAGES, MOCK_MOST_VIEWED_PRODUCTS, MOCK_HEALTH_CHECKLIST } from "./mock-data/dashboard";
import { MOCK_PRODUCTS_DATA, MOCK_PRODUCT_CATEGORIES, MOCK_COMPARISON_ATTRIBUTES } from "./mock-data/products";
import { MOCK_PRICING_PLANS } from "./mock-data/pricing";
import { MOCK_WEBSITE_PAGES } from "./mock-data/pages";
import { MOCK_HOMEPAGE_SECTIONS, MOCK_NAVIGATION_STRUCTURE } from "./mock-data/website";
import { MOCK_LEADS_DATA } from "./mock-data/leads";
import { MOCK_DEMOS_DATA } from "./mock-data/demos";
import { MOCK_BLOG_ARTICLES, MOCK_INSIGHTS_DATA, MOCK_GUIDES_DATA, MOCK_FAQS_DATA } from "./mock-data/content";
import { MOCK_MEDIA_ASSETS } from "./mock-data/media";
import { MOCK_ANALYTICS_OVERVIEW, MOCK_TRAFFIC_TREND, MOCK_DEVICE_BREAKDOWN, MOCK_GEO_BREAKDOWN } from "./mock-data/analytics";
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ROLES_LIST, MOCK_PERMISSION_MODULES } from "./mock-data/users";
import { MOCK_AUDIT_LOGS } from "./mock-data/audit-logs";
import { MOCK_CAREERS_DATA, MOCK_PARTNERS_DATA } from "./mock-data/careers-partners";
import { industries } from "@/lib/data";
import { caseStudiesDetails } from "@/lib/caseStudiesData";

// Named exports for convenient direct imports
export const getDashboardMetrics = () => MOCK_DASHBOARD_METRICS;
export const getTopLandingPages = () => MOCK_TOP_LANDING_PAGES;
export const getMostViewedProducts = () => MOCK_MOST_VIEWED_PRODUCTS;
export const getHealthChecklist = () => MOCK_HEALTH_CHECKLIST;

export const getProducts = () => MOCK_PRODUCTS_DATA;
export const getProductCategories = () => MOCK_PRODUCT_CATEGORIES;
export const getComparisonAttributes = () => MOCK_COMPARISON_ATTRIBUTES;

export const getPricingPlans = () => MOCK_PRICING_PLANS;

export const getWebsitePages = () => MOCK_WEBSITE_PAGES;
export const getHomepageSections = () => MOCK_HOMEPAGE_SECTIONS;
export const getNavigationStructure = () => MOCK_NAVIGATION_STRUCTURE;

export const getIndustries = () => industries;
export const getCaseStudies = () => Object.values(caseStudiesDetails);

export const getCareers = () => MOCK_CAREERS_DATA;
export const getPartners = () => MOCK_PARTNERS_DATA;

export const getLeads = () => MOCK_LEADS_DATA;
export const getDemos = () => MOCK_DEMOS_DATA;

export const getBlogArticles = () => MOCK_BLOG_ARTICLES;
export const getInsights = () => MOCK_INSIGHTS_DATA;
export const getGuides = () => MOCK_GUIDES_DATA;
export const getFaqs = () => MOCK_FAQS_DATA;

export const getMediaAssets = () => MOCK_MEDIA_ASSETS;
export const getAnalyticsOverview = () => MOCK_ANALYTICS_OVERVIEW;
export const getTrafficTrend = () => MOCK_TRAFFIC_TREND;
export const getDeviceBreakdown = () => MOCK_DEVICE_BREAKDOWN;
export const getGeoBreakdown = () => MOCK_GEO_BREAKDOWN;

export const getAdminUsers = () => MOCK_ADMIN_USERS;
export const getAdminRoles = () => MOCK_ADMIN_ROLES_LIST;
export const getPermissionModules = () => MOCK_PERMISSION_MODULES;
export const getAuditLogs = () => MOCK_AUDIT_LOGS;

/**
 * Centralized data-access layer for DEZORYN TECHNOLOGY Admin Panel.
 * All UI pages consume this service instead of hardcoding data or touching local files.
 * When real APIs are connected, only this service needs to be replaced.
 */
export const DataService = {
  // Dashboard
  getDashboardMetrics,
  getTopLandingPages,
  getMostViewedProducts,
  getHealthChecklist,

  // Products & Marketplace
  getProducts,
  getProductCategories,
  getComparisonAttributes,

  // Pricing
  getPricingPlans,

  // Website CMS
  getWebsitePages,
  getHomepageSections,
  getNavigationStructure,

  // Solutions & Industries
  getIndustries,
  getCaseStudies,

  // Careers & Partners
  getCareers,
  getPartners,

  // Leads & Demos
  getLeads,
  getDemos,

  // Content & Resources
  getBlogArticles,
  getInsights,
  getGuides,
  getFaqs,

  // Media, SEO & Analytics
  getMediaAssets,
  getAnalyticsOverview,
  getTrafficTrend,
  getDeviceBreakdown,
  getGeoBreakdown,

  // Admin Users & Logs
  getAdminUsers,
  getAdminRoles,
  getPermissionModules,
  getAuditLogs,
};

export * from "../api";
export default DataService;
