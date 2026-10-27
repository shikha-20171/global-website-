"use client";
import { motion } from "framer-motion";

/** Section heading: words slide up out of a mask with dual-tone white + electric blue styling */
export default function Heading({ children, as = "h2", className = "h-section", delay = 0 }) {
  const Tag = motion[as] || motion.h2;

  if (typeof children !== "string") {
    return (
      <Tag
        className={`text-white ${className}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Tag>
    );
  }

  const words = children.trim().split(/\s+/);
  // Highlight the ending 1-2 words in vibrant radiant electric blue
  const highlightCount = words.length >= 5 ? 2 : 1;
  const splitIndex = Math.max(1, words.length - highlightCount);

  return (
    <Tag
      className={className}
      initial="h"
      whileInView="v"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      aria-label={children}
    >
      {words.map((w, i) => {
        const isHighlight = i >= splitIndex;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden="true">
            <motion.span
              className={`inline-block ${
                isHighlight
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 font-extrabold filter drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                  : "text-white"
              }`}
              variants={{
                h: { y: "115%", opacity: 0 },
                v: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
