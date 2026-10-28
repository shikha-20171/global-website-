"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { adminForgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedEmail = String(email || "").trim().toLowerCase();

    if (!sanitizedEmail) {
      setError("Please enter your registered administrator email address.");
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail);
    if (!isValid) {
      setError("Please enter a valid administrative email format.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // [API IMPLEMENTATION] adminForgotPassword() -> POST /api/v1/admin/auth/forgot-password
      await adminForgotPassword(sanitizedEmail);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred while requesting password reset.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] px-3 sm:px-0 mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xl mb-4 shadow-[0_0_35px_rgba(37,99,235,0.35)] ring-4 ring-blue-500/20 font-exo">
          DZ
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-exo">
          RESET ACCESS
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
          DEZORYN Administrative Account Recovery
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.1)] backdrop-blur-2xl">
        {submitted ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={30} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Instructions Processed</h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                If <strong>{email}</strong> is registered as an active administrator, password reset instructions and your reset link have been dispatched to your email.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] leading-relaxed text-left font-mono">
              <div className="text-blue-400 font-semibold mb-1">Email Notice:</div>
              Please check your inbox (and spam folder) for the password reset email to access your secure link and set your new password.
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft size={14} />
                <span>Return to Administrator Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg shadow-rose-950/20 animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-rose-100 block mb-0.5">Recovery Notice</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
                  Registered Administrator Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    autoComplete="email"
                    placeholder="admin@dezoryn.com"
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition shadow-inner font-mono text-xs sm:text-sm"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Enter the email address tied to your administrative account.
                </p>
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
                      <span>Sending Recovery Email...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Email</span>
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
                <ArrowLeft size={13} />
                <span>Back to Login</span>
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
