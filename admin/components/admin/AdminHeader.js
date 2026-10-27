"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { adminLogout } from "@/lib/api";

export default function AdminHeader({ setMobileOpen, pageTitle, currentUser }) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      // [API IMPLEMENTATION] adminLogout() -> POST /api/v1/admin/auth/logout
      await adminLogout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 sm:px-8 flex items-center justify-between gap-5 shadow-2xs">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          aria-label="Open Navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
            DEZORYN TECHNOLOGY
          </div>
          <div className="text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
            {pageTitle || "Overview"}
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-lg hidden md:block">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search products, leads, solutions, blog... (Cmd + K)"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right: Actions & Administrator Profile */}
      <div className="flex items-center gap-3">
        {/* Live Site Quick Link */}
        <Link
          href="http://localhost:3000"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition shadow-2xs"
        >
          <ExternalLink size={13} className="text-blue-600" />
          <span>View Site</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            aria-label="Admin Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 text-sm z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="font-bold text-slate-900">System Notifications</span>
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  2 new
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Website Assets Synchronized</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    18 SaaS Products &amp; 10 Industry Verticals live in catalog.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>New Lead Inquiry Received</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    Enterprise demo request for Schooly Core platform.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Super Admin Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
            aria-label="Admin Profile Menu"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {currentUser?.name
                ? currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "SA"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                {currentUser?.name || "Super Admin"}
              </div>
              <div className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Super Admin</span>
              </div>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl p-3 text-sm z-50">
              <div className="p-3 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">
                  {currentUser?.name || "Super Administrator"}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                  {currentUser?.email || "admin@dezoryn.com"}
                </div>
                <div className="mt-1 inline-block text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Role: {currentUser?.role?.name || "super_admin"}
                </div>
              </div>
              <div className="py-2 space-y-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium transition"
                >
                  <Sliders size={16} />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  href="http://localhost:3000"
                  target="_blank"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium transition"
                >
                  <ExternalLink size={16} />
                  <span>Live Production Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-sm font-medium transition border-t border-slate-100 mt-1 pt-2 text-left"
                >
                  <LogOut size={16} />
                  <span>Logout from Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
