"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutTemplate,
  FileText,
  Navigation,
  ArrowRight,
  ExternalLink,
  Scale,
  Building2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminPages, getAdminSections } from "@/lib/api";

export default function AdminWebsiteHubPage() {
  const [pagesCount, setPagesCount] = useState(0);
  const [sectionsCount, setSectionsCount] = useState(0);

  useEffect(() => {
    getAdminPages()
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.pages || [];
        setPagesCount(items.length);
      })
      .catch(() => {});

    getAdminSections()
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.sections || [];
        setSectionsCount(items.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Content Management"
        description="Full control plane for DEZORYN global website: 11-section homepage builder, 30+ core pages, header mega-menus, legal compliance disclosures, and corporate brand narrative."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Website CMS" },
        ]}
        actions={
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            <span>View Public Website</span>
          </a>
        }
      />

      {/* Main CMS Sections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition group">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition font-exo">
              Homepage Builder
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configure all 11 homepage sections including Hero, Trust Metrics,
              Featured SaaS, Enterprise Solutions, AI Engine, and CTAs with live
              reordering and visibility toggles.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {sectionsCount || 11} Modular Sections
            </span>
            <Link
              href="/admin/website/homepage"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              Open Builder <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition group">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition font-exo">
              All Website Pages
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage static and dynamic pages across About, Mission, Contact,
              Sales, Solutions, Careers, and search metadata for all site routes.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {pagesCount} Pages Configured
            </span>
            <Link
              href="/admin/website/pages"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage Pages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition group">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Navigation className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition font-exo">
              Menus & Navigation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customize header mega-menu navigation links, dropdown actions,
              6-column global footer layout, social links, and primary CTA targets.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Header & Footer Menus
            </span>
            <Link
              href="/admin/website/navigation"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              Edit Menus <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition group">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition font-exo">
              Legal & Compliance Policies
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Edit the 6 legal policies: Privacy Policy, Terms of Service, Security
              Architecture, SLA Refund Policy, and Cookie Policy with revision tracking.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              6 Policies / GDPR &amp; SOC2
            </span>
            <Link
              href="/admin/website/legal"
              className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
            >
              Manage Legal <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition group">
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition font-exo">
              Company & Brand Profile
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage corporate Mission, Vision, Values, Executive Leadership roster,
              and corporate headquarters coordinates (Bhopal, India).
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Mission, Leaders &amp; Headquarters
            </span>
            <Link
              href="/admin/website/company"
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline"
            >
              Edit Profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
