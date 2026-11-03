"use client";
import { useState, useEffect } from "react";
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
  Server,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { adminLogout } from "@/lib/api";
import { getAdminApiBase } from "@/lib/axios";

export default function AdminHeader({ setMobileOpen, pageTitle, currentUser }) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Backend Connectivity Status
  const [backendStatus, setBackendStatus] = useState("checking"); // 'checking' | 'online' | 'offline'
  const [backendLatency, setBackendLatency] = useState(null);
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [customBackendUrl, setCustomBackendUrl] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const checkBackendHealth = async () => {
    try {
      const start = Date.now();
      const base = getAdminApiBase();
      const targetUrl = base ? `${base}/api/v1/health` : "/api/v1/health";
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) {
        setBackendLatency(Date.now() - start);
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch (_) {
      setBackendStatus("offline");
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBackendModal = () => {
    const current = typeof window !== "undefined" ? localStorage.getItem("dezoryn_backend_url") || "" : "";
    setCustomBackendUrl(current);
    setTestResult(null);
    setShowBackendModal(true);
  };

  const handleTestBackend = async () => {
    setTesting(true);
    setTestResult(null);
    const cleanUrl = customBackendUrl.trim().replace(/\/+$/, "");
    try {
      const start = Date.now();
      const testTarget = cleanUrl ? `${cleanUrl}/api/v1/health` : "/api/v1/health";
      const res = await fetch(testTarget, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json().catch(() => ({}));
      const latency = Date.now() - start;
      if (res.ok) {
        setTestResult({
          success: true,
          message: `Connected successfully (${latency}ms) — PostgreSQL Database is Live!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || `Server responded with HTTP ${res.status}.`,
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || "Could not reach backend at this URL.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveBackendUrl = () => {
    const cleanUrl = customBackendUrl.trim().replace(/\/+$/, "");
    if (typeof window !== "undefined") {
      if (cleanUrl) {
        localStorage.setItem("dezoryn_backend_url", cleanUrl);
      } else {
        localStorage.removeItem("dezoryn_backend_url");
      }
    }
    setShowBackendModal(false);
    checkBackendHealth();
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 lg:gap-5 shadow-2xs w-full max-w-full">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 sm:flex-initial">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition shrink-0"
            aria-label="Open Navigation"
          >
            <Menu size={22} />
          </button>

          {/* Mobile Brand Logo */}
          <div className="lg:hidden shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="DEZORYN"
              className="h-8 w-8 rounded-lg object-cover border border-slate-200"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 truncate">
              DEZORYN TECHNOLOGY
            </div>
            <div className="text-sm sm:text-lg font-bold text-slate-900 truncate max-w-[190px] sm:max-w-xs md:max-w-md">
              {pageTitle || "Overview"}
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg hidden lg:block">
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live Backend Connection Status Indicator */}
          {backendStatus === "online" ? (
            <button
              onClick={handleOpenBackendModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition cursor-pointer"
              title={`Backend API is connected & responsive (${backendLatency || 20}ms). Click to view details.`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Neon DB</span>
              <span>Online</span>
            </button>
          ) : (
            <button
              onClick={handleOpenBackendModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-semibold hover:bg-amber-100 transition cursor-pointer shadow-2xs"
              title="Backend disconnected. Click to connect backend URL or view localhost instructions."
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="hidden sm:inline">Backend</span>
              <span>Offline (Click to Connect)</span>
            </button>
          )}

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
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl p-4 text-sm z-50">
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
                SA
              </div>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                  Super Admin
                </div>
                <div className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Super Admin</span>
                </div>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-xs rounded-2xl border border-slate-200 bg-white shadow-xl p-3 text-sm z-50">
                <div className="p-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 truncate">
                    Super Admin
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                    {currentUser?.email || "dezoryntech@gmail.com"}
                  </div>
                  <div className="mt-1 inline-block text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    Role: Super Admin
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium transition"
                  >
                    <Sliders size={16} />
                    <span>Platform Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleOpenBackendModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium transition text-left"
                  >
                    <Server size={16} />
                    <span>Backend Connection</span>
                  </button>
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

      {/* Backend & Database Connection Modal */}
      {showBackendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Server className="text-blue-600" size={20} />
                  <span>Backend &amp; Neon Database Setup</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect your live backend API to save and sync content changes directly to Neon PostgreSQL.
                </p>
              </div>
              <button
                onClick={() => setShowBackendModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Backend API URL
                </label>
                <input
                  type="text"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  placeholder="e.g. https://your-backend.onrender.com or http://localhost:5001"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Leave blank to use default (<code>http://localhost:5001</code> locally or Vercel proxy).
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Local and Production Instructions */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900">How to keep edits synced:</div>
                <div className="space-y-1">
                  <div>
                    <strong>• For Local Testing:</strong> Run <code>npm run dev:backend</code> in your terminal. Fastify server runs on port 5001 and automatically connects to Neon PostgreSQL.
                  </div>
                  <div>
                    <strong>• For Vercel Cloud:</strong> Deploy the <code>backend/</code> folder to Render or Railway (free tier) and paste your backend URL above. All changes will instantly save to PostgreSQL and reflect live on the website!
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestBackend}
                disabled={testing}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                {testing ? "Testing..." : "Test Connection"}
              </button>
              <button
                type="button"
                onClick={handleSaveBackendUrl}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Save &amp; Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
