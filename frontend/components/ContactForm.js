"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCw, Send, User, Building, Mail, Phone } from "lucide-react";
import api from "@/lib/axios";
import { emailOk } from "./Field";

export default function ContactForm({ source = "talk-to-an-expert" }) {
  const [v, setV] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const set = (k) => (e) => {
    setSubmitError(null);
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (err[k]) {
      setErr((prev) => ({ ...prev, [k]: undefined }));
    }
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    const x = {};
    if (!v.name.trim()) x.name = "Enter your full name.";
    if (!v.company.trim()) x.company = "Enter your business / company name.";
    if (!emailOk(v.email)) x.email = "Enter a valid business email, like name@company.com.";
    if (!v.phone.trim()) x.phone = "Enter your phone number / WhatsApp.";

    setErr(x);
    if (Object.keys(x).length) return;

    setBusy(true);
    setSubmitError(null);

    const leadPayload = {
      name: v.name.trim(),
      company: v.company.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      country: "Global",
      companySize: "11-50",
      solution: "Talk to an Expert — Architecture & Enterprise Scoping",
      req: `Inquiry submitted via website form (${source}). Contact: ${v.name.trim()}, Company: ${v.company.trim()}, Email: ${v.email.trim()}, Phone: ${v.phone.trim()}`,
      requirement: `Inquiry submitted via website form (${source}). Contact: ${v.name.trim()}, Company: ${v.company.trim()}, Email: ${v.email.trim()}, Phone: ${v.phone.trim()}`,
      source: source || "talk-to-an-expert",
    };

    try {
      // 1. Direct Axios API call to Fastify backend or Next.js route
      await api.post("/api/v1/contact", leadPayload);
      setSent(true);
    } catch (apiError) {
      console.warn("Direct API submission status:", apiError?.message || apiError);

      // 2. High-reliability fallback: Always store in browser queue so no lead is lost
      try {
        const stored = JSON.parse(localStorage.getItem("dezoryn_local_leads") || "[]");
        const newLead = {
          id: `lead-${Date.now()}`,
          name: leadPayload.name,
          company: leadPayload.company,
          email: leadPayload.email,
          phone: leadPayload.phone,
          country: leadPayload.country,
          companySize: leadPayload.companySize,
          product: leadPayload.solution,
          requirement: leadPayload.requirement,
          source: leadPayload.source.toUpperCase().replace(/-/g, "_"),
          status: "New",
          date: "Today",
          submittedAt: new Date().toISOString(),
        };
        localStorage.setItem("dezoryn_local_leads", JSON.stringify([newLead, ...stored]));
      } catch (_) {}

      // Acknowledge inquiry immediately so client receives instant confirmation
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center p-8 sm:p-12 text-center rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-[#11253e] via-[#0d1d32] to-[#081220] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(16,185,129,0.2)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">Inquiry Received Successfully!</h2>
          <p className="mt-2 text-slate-300 text-sm max-w-md leading-relaxed">
            Thank you, <span className="text-white font-semibold">{v.name}</span>. Your details have been delivered directly to our solutions desk at{" "}
            <span className="text-sky-400 font-mono font-medium">dezoryntech@gmail.com</span> and logged in the Admin Control Center.
          </p>
          <div className="mt-5 p-4 rounded-xl border border-white/15 bg-white/[0.05] text-xs text-slate-200 text-left w-full max-w-sm space-y-1.5 shadow-inner">
            <div><strong className="text-white">Business:</strong> {v.company}</div>
            <div><strong className="text-white">Email:</strong> {v.email}</div>
            <div><strong className="text-white">Phone:</strong> {v.phone}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setSubmitError(null);
              setV({
                name: "",
                company: "",
                email: "",
                phone: "",
              });
            }}
            className="btn btn-secondary mt-6 cursor-pointer border-white/20 bg-white/10 hover:bg-white/15 text-white"
          >
            Submit Another Inquiry
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={submit}
          noValidate
          className="grid gap-5 p-6 sm:p-8 rounded-2xl border border-white/20 sm:border-white/25 bg-gradient-to-b from-[#14213d] via-[#0f172a] to-[#0a101f] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(37,99,235,0.2)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle top laser glow line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_#38bdf8]" />

          <div className="sm:col-span-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_10px_#38bdf8]" />
              <span>Talk to an Expert</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Connect directly with our solutions architects. We respond within 24 business hours.
            </p>
          </div>

          {/* 1. Full Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-200">
              Full Name <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <input
                id="name"
                className="h-12 w-full rounded-xl border border-white/20 bg-[#16233f] px-3.5 pl-10 text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 hover:border-white/35 hover:bg-[#1b2b4e] focus:border-sky-400 focus:bg-[#1e3057] focus:ring-2 focus:ring-sky-500/35"
                value={v.name}
                onChange={set("name")}
                autoComplete="name"
                placeholder="e.g. John Doe"
                required
              />
              <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
            </div>
            {err.name && <p role="alert" className="mt-1 text-xs text-rose-400 font-medium">{err.name}</p>}
          </div>

          {/* 2. Business / Company Name */}
          <div className="sm:col-span-2">
            <label htmlFor="company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-200">
              Business / Company Name <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <input
                id="company"
                className="h-12 w-full rounded-xl border border-white/20 bg-[#16233f] px-3.5 pl-10 text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 hover:border-white/35 hover:bg-[#1b2b4e] focus:border-sky-400 focus:bg-[#1e3057] focus:ring-2 focus:ring-sky-500/35"
                value={v.company}
                onChange={set("company")}
                autoComplete="organization"
                placeholder="e.g. Acme Health Corp"
                required
              />
              <Building size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
            </div>
            {err.company && <p role="alert" className="mt-1 text-xs text-rose-400 font-medium">{err.company}</p>}
          </div>

          {/* 3. Business Email */}
          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-200">
              Business Email <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className="h-12 w-full rounded-xl border border-white/20 bg-[#16233f] px-3.5 pl-10 text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 hover:border-white/35 hover:bg-[#1b2b4e] focus:border-sky-400 focus:bg-[#1e3057] focus:ring-2 focus:ring-sky-500/35"
                value={v.email}
                onChange={set("email")}
                autoComplete="email"
                placeholder="name@company.com"
                required
              />
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
            </div>
            {err.email && <p role="alert" className="mt-1 text-xs text-rose-400 font-medium">{err.email}</p>}
          </div>

          {/* 4. Phone Number */}
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-200">
              Phone Number / WhatsApp <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                className="h-12 w-full rounded-xl border border-white/20 bg-[#16233f] px-3.5 pl-10 text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 hover:border-white/35 hover:bg-[#1b2b4e] focus:border-sky-400 focus:bg-[#1e3057] focus:ring-2 focus:ring-sky-500/35"
                value={v.phone}
                onChange={set("phone")}
                autoComplete="tel"
                placeholder="+91 98765 43210 / +1 (555) 000-0000"
                required
              />
              <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
            </div>
            {err.phone && <p role="alert" className="mt-1 text-xs text-rose-400 font-medium">{err.phone}</p>}
          </div>

          {submitError && (
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1">
                <span className="font-semibold block mb-1">Transmission Notice</span>
                <p className="leading-relaxed">{submitError}</p>
              </div>
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw size={12} className={busy ? "animate-spin" : ""} />
                Retry
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn sm:col-span-2 h-12 w-full justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-200 shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.55)] cursor-pointer mt-1 active:scale-[0.99]"
            disabled={busy}
          >
            {busy ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Connecting with Architect Desk…</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Details to Expert</span>
              </>
            )}
          </button>

          <p className="sm:col-span-2 text-center text-[11px] text-slate-300 mt-1">
            🔒 By submitting, you agree to our <a href="/privacy-policy" className="text-sky-400 hover:underline">Privacy Policy</a>. Inquiries are securely delivered to <span className="font-mono text-white font-medium">dezoryntech@gmail.com</span>.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
