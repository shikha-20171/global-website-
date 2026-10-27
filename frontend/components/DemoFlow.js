"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2 } from "lucide-react";
import Field, { emailOk } from "./Field";
import { products } from "@/lib/data";

const steps = ["Product", "Company", "Requirement", "Meeting time", "Confirmation"];
const slots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });

export default function DemoFlow() {
  const sp = useSearchParams();
  const trial = sp.get("type") === "trial";
  const [step, setStep] = useState(sp.get("product") ? 1 : 0);
  const [v, setV] = useState({ product: sp.get("product") || "", name: "", company: "", email: "", country: "", req: "", day: "", slot: "" });
  const [err, setErr] = useState({});
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value ?? e }));
  const pick = (k, val) => setV((s) => ({ ...s, [k]: val }));

  const next = async () => {
    const x = {};
    if (step === 0 && !v.product) x.product = "Choose a product to continue.";
    if (step === 1) { if (!v.name.trim()) x.name = "Enter your name."; if (!v.company.trim()) x.company = "Enter your company."; if (!emailOk(v.email)) x.email = "Enter a valid business email."; if (!v.country.trim()) x.country = "Enter your country."; }
    if (step === 3 && (!v.day || !v.slot)) x.slot = "Pick a day and a time.";
    setErr(x);
    if (Object.keys(x).length) return;

    if (step === 3) {
      try {
        const { submitDemoRequest } = await import("@/lib/api");
        // [API IMPLEMENTATION] submitDemoRequest() -> POST /api/v1/demo
        await submitDemoRequest({
          contactName: v.name,
          company: v.company,
          businessEmail: v.email,
          country: v.country,
          productSlug: v.product || "schooly-core",
          preferredDate: v.day || "Tomorrow",
          preferredTime: v.slot || "14:00",
          notes: v.req || undefined,
        });
      } catch (err) {
        console.warn("Live Demo API dispatch notice:", err.message);
      }
    }
    setStep(step + 1);
  };
  const prod = products.find((p) => p.slug === v.product);

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-8 flex items-center justify-between gap-1" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs transition ${i < step ? "bg-electric" : i === step ? "border border-electric text-electric" : "border border-line text-cool"}`} aria-current={i === step ? "step" : undefined}>{i < step ? <Check size={14} /> : i + 1}</span>
            <span className={`hidden text-xs sm:block ${i === step ? "text-white" : "text-cool"}`}>{s}</span>
            {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-electric" : "bg-line"}`} />}
          </li>
        ))}
      </ol>
      <div className="card overflow-hidden p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
            {step === 0 && (<>
              <h2 className="text-xl font-semibold">Which product are you interested in?</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {products.map((p) => <button key={p.slug} onClick={() => pick("product", p.slug)} aria-pressed={v.product === p.slug} className={`rounded-lg border p-3 text-left text-sm transition ${v.product === p.slug ? "border-electric bg-electric/10" : "border-line hover:border-white/25"}`}><div className="font-medium">{p.name}</div><div className="text-xs text-cool">{typeof p.category === "object" && p.category !== null ? (p.category.name || p.category.slug || "Enterprise") : (p.category || "Enterprise")}</div></button>)}
              </div>
              {err.product && <p role="alert" className="mt-3 text-xs text-red-400">{err.product}</p>}
            </>)}
            {step === 1 && (<>
              <h2 className="text-xl font-semibold">Company information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="d-name" label="Full name" error={err.name}><input id="d-name" className="input" value={v.name} onChange={set("name")} /></Field>
                <Field id="d-company" label="Company" error={err.company}><input id="d-company" className="input" value={v.company} onChange={set("company")} /></Field>
                <Field id="d-email" label="Business email" error={err.email}><input id="d-email" type="email" className="input" value={v.email} onChange={set("email")} /></Field>
                <Field id="d-country" label="Country" error={err.country}><input id="d-country" className="input" value={v.country} onChange={set("country")} /></Field>
              </div>
            </>)}
            {step === 2 && (<>
              <h2 className="text-xl font-semibold">What do you want to achieve?</h2>
              <textarea rows={5} className="input mt-5 h-auto py-3" placeholder="Optional — tell us about your team, goals or current tools." value={v.req} onChange={set("req")} aria-label="Requirement" />
            </>)}
            {step === 3 && (<>
              <h2 className="text-xl font-semibold">Preferred meeting time</h2>
              <div className="mt-5 flex flex-wrap gap-2">{days.map((d) => { const k = d.toDateString(); return <button key={k} onClick={() => pick("day", k)} aria-pressed={v.day === k} className={`rounded-lg border px-4 py-2 text-sm ${v.day === k ? "border-electric bg-electric/10" : "border-line text-cool hover:text-white"}`}>{d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</button>; })}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{slots.map((s) => <button key={s} onClick={() => pick("slot", s)} aria-pressed={v.slot === s} className={`rounded-lg border py-2 text-sm ${v.slot === s ? "border-electric bg-electric/10" : "border-line text-cool hover:text-white"}`}>{s}</button>)}</div>
              {err.slot && <p role="alert" className="mt-3 text-xs text-red-400">{err.slot}</p>}
            </>)}
            {step === 4 && (
              <div className="py-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="inline-block"><CheckCircle2 size={56} className="text-electric" /></motion.div>
                <h2 className="mt-5 text-2xl font-semibold">{trial ? "Trial request received" : "Demo booked"}</h2>
                <p className="mx-auto mt-2 max-w-sm text-cool">{prod?.name} · {v.day} at {v.slot}. We'll email {v.email} with details.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {step < 4 && (
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn btn-secondary disabled:invisible">Back</button>
            <button onClick={next} className="btn btn-primary">{step === 3 ? (trial ? "Start Trial" : "Confirm Booking") : "Continue"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
