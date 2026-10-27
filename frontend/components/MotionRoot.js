"use client";
import { MotionConfig } from "framer-motion";
/** Makes every framer-motion animation honour the OS "reduce motion" setting */
export default function MotionRoot({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
