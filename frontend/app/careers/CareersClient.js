"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Code2,
  Shield,
  ChevronRight,
  Zap,
} from "lucide-react";
import JobApplicationModal from "./components/JobApplicationModal";
import api from "@/lib/axios";

const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Senior Full-Stack Cloud Architect",
    dept: "Core Engineering",
    type: "Full-Time",
    location: "Bhopal, India (Work From Office)",
    experience: "5+ Years",
    desc: "Architect and scale multi-tenant SaaS engines, high-concurrency microservices, and PostgreSQL-backed data schemas.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Zero-Trust"],
  },
  {
    id: "job-2",
    title: "Enterprise Solutions Engineer",
    dept: "Solutions & Architecture",
    type: "Full-Time",
    location: "Bhopal, India (Work From Office)",
    experience: "3+ Years",
    desc: "Conduct technical architecture discoveries, enterprise POCs, and high-level client consultations for global organizations.",
    tags: ["Cloud Architecture", "Client Discovery", "API Design", "Security"],
  },
  {
    id: "job-3",
    title: "AI & Machine Learning Systems Engineer",
    dept: "AI & Automation",
    type: "Full-Time",
    location: "Bhopal, India (Work From Office)",
    experience: "3+ Years",
    desc: "Design and implement autonomous workflow agents, vision-based verification models, and intelligent document triage pipelines.",
    tags: ["Python", "PyTorch", "LLMs", "Vector DBs", "Automation"],
  },
  {
    id: "job-4",
    title: "Senior Enterprise Product Designer",
    dept: "Product & Design",
    type: "Full-Time",
    location: "Bhopal, India (Work From Office)",
    experience: "4+ Years",
    desc: "Craft high-density SaaS dashboards, unified design systems, and friction-free enterprise admin workflows.",
    tags: ["Figma", "Design Systems", "UX Research", "Complex Dashboards"],
  },
  {
    id: "job-5",
    title: "Lead Cloud DevOps & Security Engineer",
    dept: "Core Engineering",
    type: "Full-Time",
    location: "Bhopal, India (Work From Office)",
    experience: "4+ Years",
    desc: "Maintain multi-region edge deployments, automated CI/CD pipelines, zero-trust RBAC controls, and SOC-2 standard compliances.",
    tags: ["AWS", "Cloudflare", "Kubernetes", "Terraform", "Zero-Trust"],
  },
];

const VALUES = [
  {
    icon: Code2,
    title: "Architectural Craftsmanship",
    desc: "We write clean, disciplined code built to scale rather than patching brittle quick fixes.",
  },
  {
    icon: Sparkles,
    title: "Zero Bloat & High Speed",
    desc: "Every line of code and UI component has a distinct purpose for speed and productivity.",
  },
  {
    icon: Shield,
    title: "Radical Ownership",
    desc: "Engineers own their modules from architectural specification to production deployment.",
  },
  {
    icon: Zap,
    title: "High Performance & Global Scale",
    desc: "Delivering production-grade SaaS architecture and mission-critical cloud software to businesses worldwide.",
  },
];

