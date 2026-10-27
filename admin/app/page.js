"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Mail,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  FileText,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { getAdminDashboardMetrics, getAdminLeads, getAdminDemos } from "@/lib/api";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [dashRes, leadsRes, demosRes] = await Promise.allSettled([
          getAdminDashboardMetrics(),
          getAdminLeads({ limit: 4 }),
          getAdminDemos(),
        ]);

        if (!mounted) return;

        if (dashRes.status === "fulfilled" && dashRes.value) {
          setMetrics(dashRes.value);
        }

        if (leadsRes.status === "fulfilled") {
          const items = leadsRes.value?.items || (Array.isArray(leadsRes.value) ? leadsRes.value : []);
          setLeads(items.slice(0, 4));
        }

        if (demosRes.status === "fulfilled") {
          const items = Array.isArray(demosRes.value) ? demosRes.value : (demosRes.value?.data || []);
          setDemos(items.slice(0, 4));
        }
      } catch (err) {
        console.warn("Dashboard data load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalProducts = metrics?.products?.total ?? 12;
  const totalLeads = metrics?.crm?.totalInquiries ?? 11;
  const pendingLeads = metrics?.crm?.newInquiries ?? 6;
  const totalDemos = metrics?.crm?.pendingDemos ?? 5;
  const totalSubscribers = metrics?.crm?.subscribers ?? 5;

  return (
    <div className="space-y-7 pb-10">
      {/* 1. Friendly Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2.5">
              <Sparkles size={13} className="text-amber-300" />
              <span>Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Admin 👋
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl leading-relaxed">
              Here is what is happening across your website today. You can manage products, read customer inquiries, and view scheduled demos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition backdrop-blur-md"
            >
              <span>View Website</span>
              <ExternalLink size={14} />
            </a>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 px-4 py-2.5 text-xs font-bold shadow-sm transition active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Ambient background blur decor */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* 2. Four Clear, Self-Explanatory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Products */}
        <Link
          href="/admin/products"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Products
            </span>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            {totalProducts}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-500" />
            <span>Visible in marketplace</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
            <span>Manage products</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* Card 2: Inbound Leads */}
        <Link
          href="/admin/leads"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Leads
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <Mail size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            {totalLeads}
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-medium">
            {pendingLeads} new awaiting response
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>View messages</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* Card 3: Scheduled Demos */}
        <Link
          href="/admin/demos"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-violet-400 hover:shadow-md transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Demo Bookings
            </span>
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            {totalDemos}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Upcoming product walkthroughs
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600 group-hover:text-violet-700">
            <span>View calendar</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* Card 4: Subscribers */}
        <Link
          href="/admin/leads"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Newsletter List
            </span>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-exo">
            {totalSubscribers}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Subscribers from website footer
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span>View audience</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      {/* 3. Quick Shortcuts: "Common Tasks" */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Package size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Add Product</div>
                <div className="text-xs text-slate-500">Publish SaaS to catalog</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/admin/leads"
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Customer Leads</div>
                <div className="text-xs text-slate-500">Check incoming inquiries</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/admin/demos"
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-violet-700">Client Demos</div>
                <div className="text-xs text-slate-500">Schedule walkthroughs</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/admin/website/homepage"
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700">Edit Homepage</div>
                <div className="text-xs text-slate-500">Update hero and text</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 4. Two Clean Sections: Recent Inbound Leads & Scheduled Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Customer Messages */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Latest Customer Messages
              </h2>
              <p className="text-xs text-slate-500">
                People who contacted you through the website
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <span>View All ({totalLeads})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {leads.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent inquiries yet.
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {lead.name}
                      </span>
                      {lead.country && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                          {lead.country}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 truncate">
                      <strong className="text-slate-800">{lead.company || "Direct Inquiry"}</strong>
                      {lead.email && <span className="text-slate-400"> • {lead.email}</span>}
                    </div>
                    {lead.requirement && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        "{lead.requirement}"
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      lead.status === "NEW"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : lead.status === "QUALIFIED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {lead.status === "NEW" ? "New Lead" : lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Scheduled Demos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Scheduled Product Walkthroughs
              </h2>
              <p className="text-xs text-slate-500">
                Clients requesting a live demo of your software
              </p>
            </div>
            <Link
              href="/admin/demos"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <span>View All ({totalDemos})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {demos.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No scheduled demos yet.
              </div>
            ) : (
              demos.map((demo) => (
                <div
                  key={demo.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {demo.contactName || demo.client}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 truncate">
                      <strong className="text-slate-800">{demo.company || demo.organization}</strong>
                      <span className="text-slate-400"> • Product: {demo.productSlug || demo.product || "Software"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mt-1">
                      <Clock size={12} />
                      <span>{demo.preferredDate || "Upcoming"} at {demo.preferredTime || "12:00 PM"}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      demo.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {demo.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
