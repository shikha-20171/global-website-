"use client";
import { motion } from "framer-motion";

/** Rolling-digit number: "$79" → "$63" rolls each digit like a mechanical counter */
export default function Odometer({ value, className = "" }) {
  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-label={value}>
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1]" aria-hidden="true">
            <motion.span className="flex flex-col" animate={{ y: `${-Number(ch) * 1.1}em` }} transition={{ type: "spring", stiffness: 140, damping: 18 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <span key={d} className="block h-[1.1em] leading-[1.1]">{d}</span>)}
            </motion.span>
          </span>
        ) : <span key={i} aria-hidden="true" className="leading-[1.1]">{ch}</span>
      )}
    </span>
  );
}
