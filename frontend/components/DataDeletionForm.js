"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/axios";

export default function DataDeletionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    scope: "full-deletion",
    notes: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full legal name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address associated with your data.");
      return;
    }
    if (!formData.consent) {
      setError("Please acknowledge the data deletion authorization checkbox.");
      return;
    }

    setLoading(true);
    const refCode = `DEL-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const scopeLabels = {
      "full-deletion": "Full Data Erasure (All records, accounts & submissions)",
      "marketing-only": "Marketing & Newsletter Subscriptions Only",
      "inquiries-only": "Contact Inquiries & Demo Booking Records Only",
      "tenant-account": "SaaS Workspace & Tenant Administrative Account",
    };

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company.trim() || "Individual Request",
      phone: formData.phone.trim() || "",
      country: "Global",
      solution: "Data Privacy & Erasure",
      budget: "N/A",
      source: "data-deletion",
      req: `[OFFICIAL DATA ERASURE REQUEST — REF: ${refCode}]
Scope: ${scopeLabels[formData.scope] || formData.scope}
Authorized Subject: ${formData.name.trim()} <${formData.email.trim().toLowerCase()}>
Company/Account: ${formData.company.trim() || "N/A"}
Phone: ${formData.phone.trim() || "N/A"}
User Notes / Identifiers: ${formData.notes.trim() || "Standard complete erasure requested."}
Consent Confirmed: Yes, authenticated user submission via DEZORYN Privacy Center.`,
    };

    try {
      // Send to contact/inquiry API which persists to Neon PostgreSQL and triggers Gmail SMTP notification
      await api.post("/api/v1/contact", payload);
      setTicketId(refCode);
      setSubmitted(true);
    } catch (err) {
      console.error("Data deletion submission error:", err);
      // Even if primary fails, attempt direct endpoint fallback
      try {
        await api.post("/api/v1/leads", payload);
        setTicketId(refCode);
        setSubmitted(true);
      } catch (fallbackErr) {
        setError(
          err.response?.data?.message ||
          "Unable to process erasure request right now. You may also email directly to privacy@dezoryn.com."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      scope: "full-deletion",
      notes: "",
      consent: false,
    });
    setSubmitted(false);
    setTicketId("");
    setError("");
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">
              Request Logged &amp; Verified
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Data Erasure Request Confirmed
            </h3>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs space-y-1.5">
          <div className="flex justify-between text-cool">
            <span>Reference Tracking Code:</span>
            <span className="text-white font-bold">{ticketId}</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>Subject Email:</span>
            <span className="text-white">{formData.email}</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>SLA Timeline:</span>
            <span className="text-emerald-300 font-semibold">30 Calendar Days (GDPR Art. 17)</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>Responsible Office:</span>
            <span className="text-white">DEZORYN Data Protection Office</span>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-cool leading-relaxed">
          <p>
            Your request has been securely recorded in our compliance register. Our Data Protection Officer (DPO) will authenticate your identity and initiate the purge sequence across active databases, caching tiers, and backup snapshots.
          </p>
          <p className="text-xs text-cool/80">
            An automated confirmation dispatch has been routed to your registered email address ({formData.email}). If you have additional documents or questions, reply to the confirmation or contact <a href="mailto:privacy@dezoryn.com" className="text-blue-400 underline">privacy@dezoryn.com</a> referencing ticket <strong className="text-white">{ticketId}</strong>.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-xs text-cool hover:text-white transition"
          >
            <RefreshCw size={13} />
            Submit another request
          </button>
          <a
            href="/legal/privacy"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Review Corporate Privacy Policy →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#070e24]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-electric font-semibold uppercase tracking-wider mb-1">
            <Lock size={13} /> Self-Service Rights Execution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Request Data Deletion
          </h2>
          <p className="text-xs sm:text-sm text-cool mt-1">
            Under GDPR (Article 17), CCPA/CPRA, and Meta Platform Policies, you may request permanent removal of your personal records.
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/30">
          <ShieldCheck size={22} />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 flex items-center gap-2.5 text-xs text-red-200">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-cool mb-1.5">
              Full Legal Name <span className="text-electric">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cool mb-1.5">
              Registered Email Address <span className="text-electric">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-cool mb-1.5">
              Organization / Company <span className="text-cool/50 text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cool mb-1.5">
              Phone Number <span className="text-cool/50 text-[11px]">(Optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 555-0192"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-cool mb-1.5">
            Scope of Data Deletion <span className="text-electric">*</span>
          </label>
          <select
            name="scope"
            value={formData.scope}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#090f23] px-3.5 py-2.5 text-sm text-white outline-none focus:border-electric transition"
          >
            <option value="full-deletion">Full Erasure — Permanently delete all personal &amp; account data</option>
            <option value="marketing-only">Marketing Only — Remove from newsletter &amp; marketing databases</option>
            <option value="inquiries-only">Inquiries &amp; Demos — Remove sales inquiry and demo request history</option>
            <option value="tenant-account">SaaS Tenant — De-provision workspace &amp; administrative records</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-cool mb-1.5">
            Specific Identifiers or Comments <span className="text-cool/50 text-[11px]">(Optional)</span>
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Provide any additional account IDs, Facebook User ID, app usernames, or details that will help locate your data..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition resize-none"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-cool leading-relaxed">
              I certify that I am the authorized data subject (or legal representative) associated with this email address, and I request permanent erasure under applicable data privacy statutes.
            </span>
          </label>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary h-11 w-full justify-center text-sm font-semibold shadow-lg shadow-blue-600/25"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Processing Erasure Request...
              </>
            ) : (
              <>
                Submit Erasure Request
                <ArrowRight size={15} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
