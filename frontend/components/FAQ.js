"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const DEFAULT_FAQS = [
  ["What deployment options are supported for this platform?", "This platform is available as multi-tenant cloud SaaS, hybrid cloud, or dedicated virtual private cloud (VPC) deployments."],
  ["Does this platform include role-based access control (RBAC)?", "Yes, granular role-based permissions, audit logging, and zero-trust authentication are included natively."],
  ["How is organizational data partitioned?", "Tenant data is cryptographically separated at the database layer with Row-Level Security (RLS) and encrypted backups."],
  ["What SLAs and support tiers are provided?", "Production tiers include 99.99% uptime availability SLAs, automated daily backups, and 24/7 technical support."],
];

export default function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  const faqList = Array.isArray(items) && items.length > 0 ? items : DEFAULT_FAQS;

  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-graphite/60">
      {faqList.map(([q, a], i) => (
        <div key={q}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:text-[#9db8ff]">
            {q}
            <Plus size={18} className={`shrink-0 transition-transform duration-300 ${open === i ? "rotate-45 text-electric" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-cool">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
