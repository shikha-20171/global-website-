"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminDashboardMetrics, getAdminInsights } from "@/lib/api";

export default function AdminResourcesHubPage() {
  const [counts, setCounts] = useState({
    blog: 0,
    faqs: 0,
    insights: 0,
  });

  useEffect(() => {
    Promise.allSettled([
      getAdminDashboardMetrics(),
      getAdminInsights(),
    ]).then(([dashRes, insRes]) => {
      let blog = 0;
      let faqs = 0;
      let insights = 0;

      if (dashRes.status === "fulfilled" && dashRes.value) {
        blog = dashRes.value.resources?.blogPosts || 0;
        faqs = dashRes.value.resources?.faqs || 0;
      }
      if (insRes.status === "fulfilled") {
        const insList = insRes.value?.data || (Array.isArray(insRes.value) ? insRes.value : []);
        insights = insList.length;
      }
      setCounts({ blog, faqs, insights });
    });
  }, []);

  const resourceModules = [
    {
      title: "Blog & Articles",
      desc: "Create and edit corporate news, technical write-ups, product updates, and SEO articles published on /blog.",
      href: "/admin/resources/blog",
      icon: Newspaper,
      badge: "Articles",
      count: `${counts.blog} Published Articles`,
    },
    {
      title: "FAQs Knowledge Base",
      desc: "Manage frequently asked questions and detailed answers displayed across website products and /faq.",
      href: "/admin/resources/faqs",
      icon: HelpCircle,
      badge: "FAQs",
      count: `${counts.faqs} Active FAQs`,
    },
    {
      title: "Executive Insights & Whitepapers",
      desc: "Publish and update technical research whitepapers, architecture reports, and industry benchmarks on /resources.",
      href: "/admin/resources/insights",
      icon: Lightbulb,
      badge: "Research",
      count: `${counts.insights} Published Whitepapers`,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resources & Content Hub"
        description="Centralized administration for all content assets on DEZORYN: blog posts, knowledge base FAQs, and executive whitepapers."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Resources Hub" },
        ]}
        actions={
          <a
            href="http://localhost:3000/resources"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            <span>Preview Public /resources</span>
          </a>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl">
        {resourceModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition font-exo">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span className="text-slate-500 font-mono font-normal">{mod.count}</span>
                <span className="flex items-center gap-1">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
