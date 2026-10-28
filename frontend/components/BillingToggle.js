"use client";
import { motion } from "framer-motion";
import { ANNUAL_DISCOUNT } from "@/lib/data";

export default function BillingToggle({ cycle, setCycle }) {
  const discountPercent = Math.round(ANNUAL_DISCOUNT * 100);
  return (
    <div role="radiogroup" aria-label="Billing cycle" className="relative inline-flex max-w-full rounded-xl border border-line bg-graphite p-1">
      <button
        role="radio"
        aria-checked={cycle === "monthly"}
        onClick={() => setCycle("monthly")}
        className="relative z-10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap"
      >
        {cycle === "monthly" && (
          <motion.span
            layoutId="billing-pill"
            className="absolute inset-0 -z-10 rounded-lg bg-electric"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <span className={cycle === "monthly" ? "text-white" : "text-cool"}>Monthly</span>
      </button>

      <button
        role="radio"
        aria-checked={cycle === "annual"}
        onClick={() => setCycle("annual")}
        className="relative z-10 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap"
      >
        {cycle === "annual" && (
          <motion.span
            layoutId="billing-pill"
            className="absolute inset-0 -z-10 rounded-lg bg-electric"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <span className={cycle === "annual" ? "text-white" : "text-cool"}>
          <span className="hidden xs:inline">Annual — Save {discountPercent}%</span>
          <span className="xs:hidden">Annual -{discountPercent}%</span>
        </span>
      </button>
    </div>
  );
}

