"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Info,
} from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@dezoryn.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    // Check for previously remembered email
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("dezoryn_admin_email");
      if (savedEmail) {
        setEmail(savedEmail);
        validateEmailFormat(savedEmail);
      }
    }
  }, []);

  const validateEmailFormat = (val) => {
    const trimmed = String(val || "").trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    setEmailValid(isValid);
    return isValid;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateEmailFormat(val);
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedEmail = String(email || "").trim().toLowerCase();
    const trimmedPassword = String(password || "").trim();

    if (!sanitizedEmail) {
      setError("Please provide an administrator email address.");
      return;
    }

    if (!validateEmailFormat(sanitizedEmail)) {
      setError("Please enter a valid administrative email format (e.g. admin@dezoryn.com).");
      return;
    }

    if (!trimmedPassword) {
      setError("Please enter your administrator access password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // [API IMPLEMENTATION] adminLogin() -> POST /api/v1/admin/auth/login
      await adminLogin(sanitizedEmail, trimmedPassword);
      router.push("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Invalid administrator credentials. Please check your email and access key.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] px-2 sm:px-0">
      {/* Brand Header */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xl mb-4 shadow-[0_0_35px_rgba(37,99,235,0.35)] ring-4 ring-blue-500/20 font-exo">
          DZ
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-exo">
          DEZORYN CONTROL PLANE
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
          Enterprise Super Admin Authentication
        </p>
      </div>

      {/* Main Login Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.1)] backdrop-blur-2xl">
        {/* Static Password Quick-Access Banner */}
        <div className="mb-4 p-3 rounded-xl border border-blue-500/20 bg-blue-950/30 text-blue-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-blue-400 shrink-0" />
            <div>
              <span className="font-semibold block text-white text-[12px]">Static Admin Password</span>
              <span className="text-[11px] text-blue-300 font-mono">SuperSecretAdminPassword2026!</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@dezoryn.com");
              setEmailValid(true);
              setPassword("SuperSecretAdminPassword2026!");
              if (error) setError(null);
            }}
            className="text-[11px] font-medium bg-blue-600/40 hover:bg-blue-600/70 text-blue-200 border border-blue-500/40 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg shadow-rose-950/20 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-rose-100 block mb-0.5">Authentication Notice</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
                <span>Administrator Email</span>
                {emailValid && (
                  <CheckCircle2 size={13} className="text-emerald-400 inline" />
                )}
              </label>
            </div>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition shadow-inner font-mono text-xs sm:text-sm"
                placeholder="admin@dezoryn.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                Access Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition shadow-inner font-mono text-xs sm:text-sm"
                placeholder="Enter access password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Control Plane</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="http://localhost:3000"
            className="hover:text-white transition flex items-center gap-1.5"
          >
            <span>← Public Website</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational</span>
          </div>
        </div>
      </div>

      {/* Sub-footer Note */}
      <div className="text-center mt-5 text-xs text-slate-500 font-mono">
        DEZORYN TECHNOLOGY Corp • Single Super Admin Architecture
      </div>
    </div>
  );
}
