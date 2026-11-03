"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, ArrowRight, Loader2, RefreshCw, FileText } from "lucide-react";
import api from "@/lib/axios";

export default function DataDeletionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requestType: "personal-data-deletion",
    accountId: "",
    phone: "",
    notes: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const requestTypeLabels = {
    "account-deletion": "User Account & Profile Deletion",
    "personal-data-deletion": "Personal Data Deletion (Inquiries, Marketing & Records)",
    "meta-data-deletion": "Meta / Facebook-Related Data Deletion",
    "google-play-deletion": "Google Play App Account & Mobile Data Deletion",
    "universal-erasure": "Universal Erasure (All Associated Data & Accounts)",
  };

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
      setError("Please provide your full legal name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address associated with your account.");
      return;
    }
    if (!formData.consent) {
      setError("Please confirm your authorization by checking the acknowledgment box.");
      return;
    }

    setLoading(true);
    const refCode = `DEL-DEZ-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.accountId.trim() ? `Account: ${formData.accountId.trim()}` : "Individual Data Subject",
      phone: formData.phone.trim() || "",
      country: "Global",
      solution: "Data Privacy & Erasure",
      budget: "N/A",
      source: "data-deletion",
      req: `[OFFICIAL DATA ERASURE REQUEST — REF: ${refCode}]
Request Type: ${requestTypeLabels[formData.requestType] || formData.requestType}
Data Subject: ${formData.name.trim()} <${formData.email.trim().toLowerCase()}>
Account ID / App Username: ${formData.accountId.trim() || "Not provided"}
Phone Number: ${formData.phone.trim() || "Not provided"}
User Notes / Context: ${formData.notes.trim() || "Complete standard erasure requested."}
Consent Confirmed: Yes, authorized submission via DEZORYN Privacy Center.`,
    };

    try {
      // Primary: send to Fastify / Next.js contact endpoint which logs to Neon DB and sends admin alert
      await api.post("/api/v1/contact", payload);
      setTicketId(refCode);
      setSubmitted(true);
    } catch (err) {
      console.error("Data deletion submission notice:", err);
      try {
        // Fallback: send directly to leads route
        await api.post("/api/v1/leads", payload);
        setTicketId(refCode);
        setSubmitted(true);
      } catch (fallbackErr) {
        setError(
          err.response?.data?.message ||
          "Unable to submit erasure request at this moment. Please email our Data Protection Officer directly at privacy@dezoryn.com."
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
      requestType: "personal-data-deletion",
      accountId: "",
      phone: "",
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">
              Request Received &amp; In Verification Queue
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Data Deletion Request Recorded
            </h3>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs space-y-2">
          <div className="flex justify-between text-cool">
            <span>Reference Tracking Code:</span>
            <span className="text-white font-bold">{ticketId}</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>Registered Email:</span>
            <span className="text-white">{formData.email}</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>Request Scope:</span>
            <span className="text-emerald-300">{requestTypeLabels[formData.requestType]}</span>
          </div>
          <div className="flex justify-between text-cool">
            <span>Verification Status:</span>
            <span className="text-amber-300 font-semibold">Pending Ownership Authentication</span>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-cool leading-relaxed">
          <p>
            Your request has been logged into DEZORYN TECHNOLOGY’s compliance register. To safeguard account security and prevent unauthorized erasure, accounts and records are <strong className="text-white">not deleted immediately</strong> without ownership verification.
          </p>
          <p>
            Our compliance team will review your submission, send an authentication link or confirmation prompt to <span className="text-white font-medium">{formData.email}</span>, and complete permanent purging across active systems within our standard processing timeline (typically within 30 days, subject to legally mandated retention requirements).
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-xs text-cool hover:text-white transition"
          >
            <RefreshCw size={13} />
            Submit another inquiry or request
          </button>
          <a
            href="/privacy-policy"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Review Full Privacy Policy →
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
            <Lock size={13} /> Verified Request Submission
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Data Deletion Request Form
          </h2>
          <p className="text-xs sm:text-sm text-cool mt-1">
            Submit a formal request to delete your personal data, user account, Google Play app data, or Meta platform records.
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
        {/* Request Type Selector */}
        <div>
          <label className="block text-xs font-medium text-cool mb-1.5">
            Select Request Type <span className="text-electric">*</span>
          </label>
          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#090f23] px-3.5 py-2.5 text-sm text-white outline-none focus:border-electric transition"
          >
            <option value="account-deletion">Account Deletion (SaaS Tenant &amp; User Profile)</option>
            <option value="personal-data-deletion">Personal Data Deletion (Inquiries, Marketing &amp; Records)</option>
            <option value="meta-data-deletion">Meta / Facebook-Related Data Deletion</option>
            <option value="google-play-deletion">Google Play App Account &amp; Mobile Data Deletion</option>
            <option value="universal-erasure">Universal Erasure (All Records &amp; Accounts)</option>
          </select>
        </div>

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
              placeholder="e.g. Jane Doe"
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
              placeholder="e.g. jane@company.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-cool mb-1.5">
              Account ID / Username / App Name <span className="text-cool/50 text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              placeholder="e.g. Org Tenant, FB User ID, or App Username"
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
              placeholder="e.g. +1 555-0199"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-cool/50 outline-none focus:border-electric transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-cool mb-1.5">
            Additional Identification Details or Reason <span className="text-cool/50 text-[11px]">(Optional)</span>
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Provide any specific identifiers, dates of service, or notes to help our compliance team verify your account accurately..."
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
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer shrink-0"
            />
            <span className="text-xs text-cool leading-relaxed">
              I certify that I am the authorized data subject or legal administrator for this account. I understand that DEZORYN TECHNOLOGY will verify my ownership before permanently purging data, and that certain transactional records may be retained as mandated by applicable law.
            </span>
          </label>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary h-11 w-full justify-center text-sm font-semibold shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Submitting Deletion Request...
              </>
            ) : (
              <>
                Submit Data Deletion Request
                <ArrowRight size={15} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
