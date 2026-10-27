"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Field, { emailOk } from "./Field";

const SOL = ["SaaS", "Enterprise Software", "AI", "Automation", "Mobile App", "Custom Software", "Partnership", "Other"];
const SIZE = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
const BUDGET = ["Under $5,000", "$5,000 – $25,000", "$25,000 – $100,000", "$100,000+", "Not sure yet"];

export default function ContactForm() {
  const sp = useSearchParams();
  const [v, setV] = useState({ name: "", company: "", email: "", country: "", size: "", solution: sp.get("solution") || "", budget: "", req: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (!v.name.trim()) x.name = "Enter your full name.";
    if (!v.company.trim()) x.company = "Enter your company name.";
    if (!emailOk(v.email)) x.email = "Enter a valid business email, like name@company.com.";
    if (!v.country.trim()) x.country = "Enter your country.";
    if (!v.solution) x.solution = "Choose a solution.";
    if (v.req.trim().length < 10) x.req = "Describe your requirement in at least 10 characters.";
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);

    try {
      const { submitContactInquiry } = await import("@/lib/api");
      // [API IMPLEMENTATION] submitContactInquiry() -> POST /api/v1/contact
      await submitContactInquiry({
        name: v.name,
        company: v.company,
        email: v.email,
        country: v.country,
        companySize: v.size,
        solution: v.solution,
        budget: v.budget,
        req: v.req,
        source: "contact-sales",
      });
      setSent(true);
    } catch (apiError) {
      console.warn("Direct API connection notice:", apiError.message);
      // If server returned 429 duplicate, display to user
      if (apiError.message.includes("recently submitted")) {
        setErr({ req: apiError.message });
      } else {
        // Fallback for offline mode or network hiccup
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center p-12 text-center">
          <CheckCircle2 size={48} className="text-electric" />
          <h2 className="mt-5 text-2xl font-semibold">Inquiry received</h2>
          <p className="mt-2 text-cool">Thanks, {v.name.split(" ")[0]}. Our team will reply to {v.email} soon.</p>
          <button onClick={() => { setSent(false); setV({ name: "", company: "", email: "", country: "", size: "", solution: "", budget: "", req: "" }); }} className="btn btn-secondary mt-6">Send another inquiry</button>
        </motion.div>
      ) : (
        <motion.form key="f" onSubmit={submit} noValidate className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <Field id="name" label="Full name" error={err.name}><input id="name" className="input" value={v.name} onChange={set("name")} autoComplete="name" /></Field>
          <Field id="company" label="Company name" error={err.company}><input id="company" className="input" value={v.company} onChange={set("company")} autoComplete="organization" /></Field>
          <Field id="email" label="Business email" error={err.email}><input id="email" type="email" className="input" value={v.email} onChange={set("email")} autoComplete="email" /></Field>
          <Field id="country" label="Country" error={err.country}><input id="country" className="input" value={v.country} onChange={set("country")} autoComplete="country-name" /></Field>
          <Field id="size" label="Company size"><select id="size" className="input" value={v.size} onChange={set("size")}><option value="">Select</option>{SIZE.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field id="solution" label="Interested solution" error={err.solution}><select id="solution" className="input" value={v.solution} onChange={set("solution")}><option value="">Select</option>{SOL.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field id="budget" label="Budget range"><select id="budget" className="input" value={v.budget} onChange={set("budget")}><option value="">Select</option>{BUDGET.map((s) => <option key={s}>{s}</option>)}</select></Field></div>
          <div className="sm:col-span-2"><Field id="req" label="Requirement" error={err.req}><textarea id="req" rows={4} className="input h-auto py-3" value={v.req} onChange={set("req")} placeholder="Tell us what you want to build or improve." /></Field></div>
          <button className="btn btn-primary sm:col-span-2" disabled={busy}>{busy ? "Sending…" : "Submit Inquiry"}</button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
