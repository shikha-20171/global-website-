"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => <div className="skeleton aspect-square w-full rounded-full" />,
});

/**
 * 3D Rotating Globe Hero Stage
 * Clean stage with all 6 key points rotating seamlessly inside the 3D globe
 */
export default function HeroStage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const gx = useTransform(mx, (v) => v * -12);
  const gy = useTransform(my, (v) => v * -12);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[380px] xs:max-w-[440px] sm:max-w-[500px] lg:max-w-[520px] xl:max-w-[660px]"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Soft atmospheric blue glow under the globe matching card sapphire blue */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[220px] sm:h-[280px] w-[340px] sm:w-[560px] rounded-full bg-[#1d4ed8]/25 blur-[90px]" />

      {/* 3D Rotating Globe with all 6 key points rotating inside */}
      <motion.div
        style={{ x: gx, y: gy }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        {mounted ? (
          <Globe className="h-full w-full" />
        ) : (
          <div className="skeleton aspect-square w-full rounded-full" />
        )}
      </motion.div>
    </div>
  );
}
