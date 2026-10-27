"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon from "./Icon";
import Heading from "./Heading";
import Button from "./Button";

const ENRICHED_INDUSTRIES = [
  {
    slug: "education",
    name: "Education & Academics",
    tag: "Campus ERP",
    icon: "GraduationCap",
    description: "End-to-end campus automation for student admissions, fee collections, academic timetables, and parent portals.",
    highlight: "Admissions • Fees • Academics",
  },
  {
    slug: "real-estate",
    name: "Real Estate & Builders",
    tag: "Property Sales",
    icon: "Building2",
    description: "Interactive unit inventory matrix, site visit scheduling, channel partner broker portals, and milestone demand notes.",
    highlight: "Inventory • CRM • Bookings",
  },
  {
    slug: "residential-communities",
    name: "Residential Communities",
    tag: "Community OS",
    icon: "Home",
    description: "Smart gate visitor passes, automated maintenance dues billing, resident complaint helpdesk, and community app.",
    highlight: "Gate Security • Dues • Helpdesk",
  },
  {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    tag: "Clinical ERP",
    icon: "HeartPulse",
    description: "Digital OPD/IPD queues, electronic health records (EHR), pharmacy batch stock, and diagnostic lab integration.",
    highlight: "OPD/IPD • EHR • Pharmacy",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Plants",
    tag: "Smart Factory",
    icon: "Factory",
    description: "Plant inventory tracking, predictive machine maintenance schedules, and real-time shift workforce rosters.",
    highlight: "Plant Floor • Stock • Roster",
  },
  {
    slug: "retail",
    name: "Retail & Multi-Store",
    tag: "Omnichannel POS",
    icon: "ShoppingBag",
    description: "Unified multi-location inventory sync, fast barcode POS, automated supplier reordering, and customer loyalty.",
    highlight: "Multi-Store • POS • Stock Sync",
  },
  {
    slug: "finance",
    name: "Finance & Accounting",
    tag: "Fintech Systems",
    icon: "Landmark",
    description: "Automated double-entry ledgers, smart invoice reconciliation, online payment links, and audit-ready reports.",
    highlight: "Ledgers • Invoicing • Audits",
  },
  {
    slug: "hospitality",
    name: "Hospitality & Resorts",
    tag: "Guest Operations",
    icon: "ConciergeBell",
    description: "Front-desk reservations, housekeeping room turnovers, restaurant billing POS, and automated service requests.",
    highlight: "Front Desk • Rooms • Dining",
  },
  {
    slug: "logistics",
    name: "Logistics & Freight",
    tag: "Supply Chain",
    icon: "Truck",
    description: "Real-time fleet tracking, automated warehouse dispatch, digital delivery receipts, and freight cost billing.",
    highlight: "Fleet GPS • Dispatch • Warehousing",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    tag: "Client Operations",
    icon: "Briefcase",
    description: "Client project boards, consultant time-tracking, retainer billing contracts, and centralized team workflows.",
    highlight: "Project CRM • Billing • Timesheets",
  },
];

