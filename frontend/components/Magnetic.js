"use client";

/** Clean button wrapper without distracting spring drags */
export default function Magnetic({ children, className = "" }) {
  return <div className={`inline-block ${className}`}>{children}</div>;
}