export default function CareersClient() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [selectedDept, setSelectedDept] = useState("All");
  const [activeJobForModal, setActiveJobForModal] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Direct Axios API call inside CareersClient
    api.get("/api/v1/careers")
      .then((res) => {
        const data = res.data?.data || res.data;
        const list = data?.careers || (Array.isArray(data) ? data : null);
        if (mounted && Array.isArray(list) && list.length > 0) {
          const mapped = list.map((j) => ({
            id: j.id,
            title: j.title,
            dept: j.department,
            type: j.employmentType === "FULL_TIME" ? "Full-Time" : (j.employmentType || "Full-Time"),
            location: j.location && !j.location.toLowerCase().includes("remote") ? j.location : "Bhopal, India (Work From Office)",
            experience: j.experienceLevel || "3+ Years",
            desc: j.description,
            tags: Array.isArray(j.requirements) ? j.requirements.slice(0, 5) : ["Bhopal HQ", "Global SaaS"],
          }));
          setJobs(mapped);
        }
      })
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.dept)))];

  const filteredJobs =
    selectedDept === "All"
      ? jobs
      : jobs.filter((j) => j.dept === selectedDept);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-36 pb-20 border-b border-line">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-electric/10 blur-[130px]" />

        <div className="container-x relative z-10">
          <Breadcrumb
            items={[
              { label: "Company", href: "/company" },
              { label: "Careers & Openings" },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-5">
              <Sparkles size={13} className="animate-pulse" />
              <span>WE ARE HIRING TALENT</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white tracking-tight">
              Build High-Performance Enterprise SaaS{" "}
              <span className="text-gradient-blue">
                At Global Scale.
              </span>
            </h1>

            <p className="lead mt-6 text-cool text-lg leading-relaxed max-w-2xl">
              Join an engineering-driven technology organization building mission-critical software products and digital infrastructure for modern businesses worldwide.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-cool/90">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-graphite/60">
                <MapPin size={14} className="text-electric" /> Bhopal Headquarters &amp; Remote
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-graphite/60">
                <Briefcase size={14} className="text-electric" /> 5 Open Positions
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-graphite/60">
                <Zap size={14} className="text-electric" /> Full-Time &amp; Enterprise Track
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CULTURE & VALUES ─── */}
      <section className="section bg-midnight/50 border-b border-line relative">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Engineering Culture
            </span>
            <h2 className="h-section mt-2 text-white">How We Build &amp; Work</h2>
            <p className="lead mt-3 text-cool">
              We cultivate a culture of high autonomy, deep architectural rigor, and direct impact.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <Reveal key={val.title} delay={idx * 0.08}>
                  <div className="group relative rounded-2xl border border-white/10 bg-[#070b16] p-6 h-full transition-all duration-300 hover:border-electric/40 hover:-translate-y-1">
                    <div className="h-10 w-10 rounded-xl bg-electric/15 text-electric flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{val.title}</h3>
                    <p className="text-xs text-cool leading-relaxed">{val.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── OPEN POSITIONS ─── */}
      <section className="section bg-midnight relative">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Current Opportunities
              </span>
              <h2 className="h-section mt-2 text-white">Open Roles &amp; Engineering Tracks</h2>
              <p className="lead mt-2 text-cool text-sm">
                Explore open positions and apply directly to our core technology team.
              </p>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${selectedDept === dept
                      ? "bg-electric text-white shadow-md shadow-electric/25"
                      : "bg-graphite/60 text-cool hover:text-white border border-line"
                    }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job, idx) => (
              <Reveal key={job.id} delay={idx * 0.05}>
                <div className="group relative rounded-2xl border border-white/10 bg-[#070b16] p-6 sm:p-7 transition-all duration-300 hover:border-electric/40 hover:bg-[#080f22] hover:shadow-[0_15px_35px_-10px_rgba(47,107,255,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-electric/15 text-electric text-[11px] font-mono font-semibold">
                        {job.dept}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-cool">
                        <MapPin size={12} className="text-electric" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-cool">
                        <Clock size={12} className="text-electric" /> {job.type}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Exp: {job.experience}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#9db8ff] transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-cool leading-relaxed">
                      {job.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => setActiveJobForModal(job)}
                      className="px-5 py-2.5 rounded-xl bg-electric text-white text-xs font-semibold hover:bg-electric/90 shadow-md shadow-electric/25 transition flex items-center gap-2"
                    >
                      <span>Apply For Position</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Direct Email Application Note */}
          <div className="mt-12 rounded-2xl border border-line bg-graphite/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">
                Don’t see your exact role listed?
              </div>
              <p className="text-xs text-cool mt-1">
                We are always excited to connect with outstanding software engineers, distributed systems developers, and UI specialists.
              </p>
            </div>
            <a
              href="mailto:careers@dezoryn.com?subject=Direct Engineering Inquiry"
              className="px-4 py-2 rounded-lg border border-line bg-graphite hover:border-electric text-white text-xs font-mono font-medium transition shrink-0"
            >
              careers@dezoryn.com
            </a>
          </div>
        </div>
      </section>

      {/* ─── APPLICATION MODAL ─── */}
      <JobApplicationModal
        job={activeJobForModal}
        onClose={() => setActiveJobForModal(null)}
      />

      {/* ─── BOTTOM CTA ─── */}
      <CTASection
        primary={["Discuss Your Project", "/contact"]}
        secondary={["Book a Demo", "/demo"]}
        title="Looking for Enterprise Software Solutions?"
        text="Discover how DEZORYN's specialized SaaS platforms and engineering services can modernize your operations."
      />
    </>
  );
}
