"use client";
import { motion } from "framer-motion";

/**
 * Minimal, refined scroll reveal.
 * Subtle 12px glide-in that triggers naturally as sections enter the viewport on any page.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 12,
  className = "",
  as = "div",
  random = true,
}) {
  const M = motion[as] || motion.div;

  const jitter = random ? ((Math.sin(delay * 99 + 1) + 1) * 0.03) : 0;
  const finalDelay = delay + jitter;

  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.42,
        delay: finalDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </M>
  );
}

/** Minimal, elegant text reveal */
export function TextReveal({ text, className = "", delay = 0 }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
}
