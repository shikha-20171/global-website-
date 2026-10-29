"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  Layers,
  Globe2,
  Phone,
} from "lucide-react";
import { products, formatPrice, startingPrice } from "@/lib/data";

const steps = [
  { id: 1, name: "Select Product", desc: "Choose your SaaS platform" },
  { id: 2, name: "Create Account", desc: "Administrator credentials" },
  { id: 3, name: "Email Verification", desc: "Verify domain security" },
  { id: 4, name: "Company Setup", desc: "Workspace configuration" },
  { id: 5, name: "Plan Selection", desc: "14-day trial tier" },
];

export default function StartTrialClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.slug || "schooly-core");
  const [account, setAccount] = useState({
    fullName: "",
    businessEmail: "",
    password: "",
  });
  const [otp, setOtp] = useState(["4", "8", "1", "9", "3", "0"]);
  const [company, setCompany] = useState({
    companyName: "",
    phone: "",
    companySize: "11-50 employees",
    country: "United States",
    workspaceSubdomain: "my-company",
  });
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [isProvisioned, setIsProvisioned] = useState(false);

  const activeProduct = products.find((p) => p.slug === selectedProduct) || products[0];

  const handleNext = async (e) => {
    e?.preventDefault();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const { submitContactInquiry } = await import("@/lib/api");
        // Fetch contact inquiry
        await submitContactInquiry({
          name: account.fullName || "Trial Administrator",
          company: company.companyName || "Trial Organization",
          email: account.businessEmail || "trial@organization.com",
          phone: company.phone?.trim() || undefined,
          country: company.country || "United States",
          companySize: company.companySize,
          solution: selectedProduct,
          budget: selectedPlan,
          req: `14-Day Free Enterprise Trial signup for product ${selectedProduct} on subdomain ${company.workspaceSubdomain}.dezoryn.cloud${company.phone?.trim() ? ` (Direct Phone: ${company.phone.trim()})` : ""}`,
          source: "start-trial",
        });
      } catch (err) {
        console.warn("Trial lead submission notice:", err.message);
      }
      setIsProvisioned(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[600px] rounded-full bg-electric/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet/10 blur-[100px]" />

      <div className="container-x relative max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <span>14-DAY ENTERPRISE TRIAL • ZERO CREDIT CARD REQUIRED</span>
          </div>
          <h1 className="h-display text-3xl sm:text-5xl font-extrabold text-white">
            Start Your Free Trial
          </h1>
          <p className="mt-3 text-sm text-cool">
            Experience DEZORYN's intelligent SaaS architecture in a production-ready cloud sandbox.
          </p>
        </div>

        {/* Stepper Wizard Progress */}
        <div className="mb-10 hidden sm:grid grid-cols-5 gap-2 border-b border-line pb-6">
          {steps.map((s) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-semibold transition ${
                    isCompleted
                      ? "bg-emerald-500 text-black"
                      : isActive
                      ? "bg-electric text-white ring-4 ring-electric/20"
                      : "bg-white/5 text-cool border border-line"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? "text-white" : "text-cool"}`}>
                  {s.name}
                </span>
                <span className="text-[10px] text-cool/60 hidden md:block">{s.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Card Stage */}
        <div className="card p-6 sm:p-10 border-white/10 bg-[#070b16]/90 shadow-2xl backdrop-blur-xl">
          {isProvisioned ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="h-display text-2xl sm:text-3xl font-bold text-white">
                Workspace Provisioned Successfully!
              </h2>
              <p className="mt-3 max-w-lg mx-auto text-sm text-cool leading-relaxed">
                Your dedicated multi-tenant instance for <span className="text-white font-semibold">{company.companyName || "Acme Global"}</span> is live on the DEZORYN cloud network.
              </p>

              <div className="mt-6 inline-block rounded-xl border border-white/10 bg-midnight/90 p-4 font-mono text-xs text-electric">
                https://{company.workspaceSubdomain || "workspace"}.dezoryn.cloud
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={`/products/${activeProduct.slug}`}
                  className="btn btn-primary h-11 px-6 text-xs font-medium"
                >
                  Launch SaaS Application
                </Link>
                <Link
                  href="/admin"
                  className="btn btn-secondary h-11 px-6 text-xs font-medium"
                >
                  Manage Admin Settings
                </Link>
              </div>
            </motion.div>
          ) : (
            <div>
              <AnimatePresence mode="wait">
                {/* STEP 1: SELECT PRODUCT */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h2 className="text-lg font-bold text-white mb-2">Step 1: Select Your SaaS Product</h2>
                    <p className="text-xs text-cool mb-6">
                      Choose which DEZORYN platform you wish to deploy for your organization's 14-day evaluation.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 max-h-[380px] overflow-y-auto pr-1">
                      {products.map((p) => {
                        const isSelected = selectedProduct === p.slug;
                        return (
                          <div
                            key={p.slug}
                            onClick={() => setSelectedProduct(p.slug)}
                            className={`cursor-pointer rounded-xl border p-4 transition ${
                              isSelected
                                ? "border-electric bg-electric/10 shadow-[0_0_15px_rgba(47,107,255,0.2)]"
                                : "border-line bg-midnight/60 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                                <span className="text-[11px] font-mono text-cool">{typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "Enterprise") : (p.category || "Enterprise")}</span>
                              </div>
                              <span className="text-xs font-mono text-electric">
                                from {formatPrice(startingPrice(p))}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-cool/90 line-clamp-2 leading-relaxed">
                              {p.tagline || p.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CREATE ACCOUNT */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h2 className="text-lg font-bold text-white mb-2">Step 2: Administrator Credentials</h2>
                    <p className="text-xs text-cool mb-6">
                      Set up your primary administrator account for {activeProduct.name}.
                    </p>

                    <form onSubmit={handleNext} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={account.fullName}
                            onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                            placeholder="Alex Morgan"
                            className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white placeholder-cool/50 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                          <User size={15} className="pointer-events-none absolute right-3.5 top-3 text-cool/60" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-1.5">
                          Corporate Business Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={account.businessEmail}
                            onChange={(e) => setAccount({ ...account, businessEmail: e.target.value })}
                            placeholder="alex@company.com"
                            className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white placeholder-cool/50 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                          />
                          <Mail size={15} className="pointer-events-none absolute right-3.5 top-3 text-cool/60" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-1.5">
                          Create Strong Password
                        </label>
                        <input
                          type="password"
                          required
                          value={account.password}
                          onChange={(e) => setAccount({ ...account, password: e.target.value })}
                          placeholder="At least 8 characters with numbers & symbols"
                          className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white placeholder-cool/50 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                        />
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: EMAIL VERIFICATION */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="max-w-lg"
                  >
                    <h2 className="text-lg font-bold text-white mb-2">Step 3: Verify Corporate Domain</h2>
                    <p className="text-xs text-cool mb-6">
                      A 6-digit confirmation code was dispatched to{" "}
                      <span className="text-white font-mono">{account.businessEmail || "your email"}</span>.
                    </p>

                    <div className="flex gap-2 sm:gap-3 mb-6">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[i] = e.target.value;
                            setOtp(newOtp);
                          }}
                          className="h-12 w-12 rounded-lg border border-line bg-midnight text-center font-mono text-lg font-bold text-white focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                        />
                      ))}
                    </div>

                    <p className="text-xs text-cool">
                      Didn't receive the token?{" "}
                      <button
                        type="button"
                        onClick={() => alert("Verification code re-sent to your business inbox.")}
                        className="text-electric hover:underline font-mono"
                      >
                        Resend Code
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* STEP 4: COMPANY SETUP */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="max-w-lg"
                  >
                    <h2 className="text-lg font-bold text-white mb-2">Step 4: Company &amp; Subdomain Setup</h2>
                    <p className="text-xs text-cool mb-6">
                      Configure your isolated multi-tenant workspace parameter and regional data center.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-1.5">
                          Organization / Legal Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={company.companyName}
                          onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                          placeholder="Global Horizons Enterprise"
                          className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white placeholder-cool/50 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-medium text-white/90 flex items-center gap-1.5">
                            <Phone size={13} className="text-electric" />
                            Direct Contact Phone / WhatsApp Number
                          </label>
                          <span className="text-[10px] font-mono text-cool/70 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            Required for Dispatch
                          </span>
                        </div>
                        <input
                          type="tel"
                          value={company.phone}
                          onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                          placeholder="+1 (555) 321-7654 or +91 98765 43210"
                          className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white placeholder-cool/50 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-white/90 mb-1.5">
                            Company Size
                          </label>
                          <select
                            value={company.companySize}
                            onChange={(e) => setCompany({ ...company, companySize: e.target.value })}
                            className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                          >
                            <option>1-10 employees</option>
                            <option>11-50 employees</option>
                            <option>51-200 employees</option>
                            <option>201-1000 employees</option>
                            <option>1000+ Enterprise</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white/90 mb-1.5">
                            Primary Country
                          </label>
                          <select
                            value={company.country}
                            onChange={(e) => setCompany({ ...company, country: e.target.value })}
                            className="w-full rounded-lg border border-line bg-midnight px-3.5 py-2.5 text-xs text-white focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                          >
                            <option>United States</option>
                            <option>United Kingdom</option>
                            <option>Germany</option>
                            <option>United Arab Emirates</option>
                            <option>Singapore</option>
                            <option>Canada</option>
                            <option>Australia</option>
                            <option>India</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/90 mb-1.5">
                          Preferred Cloud Workspace URL
                        </label>
                        <div className="flex items-center rounded-lg border border-line bg-midnight px-3 py-2 text-xs text-white">
                          <span className="text-cool/70 font-mono">https://</span>
                          <input
                            type="text"
                            value={company.workspaceSubdomain}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                workspaceSubdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                              })
                            }
                            className="flex-1 bg-transparent px-1 font-mono font-bold text-electric focus:outline-none"
                            placeholder="workspace-name"
                          />
                          <span className="text-cool/70 font-mono">.dezoryn.cloud</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: PLAN SELECTION */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h2 className="text-lg font-bold text-white mb-2">Step 5: Select 14-Day Trial Tier</h2>
                    <p className="text-xs text-cool mb-6">
                      You will not be billed during the 14-day trial. Choose the tier that best reflects your team's operational scope.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {(activeProduct.plans || []).map((pl) => {
                        const isSelected = selectedPlan === pl.id;
                        return (
                          <div
                            key={pl.id}
                            onClick={() => setSelectedPlan(pl.id)}
                            className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
                              isSelected
                                ? "border-electric bg-electric/15 shadow-[0_0_20px_rgba(47,107,255,0.25)]"
                                : "border-line bg-midnight/70 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-base">{pl.name}</h3>
                                {pl.highlighted && (
                                  <span className="tag text-[9px] border-electric/40 bg-electric/20 text-electric">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <div className="mt-3 font-mono text-xl font-bold text-white">
                                {pl.enterprise ? "Custom" : `$${pl.monthly_price_usd}/mo`}
                              </div>
                              <p className="mt-1 text-xs text-cool">{pl.for}</p>

                              <ul className="mt-4 space-y-2 text-[11px] text-cool/90">
                                {pl.features.map((feat, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <CheckCircle2 size={13} className="text-electric shrink-0" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-line text-center">
                              <span className={`text-xs font-mono font-medium ${isSelected ? "text-electric" : "text-cool"}`}>
                                {isSelected ? "✓ Selected for Trial" : "Select Tier"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-line">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cool hover:text-white transition"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary h-11 px-6 text-xs font-medium inline-flex items-center gap-2"
                >
                  <span>{currentStep === 5 ? "Deploy Workspace Instance" : "Proceed to Next Step"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-cool/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-electric" />
            <span>SOC 2 Type II Audited Architecture</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 size={14} className="text-electric" />
            <span>Multi-Region AWS &amp; GCP Data Residency</span>
          </span>
        </div>
      </div>
    </div>
  );
}
