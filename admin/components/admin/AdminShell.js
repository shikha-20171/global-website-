"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getAdminCurrentUser } from "@/lib/api";

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If on admin auth page (login, forgot-password, reset-password), render clean standalone authentication container
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const [authChecking, setAuthChecking] = useState(!isAuthPage);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthPage) return;
    let mounted = true;
    // [API IMPLEMENTATION] getAdminCurrentUser() -> GET /api/v1/admin/auth/me
    getAdminCurrentUser()
      .then((user) => {
        if (mounted) {
          setCurrentUser(user);
          setAuthChecking(false);
        }
      })
      .catch(() => {
        if (mounted) {
          const stored = typeof window !== "undefined" && sessionStorage.getItem("dezoryn_admin_user");
          if (stored) {
            try {
              setCurrentUser(JSON.parse(stored));
              setAuthChecking(false);
              return;
            } catch (e) {}
          }
          router.push("/login");
        }
      });
    return () => {
      mounted = false;
    };
  }, [isAuthPage, pathname, router]);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="relative z-10 w-full flex justify-center">
          {children}
        </div>
      </div>
    );
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="text-xs font-mono text-slate-500">Verifying Super Admin Session...</span>
        </div>
      </div>
    );
  }

  // Derive human-readable page title from pathname
  const getPageTitle = (path) => {
    if (!path || path === "/admin" || path === "/") return "Super Admin Executive Dashboard";
    const segment = path.replace("/admin/", "").replace(/^\//, "").split("/")[0];
    return (
      segment.charAt(0).toUpperCase() +
      segment.slice(1).replace(/-/g, " ") +
      " Management"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased">
      {/* Shared Persistent Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          pageTitle={getPageTitle(pathname)}
          currentUser={currentUser}
        />

        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
