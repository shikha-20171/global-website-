"use client";
import { motion } from "framer-motion";
export default function FooterMark() {
  return (
    <div className="pointer-events-none mt-10 select-none overflow-hidden" aria-hidden="true">
      <div className="flex justify-center text-[17vw] font-semibold leading-[0.85] tracking-tighter">
        {"DEZORYN".split("").map((c, i) => (
          <motion.span key={i} initial={{ y: "100%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-b from-white/25 via-electric/20 to-transparent bg-clip-text text-transparent">{c}</motion.span>
        ))}
      </div>
    </div>
  );
}
