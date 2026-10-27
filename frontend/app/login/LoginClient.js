"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-28 pb-16 px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8 border-white/10 bg-[#070b16]/90 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-electric/10 border border-electric/30 text-electric mb-4 shadow-[0_0_20px_rgba(47,107,255,0.2)]">
              <Lock size={22} />
            </div>
            <h1 className="h-display text-2xl sm:text-3xl font-extrabold text-white">
              Sign In to DEZORYN
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-cool">
              Access your unified SaaS workspace and cloud infrastructure.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-lg font-semibold text-white">Authentication Verified</h2>
              <p className="mt-2 text-xs text-cool leading-relaxed">
                Redirecting you to your enterprise workspace portal for <span className="text-white font-mono">{email}</span>...
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/admin" className="btn btn-primary h-10 w-full justify-center text-xs">
                  Open Platform Admin
                </Link>
                <Link href="/marketplace" className="btn btn-secondary h-10 w-full justify-center text-xs">
                  Browse Marketplace
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@enterprise.dezoryn.com");
                    setPassword("••••••••••••");
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 hover:border-white/20 transition duration-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("director@dezoryn.com");
                    setPassword("••••••••••••");
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 hover:border-white/20 transition duration-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub / SSO</span>
                </button>
              </div>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line" />
                </div>
                <span className="relative bg-[#070b16] px-3 text-[11px] font-mono text-cool uppercase">
                  Or corporate email
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/90 mb-1.5">
                    Business Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-lg border border-line bg-midnight/80 px-3.5 py-2.5 text-xs text-white placeholder-cool/60 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                    <Mail size={15} className="pointer-events-none absolute right-3.5 top-3 text-cool/60" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset instructions have been dispatched to your corporate email domain.");
                      }}
                      className="text-[11px] font-mono text-electric hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-line bg-midnight/80 px-3.5 py-2.5 text-xs text-white placeholder-cool/60 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                    />
                    <Lock size={15} className="pointer-events-none absolute right-3.5 top-3 text-cool/60" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary h-11 w-full justify-center text-xs font-medium"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Verifying credentials...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span>Sign In to Workspace</span>
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </button>
                </div>
              </form>

             
            </>
          )}
        </div>

        <div className="mt-6 text-center text-[11px] font-mono text-cool/80">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-electric" />
            
          </p>
        </div>
      </motion.div>
    </div>
  );
}
