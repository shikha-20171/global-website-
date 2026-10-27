"use client";

import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Reveal from "./Reveal";
import Button from "./Button";
import Heading from "./Heading";

export default function HomeCareers() {
  return (
    <section id="careers" className="section border-t border-line bg-midnight/80 relative overflow-hidden py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[450px] w-[500px] rounded-full bg-blue-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-30 left-10 h-[350px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="container-x relative z-10 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#09122b]/80 via-[#070b19] to-[#040711] p-8 sm:p-12 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Top subtle blue laser beam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent shadow-[0_0_15px_#3b82f6]" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>CAREERS AT DEZORYN • WORK FROM OFFICE</span>
              </div>

              <Heading className="h-section text-white font-exo">
                Join Our Engineering Team in Bhopal
              </Heading>

              <Reveal delay={0.1}>
                <p className="mt-4 text-base sm:text-lg text-cool/90 leading-relaxed">
                  We are actively hiring exceptional software engineers, systems architects, and product designers to engineer world-class enterprise SaaS platforms on-site at our corporate headquarters in Bhopal.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                    <MapPin size={14} className="text-blue-400" />
                    <span>Bhopal HQ (Work From Office)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                    <Building2 size={14} className="text-emerald-400" />
                    <span>Full-Time On-Site Roles</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                    <ShieldCheck size={14} className="text-amber-400" />
                    <span>Direct Architecture Ownership</span>
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end justify-center gap-3">
              <Button href="/careers" arrow className="w-full sm:w-auto text-sm px-6 py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                View Open Roles
              </Button>
              <span className="text-[11px] font-mono text-cool/70">
                Managed in real-time via Admin Console
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
