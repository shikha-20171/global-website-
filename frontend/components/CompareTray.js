"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCompare, MAX_COMPARE } from "./CompareContext";
import { getProduct } from "@/lib/data";

export default function CompareTray() {
  const { ids, toggle, clear } = useCompare();
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-40 mx-auto flex max-w-xl items-center gap-2.5 sm:gap-3 rounded-2xl border border-line bg-graphite/95 p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl sm:bottom-5">
          <div className="flex flex-1 flex-wrap gap-1.5">
            {ids.map((id) => (
              <span key={id} className="flex items-center gap-1 rounded-md bg-electric/15 py-1 pl-2.5 pr-1.5 text-xs text-[#b9ccff]">
                {getProduct(id).name}
                <button onClick={() => toggle(id)} aria-label={`Remove ${getProduct(id).name}`} className="rounded p-0.5 hover:bg-white/10"><X size={12} /></button>
              </span>
            ))}
            <span className="self-center text-xs text-cool">{ids.length}/{MAX_COMPARE}</span>
          </div>
          <button onClick={clear} className="text-xs text-cool hover:text-white">Clear</button>
          <Link href="/compare" className={`btn btn-primary h-9 px-4 text-[13px] ${ids.length < 2 ? "pointer-events-none opacity-50" : ""}`} aria-disabled={ids.length < 2}>Compare</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
