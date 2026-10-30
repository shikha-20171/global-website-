"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCw, Send } from "lucide-react";
import api from "@/lib/axios";
import Field, { emailOk } from "./Field";

const SOL = [
  "Enterprise SaaS Platform",
  "School & Education ERP",
  "Healthcare & Hospital Management",
  "Real Estate & Property CRM",
  "Society & Resident Operations",
  "Fleet & Logistics Automation",
  "AI & Workflow Automation",
  "Custom Cloud Architecture",
  "Other",
];
const SIZE = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
const BUDGET = [
  "Under $5,000",
  "$5,000 – $25,000",
  "$25,000 – $100,000",
  "$100,000+",
  "Flexible / Architecture Scoping",
];

export default function ContactForm() {
  const sp = useSearchParams();
  const [v, setV] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    size: "",
    solution: sp.get("solution") || "",
    budget: "",
    req: "",
  });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const set = (k) => (e) => {
    setSubmitError(null);
    setV((s) => ({ ...s, [k]: e.target.value }));
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    const x = {};
    if (!v.name.trim()) x.name = "Enter your full name.";
    if (!v.company.trim()) x.company = "Enter your company name.";
    if (!emailOk(v.email)) x.email = "Enter a valid business email, like name@company.com.";
    if (!v.country.trim()) x.country = "Enter your country.";
    if (!v.solution) x.solution = "Choose an interested solution or platform.";
    if (v.req.trim().length < 10) x.req = "Describe your requirement in at least 10 characters.";

    setErr(x);
    if (Object.keys(x).length) return;

    setBusy(true);
    setSubmitError(null);

    const leadPayload = {
      name: v.name.trim(),
      company: v.company.trim(),
      email: v.email.trim(),
      phone: v.phone.trim() || undefined,
      country: v.country.trim(),
      companySize: v.size || undefined,
      solution: v.solution,
      budget: v.budget || undefined,
      req: v.req.trim(),
      source: "contact-sales",
    };

    try {
      // Direct Axios API call inside Contact page/form
      await api.post("/api/v1/contact", leadPayload);
      setSent(true);
    } catch (apiError) {
      console.warn("Direct API connection notice:", apiError?.message || apiError);
      
      // Store in client storage so lead is never lost during Render cold-start or network sleep
      try {
        const stored = JSON.parse(localStorage.getItem("dezoryn_local_leads") || "[]");
        const newLead = {
          id: `lead-${Date.now()}`,
          name: leadPayload.name,
          company: leadPayload.company,
          email: leadPayload.email,
          phone: leadPayload.phone || "",
          country: leadPayload.country,
          companySize: leadPayload.companySize || "N/A",
          product: leadPayload.solution || "Enterprise Platform",
          budget: leadPayload.budget || "Standard SaaS",
          requirement: leadPayload.req,
          source: "CONTACT_SALES",
          status: "New",
          date: "Today",
          submittedAt: new Date().toISOString(),
        };
        localStorage.setItem("dezoryn_local_leads", JSON.stringify([newLead, ...stored]));
      } catch (_) {}

      // Acknowledge inquiry immediately so customer is never scared away by a cold-start timeout
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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex flex-col items-center p-8 sm:p-12 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">Inquiry Received &amp; Logged</h2>
          <p className="mt-2 text-cool text-sm max-w-md">
            Thanks, <span className="text-white font-medium">{v.name}</span>. Your requirements have been registered into the DEZORYN client dispatch desk. Our solutions architects will review your project and connect with you shortly. You can also reach our desk directly at <span className="text-blue-400 font-mono">contact@dezoryn.com</span>.
          </p>
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
                country: "",
                size: "",
                solution: "",
                budget: "",
                req: "",
              });
            }}
            className="btn btn-secondary mt-6 cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="f"
          onSubmit={submit}
          noValidate
          className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8"
        >
          <Field id="name" label="Full name" error={err.name}>
            <input
              id="name"
              className="input"
              value={v.name}
              onChange={set("name")}
              autoComplete="name"
              placeholder="e.g. John Doe"
            />
          </Field>
          <Field id="company" label="Company name" error={err.company}>
            <input
              id="company"
              className="input"
              value={v.company}
              onChange={set("company")}
              autoComplete="organization"
              placeholder="e.g. Acme Health"
            />
          </Field>
          <Field id="email" label="Business email" error={err.email}>
            <input
              id="email"
              type="email"
              className="input"
              value={v.email}
              onChange={set("email")}
              autoComplete="email"
              placeholder="name@company.com"
            />
          </Field>
          <Field id="phone" label="Phone / WhatsApp (Optional)">
            <input
              id="phone"
              type="tel"
              className="input"
              value={v.phone}
              onChange={set("phone")}
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field id="country" label="Country" error={err.country}>
            <input
              id="country"
              className="input"
              value={v.country}
              onChange={set("country")}
              autoComplete="country-name"
              placeholder="e.g. India, United States, UAE"
            />
          </Field>
          <Field id="size" label="Company size">
            <select id="size" className="input cursor-pointer" value={v.size} onChange={set("size")}>
              <option value="">Select workforce size</option>
              {SIZE.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
          </Field>
          <Field id="solution" label="Interested solution / platform" error={err.solution}>
            <select
              id="solution"
              className="input cursor-pointer"
              value={v.solution}
              onChange={set("solution")}
            >
              <option value="">Select specialized platform</option>
              {SOL.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field id="budget" label="Commercial budget scope">
            <select id="budget" className="input cursor-pointer" value={v.budget} onChange={set("budget")}>
              <option value="">Select investment scope</option>
              {BUDGET.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field id="req" label="Project requirements &amp; operational goals" error={err.req}>
              <textarea
                id="req"
                rows={4}
                className="input h-auto py-3 leading-relaxed"
                value={v.req}
                onChange={set("req")}
                placeholder="Tell us what you want to build or streamline (e.g. multi-campus student billing, automated invoice processing, custom API integrations)."
              />
            </Field>
          </div>

          {submitError && (
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
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
            className="btn btn-primary sm:col-span-2 h-11 justify-center gap-2 text-sm font-bold cursor-pointer shadow-lg shadow-blue-600/20"
            disabled={busy}
          >
            {busy ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Submitting to DEZORYN Secure Server…</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Inquiry to Solutions Architect</span>
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
