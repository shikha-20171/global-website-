"use client";
import { motion } from "framer-motion";
import { ANNUAL_DISCOUNT } from "@/lib/data";

export default function BillingToggle({ cycle, setCycle }) {
  const opts = [["monthly", "Monthly"], ["annual", `Annual — Save ${ANNUAL_DISCOUNT * 100}%`]];
  return (
    <div role="radiogroup" aria-label="Billing cycle" className="relative inline-flex max-w-full rounded-xl border border-line bg-graphite p-1">
      {opts.map(([v, l]) => (
        <button key={v} role="radio" aria-checked={cycle === v} onClick={() => setCycle(v)} className="relative z-10 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap">
          {cycle === v && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-10 rounded-lg bg-electric" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span className={cycle === v ? "text-white" : "text-cool"}>{l}</span>
        </button>
      ))}
    </div>
  );
}
