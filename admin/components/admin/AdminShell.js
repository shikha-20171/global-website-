"use client";
import { useState, useEffect, useRef } from "react";
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

  // Fast synchronous session check from sessionStorage (0ms initial paint)
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("dezoryn_admin_user");
        return stored ? JSON.parse(stored) : null;
      } catch (_) {
        return null;
      }
    }
    return null;
  });

  const [authChecking, setAuthChecking] = useState(() => {
    if (isAuthPage) return false;
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("dezoryn_admin_token");
      const stored = sessionStorage.getItem("dezoryn_admin_user");
      // If we already have stored credentials, render immediately!
      if (token && stored) return false;
    }
    return true;
  });

  const verifiedRef = useRef(false);

  useEffect(() => {
    if (isAuthPage) return;

    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("dezoryn_admin_token");
      const stored = sessionStorage.getItem("dezoryn_admin_user");

      // No token at all: instantly redirect to /login without any network wait!
      if (!token) {
        setAuthChecking(false);
        router.replace("/login");
        return;
      }

      if (stored && !currentUser) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (_) {}
      }
      setAuthChecking(false);
    }

    // Verify token with backend in background once per session (do NOT block screen or repeat on every route click)
    if (!verifiedRef.current) {
      verifiedRef.current = true;
      getAdminCurrentUser()
        .then((user) => {
          if (user) setCurrentUser(user);
        })
        .catch(() => {
          const stored = typeof window !== "undefined" && sessionStorage.getItem("dezoryn_admin_user");
          if (!stored) {
            router.replace("/login");
          }
        });
    }
  }, [isAuthPage, router]);

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
          <img
            src="/logo.png"
            alt="DEZORYN"
            className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-md animate-pulse"
          />
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-xs font-mono font-semibold text-slate-500">Loading Control Plane...</span>
          </div>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased w-full max-w-full overflow-x-hidden">
      {/* Shared Persistent Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          pageTitle={getPageTitle(pathname)}
          currentUser={currentUser}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
