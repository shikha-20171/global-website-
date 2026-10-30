"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { adminResetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Missing or invalid password reset token in URL.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminResetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Invalid, expired, or already-used password reset token.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] px-3 sm:px-0 mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="DEZORYN Technology Logo"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.45)] ring-4 ring-blue-500/20"
          />
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-exo">
          SET NEW PASSWORD
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
          DEZORYN Administrative Access Update
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.1)] backdrop-blur-2xl">
        {success ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={30} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Password Updated!</h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Your administrator password has been updated securely. All previous active sessions have been revoked.
              </p>
            </div>

            <div className="pt-3">
              <Link
                href="/login"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30"
              >
                <span>Sign In with New Password</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : !token ? (
          <div className="text-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle size={26} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Invalid Reset Link</h2>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                No password reset token was detected in your request URL. Please request a new recovery link.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition"
              >
                <span>Request New Reset Link</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Security Indicator */}
            <div className="mb-5 p-3 rounded-xl border border-blue-500/20 bg-blue-950/30 text-blue-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                <span className="font-semibold text-blue-200">Token Verified</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Argon2id / Bcrypt
              </span>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg shadow-rose-950/20 animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-rose-100 block mb-0.5">Reset Notice</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
                  New Administrator Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter at least 8 characters"
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition shadow-inner font-mono text-xs sm:text-sm"
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

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition shadow-inner font-mono text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save &amp; Invalidate Sessions</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <Link
                href="/login"
                className="hover:text-white transition flex items-center gap-1.5 text-blue-400 hover:underline"
              >
                <span>Return to Login</span>
              </Link>
              <span className="text-[11px] font-mono text-slate-500">DEZORYN Auth</span>
            </div>
          </>
        )}
      </div>

      <div className="text-center mt-5 text-xs text-slate-500 font-mono">
        DEZORYN TECHNOLOGY Corp • Control Plane
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="text-xs font-mono text-slate-400">Loading reset session...</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
