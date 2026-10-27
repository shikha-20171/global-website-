import {
  LayoutDashboard,
  BarChart3,
  LayoutTemplate,
  FileText,
  Navigation,
  Scale,
  Building2,
  Box,
  Layers,
  Factory,
  BookOpenCheck,
  Users,
  Calendar,
  DollarSign,
  Newspaper,
  HelpCircle,
  Briefcase,
  Handshake,
  Settings,
  Shield,
} from "lucide-react";

/**
 * Comprehensive Navigation for DEZORYN TECHNOLOGY Super Admin Panel.
 * Gives Super Admins complete control to manage every single page, feature,
 * catalog entry, commercial lead, content asset, and policy on the global website.
 */
export const ADMIN_NAV_GROUPS = [
  {
    group: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Web Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "GLOBAL WEBSITE BUILDER",
    items: [
      {
        label: "Homepage & Hero",
        href: "/admin/website/homepage",
        icon: LayoutTemplate,
      },
      {
        label: "All Website Pages",
        href: "/admin/website/pages",
        icon: FileText,
        badge: "30",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        label: "Menus & Navigation",
        href: "/admin/website/navigation",
        icon: Navigation,
      },
      {
        label: "Legal & Compliance",
        href: "/admin/website/legal",
        icon: Scale,
        badge: "6",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        label: "Company & Brand",
        href: "/admin/website/company",
        icon: Building2,
      },
    ],
  },
  {
    group: "CATALOG & ARCHITECTURE",
    items: [
      {
        label: "SaaS Products",
        href: "/admin/products",
        icon: Box,
        badge: "18",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      },
      {
        label: "Solutions Architecture",
        href: "/admin/solutions",
        icon: Layers,
        badge: "7",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        label: "Industry Verticals",
        href: "/admin/industries",
        icon: Factory,
        badge: "10",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        label: "Case Studies",
        href: "/admin/case-studies",
        icon: BookOpenCheck,
      },
    ],
  },
  {
    group: "LEADS & SALES PIPELINE",
    items: [
      {
        label: "Contact Inquiries",
        href: "/admin/leads",
        icon: Users,
        badge: "28",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      },
      {
        label: "Demo Bookings",
        href: "/admin/demos",
        icon: Calendar,
        badge: "9",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      },
      {
        label: "Pricing Plans",
        href: "/admin/pricing",
        icon: DollarSign,
      },
    ],
  },
  {
    group: "CONTENT & RESOURCES",
    items: [
      {
        label: "Blog & Articles",
        href: "/admin/resources/blog",
        icon: Newspaper,
        badge: "8",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        label: "FAQs Knowledge Base",
        href: "/admin/resources/faqs",
        icon: HelpCircle,
      },
      {
        label: "Careers & Jobs",
        href: "/admin/careers",
        icon: Briefcase,
      },
      {
        label: "Partners & Affiliates",
        href: "/admin/partners",
        icon: Handshake,
      },
    ],
  },
  {
    group: "SYSTEM & GOVERNANCE",
    items: [
      {
        label: "Website Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];