export default function HomeIndustries() {
  return (
    <section className="section bg-midnight/70 border-t border-line relative overflow-hidden py-14 sm:py-20">
      {/* Ambient electric blue atmospheric glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[400px] w-[450px] rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-[400px] w-[450px] rounded-full bg-cyan-400/20 blur-[100px]" />
      <div className="pointer-events-none absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-[220px] bg-gradient-to-r from-blue-600/25 via-sky-400/20 to-blue-500/25 blur-[90px]" />

      <div className="container-x relative">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#1e40af]/30 px-3 py-1 text-[11px] font-mono text-[#bfdbfe] shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_#60a5fa] animate-pulse" />
              <span>SECTORS &amp; DOMAINS</span>
            </div>
            <Heading className="h-section max-w-xl">
              Industries We Serve
            </Heading>
            <p className="mt-3 text-base sm:text-lg text-cool/90 max-w-xl leading-relaxed">
              Purpose-built software platforms engineered to digitize operations and scale workflows across key industry domains.
            </p>
          </div>
          <Button href="/industries" variant="secondary" arrow>
            Explore All Industries
          </Button>
        </div>
      </div>

      {/* ─── SINGLE CONTINUOUS ONE-WAY FLOWING LINE OF PREMIUM INDUSTRY CARDS ─── */}
      <div className="relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <div
          className="flex w-max animate-marquee gap-5 sm:gap-6 py-4 hover:[animation-play-state:paused]"
          style={{ animationDuration: "38s" }}
        >
          {[...ENRICHED_INDUSTRIES, ...ENRICHED_INDUSTRIES].map((ind, idx) => (
            <div
              key={`${ind.slug}-${idx}`}
              className="w-[280px] sm:w-[315px] flex-shrink-0"
            >
              <Link
                href={`/industries/${ind.slug}`}
                className="group relative flex h-[180px] sm:h-[190px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#070b16] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-2 hover:border-[#60a5fa] hover:shadow-[0_16px_40px_rgba(37,99,235,0.45)]"
              >
                {/* ─── ANDAR THODA BLUE (Subtle Inner Blue Radial Glow) ─── */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.25)_0%,rgba(14,39,107,0.15)_40%,transparent_75%)] transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -top-10 -left-10 h-36 w-36 rounded-full bg-[#2563eb]/25 blur-2xl transition-all duration-500 group-hover:bg-[#3b82f6]/45 group-hover:scale-130" />

                {/* ─── DIAGONAL LIGHT SHEEN SWEEP ON HOVER ─── */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent z-20" />

                {/* ─── BLUE KA SIDE MAI ANIMATION (Glowing & Pulsing Left Edge Beam) ─── */}
                <div className="pointer-events-none absolute left-0 inset-y-0 w-[3px] bg-gradient-to-b from-transparent via-[#60a5fa] to-transparent opacity-80 group-hover:opacity-100 shadow-[0_0_15px_#3b82f6] transition-opacity duration-300" />
                <div className="pointer-events-none absolute left-0 top-2 h-12 w-[3px] bg-white shadow-[0_0_12px_#60a5fa] animate-pulse" />

                {/* Top subtle highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#60a5fa]/60 to-transparent group-hover:via-[#60a5fa] group-hover:h-[2px] shadow-[0_0_10px_#60a5fa] transition-all" />

                {/* Card Top: Icon + Title + Sector Pill + Arrow */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 group-hover:border-[#60a5fa]/30 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-[#3b82f6]/40 bg-[#1e40af]/30 text-[#60a5fa] shadow-[0_0_12px_rgba(37,99,235,0.35)] transition-all duration-300 group-hover:bg-[#2563eb] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] shrink-0">
                        <Icon name={ind.icon} size={16} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-tight group-hover:text-[#bfdbfe] transition-colors truncate">
                          {ind.name}
                        </h3>
                        <span className="inline-block text-[9.5px] font-mono text-[#93c5fd]/90">
                          {ind.tag}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="text-[#93c5fd] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0"
                    />
                  </div>

                  {/* High-Impact Realistic Solution Description */}
                  <p className="mt-2.5 text-[11px] sm:text-[11.5px] text-[#cbd5e1]/85 leading-relaxed line-clamp-2 group-hover:text-white/95 transition-colors">
                    {ind.description}
                  </p>
                </div>

                {/* Card Footer: Domain Pillars & Explore Link */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono pt-2.5 border-t border-white/10 group-hover:border-[#60a5fa]/25 transition-colors">
                  <span className="text-[#93c5fd] text-[9.5px] flex items-center gap-1 truncate max-w-[190px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] shrink-0 shadow-[0_0_6px_#60a5fa] animate-ping" />
                    <span className="truncate ml-1">{ind.highlight}</span>
                  </span>
                  <span className="text-[#60a5fa] font-semibold group-hover:text-white group-hover:translate-x-1 transition-all text-[11px] flex items-center gap-0.5 shrink-0">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
