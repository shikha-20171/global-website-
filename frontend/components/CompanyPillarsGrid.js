"use client";

import { useState, useEffect } from "react";
import Reveal from "@/components/Reveal";
import { Target, Eye, Gem } from "lucide-react";

const ICON_MAP = {
  "Our Mission": Target,
  "Our Vision": Eye,
  "Our Values": Gem,
};

export default function CompanyPillarsGrid({ initialPillars = [] }) {
  const [pillars, setPillars] = useState(initialPillars);

  useEffect(() => {
    try {
      const local = localStorage.getItem("dezoryn_company_pillars");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPillars((prev) =>
            prev.map((p) => {
              const match = parsed.find(
                (item) =>
                  item.id === p.tag?.toLowerCase() ||
                  item.title?.toLowerCase() === p.title?.toLowerCase()
              );
              if (match?.statement) {
                return { ...p, desc: match.statement };
              }
              return p;
            })
          );
        }
      }
    } catch (_) {}
  }, []);

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {pillars.map((p, idx) => {
        const IconComponent = p.icon || ICON_MAP[p.title] || Target;
        return (
          <Reveal key={p.title} delay={idx * 0.08}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#070b16]/95 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-sky-400/50 hover:shadow-[0_25px_60px_rgba(56,189,248,0.22)]">
              {/* Top Animated Laser Border Beam */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_15px_#38bdf8]" />

              {/* Inner glowing radial sweep */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${p.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] ${p.accent}`}
                  >
                    <IconComponent size={22} />
                  </span>
                  <span className="tag text-[10.5px] font-mono border-white/15 bg-white/5">
                    {p.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white transition-colors duration-300 group-hover:text-sky-300">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-cool leading-relaxed whitespace-pre-line">
                  {p.desc}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

