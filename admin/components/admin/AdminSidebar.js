"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "@/lib/navigation";
import { ChevronLeft, ChevronRight, X, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 shadow-sm">
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-5 border-b border-slate-200 bg-white">
        <Link
          href="/admin"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg py-1 group"
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="DEZORYN Technology"
              className="h-10 w-10 rounded-xl object-cover border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base tracking-wide text-slate-900 font-exo">
                DEZORYN
              </span>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider font-mono">
                Super Admin
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          aria-label="Close Admin Sidebar"
        >
          <X size={20} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-7 [scrollbar-width:thin]">
        {ADMIN_NAV_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-1.5">
            {!collapsed ? (
              <div className="px-3 text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">
                {grp.group}
              </div>
            ) : (
              <div className="h-[1px] bg-slate-200 my-2 mx-1" />
            )}

            {grp.items.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent font-medium"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono border ${
                        item.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        {!collapsed ? (
          <div className="space-y-3">
            <Link
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white transition border border-slate-200 shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={14} className="text-blue-600" />
                <span>Live Website</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">dezoryn.com</span>
            </Link>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">Systems Operational</span>
              </span>
              <span className="font-semibold">Super Admin</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link
              href="http://localhost:3000"
              target="_blank"
              title="Open Live Website"
              className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-white"
            >
              <ExternalLink size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
