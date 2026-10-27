"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Compass,
  Search,
  Share2,
  Calendar,
  CheckCircle2,
  Mail,
  HelpCircle,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDateRangePicker from "@/components/admin/AdminDateRangePicker";

const TRAFFIC_DAYS = [
  { day: "Mon", count: 3200, height: 60 },
  { day: "Tue", count: 4100, height: 75 },
  { day: "Wed", count: 4800, height: 88 },
  { day: "Thu", count: 5200, height: 95 },
  { day: "Fri", count: 4600, height: 82 },
  { day: "Sat", count: 2400, height: 45 },
  { day: "Sun", count: 2900, height: 52 },
  { day: "Mon", count: 3900, height: 70 },
  { day: "Tue", count: 4900, height: 90 },
  { day: "Wed", count: 5400, height: 100 },
  { day: "Thu", count: 5100, height: 94 },
  { day: "Fri", count: 4400, height: 80 },
];

const TOP_PAGES = [
  {
    name: "Homepage",
    path: "/",
    views: "48,290",
    visitors: "34,120",
    avgTime: "2m 45s",
    tag: "Landing",
  },
  {
    name: "Schooly Core ERP",
    path: "/products/schooly-core",
    views: "14,830",
    visitors: "9,940",
    avgTime: "4m 10s",
    tag: "Product",
  },
  {
    name: "SaaS Marketplace",
    path: "/marketplace",
    views: "12,400",
    visitors: "8,820",
    avgTime: "3m 15s",
    tag: "Catalog",
  },
  {
    name: "Pricing & Plans",
    path: "/pricing",
    views: "9,640",
    visitors: "7,310",
    avgTime: "3m 40s",
    tag: "Commercial",
  },
  {
    name: "Healthcare Industry Solution",
    path: "/industries/healthcare",
    views: "6,920",
    visitors: "4,890",
    avgTime: "3m 55s",
    tag: "Industry",
  },
  {
    name: "Cloud Architecture Blog",
    path: "/resources/blog/agentic-ai-workflow-orchestration",
    views: "5,410",
    visitors: "4,180",
    avgTime: "5m 20s",
    tag: "Article",
  },
];

const TRAFFIC_SOURCES = [
  {
    name: "Google & Search Engines",
    share: 48,
    color: "bg-blue-600",
    visitors: "30,850",
    icon: Search,
  },
  {
    name: "Direct Website URL",
    share: 26,
    color: "bg-emerald-500",
    visitors: "16,710",
    icon: Compass,
  },
  {
    name: "LinkedIn & Social Media",
    share: 16,
    color: "bg-indigo-500",
    visitors: "10,280",
    icon: Share2,
  },
  {
    name: "Partner & Referral Links",
    share: 10,
    color: "bg-amber-500",
    visitors: "6,440",
    icon: ExternalLink,
  },
];

const CONVERSIONS = [
  {
    title: "Demo Requests Submitted",
    count: 142,
    desc: "Prospective clients requesting walkthrough",
    icon: Calendar,
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "Sales Inquiries Sent",
    count: 64,
    desc: "Enterprise contact form inquiries",
    icon: Mail,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Pricing Plans Checked",
    count: 310,
    desc: "Visitors reviewing subscription pricing",
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Newsletter Signups",
    count: 88,
    desc: "New subscribers from footer form",
    icon: Users,
    color: "text-amber-600 bg-amber-50",
  },
];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header with Time Filter */}
      <AdminPageHeader
        title="Website Analytics & Visitors"
        description="Clear overview of how many people visit your website, which products they view, and how they find you."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Analytics" },
        ]}
      >
        <AdminDateRangePicker value={dateRange} onChange={setDateRange} />
      </AdminPageHeader>

      {/* 2. Four Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Visitors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unique Visitors</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            64,280
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Real individuals who visited
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={13} />
            <span>+12.4% vs last period</span>
          </div>
        </div>

        {/* Card 2: Total Pageviews */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Page Views</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Eye size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            97,450
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Total pages loaded by visitors
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={13} />
            <span>+18.2% page engagement</span>
          </div>
        </div>

        {/* Card 3: Avg Time Spent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Time on Website</span>
            <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            3m 12s
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Average reading and browse time
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>High visitor interest</span>
          </div>
        </div>

        {/* Card 4: Customer Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Customer Actions</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            230
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Demos &amp; inquiries submitted
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={13} />
            <span>3.6% conversion rate</span>
          </div>
        </div>
      </div>

      {/* 3. Daily Visitor Activity (Visual Bar Chart) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daily Visitors (Last 12 Days)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hover on each day bar to see exact visitors count
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
            Average: ~4,200 visits/day
          </span>
        </div>

        {/* Clean CSS Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 border-b border-slate-200 pb-2 pt-6">
          {TRAFFIC_DAYS.map((day, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 absolute -top-8 bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                {day.count.toLocaleString()} visits
              </div>

              {/* Visual Bar */}
              <div
                style={{ height: `${day.height}%` }}
                className="w-full max-w-[34px] rounded-t-lg bg-blue-500/80 group-hover:bg-blue-600 transition-all duration-200 shadow-2xs"
              />

              {/* Day Label */}
              <span className="text-[11px] font-semibold text-slate-500 mt-2">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two Side-by-Side Panels: Most Visited Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Visited Pages (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Top Visited Pages
              </h2>
              <p className="text-xs text-slate-500">
                Which parts of your website people are reading the most
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Sorted by Popularity
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {TOP_PAGES.map((page, idx) => (
              <div
                key={page.path}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4 text-center">
                    #{idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {page.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {page.tag}
                      </span>
                    </div>
                    <a
                      href={`http://localhost:3000${page.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-slate-400 hover:text-blue-600 flex items-center gap-1 mt-0.5 truncate"
                    >
                      <span>{page.path}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {page.views}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      views
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-medium text-slate-700">
                      {page.avgTime}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      avg time
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Traffic Sources & Device Share (1 Col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Where Visitors Come From
              </h2>
              <p className="text-xs text-slate-500">
                Channels driving people to your site
              </p>
            </div>

            <div className="space-y-4">
              {TRAFFIC_SOURCES.map((source) => {
                const Icon = source.icon;
                return (
                  <div key={source.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Icon size={13} className="text-slate-400" />
                        <span>{source.name}</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {source.share}%
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${source.share}%` }}
                        className={`h-full rounded-full ${source.color}`}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 text-right">
                      {source.visitors} visits
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Devices Used by Visitors
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Monitor size={18} className="mx-auto text-blue-600 mb-1" />
                <div className="text-sm font-bold text-slate-900">68%</div>
                <div className="text-[11px] text-slate-500">Desktop</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Smartphone size={18} className="mx-auto text-emerald-600 mb-1" />
                <div className="text-sm font-bold text-slate-900">26%</div>
                <div className="text-[11px] text-slate-500">Mobile</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Tablet size={18} className="mx-auto text-violet-600 mb-1" />
                <div className="text-sm font-bold text-slate-900">6%</div>
                <div className="text-[11px] text-slate-500">Tablet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Key Business Actions Taken by Visitors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Customer Actions &amp; Results
          </h2>
          <p className="text-xs text-slate-500">
            Real outcomes from website visitors during this timeframe
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONVERSIONS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-start gap-3.5"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-exo">
                    {c.count}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {c.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
