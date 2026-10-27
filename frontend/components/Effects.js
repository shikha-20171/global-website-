"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** Global high-performance effects: top scroll-progress bar + GPU-cached ambient glow */
export default function Effects() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.2 });

  return (
    <>
      {/* Top scroll-progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-electric via-violet to-[#9db8ff] will-change-transform"
        aria-hidden="true"
      />

      {/* GPU-cached static ambient glow (zero repaint lag, 60fps scrolling) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-60"
        style={{
          background: "radial-gradient(800px 500px at 15% 15%, rgba(47, 107, 255, 0.08), transparent 70%), radial-gradient(700px 500px at 85% 55%, rgba(124, 92, 255, 0.06), transparent 70%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
