import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ProductArt from "@/components/ProductArt";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { projects } from "@/lib/data";
import { caseStudiesDetails } from "@/lib/caseStudiesData";
import { ArrowUpRight, Building2, Clock, ShieldCheck } from "lucide-react";
import { getLiveCaseStudies } from "@/lib/api";

import { buildMetadata, generateBreadcrumbSchema, generateItemListSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Case Studies & Customer Success Stories | DEZORYN",
  description:
    "Explore how DEZORYN's enterprise software and SaaS platforms solve real-world problems for education institutions, healthcare providers, real estate builders, and logistics networks.",
  path: "/case-studies",
  keywords: [
    "enterprise software case studies",
    "SaaS customer stories",
    "education software implementation",
    "hospital management case study",
    "DEZORYN results",
  ],
});

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  let liveProjects = projects;
  try {
    // Fetch case studies
    const data = await getLiveCaseStudies();
    const list = data?.caseStudies || (Array.isArray(data) ? data : null);
    if (Array.isArray(list) && list.length > 0) {
      const merged = projects.map((proj) => {
        const match = list.find((d) => d.slug === proj.slug);
        if (!match) return proj;
        return {
          ...proj,
          ...match,
          name: match.title || proj.name,
          result: match.summary || match.results || proj.result,
          tech: Array.isArray(match.tech) && match.tech.length > 0 ? match.tech : (proj.tech || ["Next.js", "PostgreSQL"]),
        };
      });

      // Include any new case studies added via admin that aren't in baseline projects
      const newItems = list
        .filter((d) => !projects.some((p) => p.slug === d.slug))
        .map((d) => ({
          name: d.title || "Enterprise Implementation",
          slug: d.slug,
          industry: d.industry || "Enterprise SaaS",
          type: d.type || "Case Study",
          result: d.summary || d.results || "Operational scale and efficiency achieved.",
          tech: Array.isArray(d.tech) && d.tech.length > 0 ? d.tech : ["Next.js", "PostgreSQL"],
          hue: 220,
        }));

      liveProjects = [...merged, ...newItems];
    }
  } catch (err) {
    console.warn("Case studies live notice:", err.message);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: "Case Studies", url: "/case-studies" },
  ]);

  const caseStudiesSchema = generateItemListSchema(
    "DEZORYN Case Studies & Customer Success Stories",
    liveProjects.map((p) => ({
      name: p.name,
      url: `/case-studies/${p.slug}`,
    })),
    "/case-studies"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesSchema) }}
      />
      <section className="relative pb-24 pt-32 overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/3 h-[500px] w-[600px] rounded-full bg-electric/10 blur-[130px]" />

        <div className="container-x relative">
          <Breadcrumb items={[{ label: "Portfolio", href: "/portfolio" }, { label: "Case Studies" }]} />
          
          <div className="max-w-5xl mt-6">
            <span className="text-xs font-mono text-electric uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShieldCheck size={14} /> Real-World Success Stories
            </span>
            <h1 className="h-display text-4xl sm:text-6xl text-white font-extrabold">
              Case Studies &amp; <span className="text-gradient-blue">Customer Stories</span>
            </h1>
            <p className="lead mt-4 text-cool text-base sm:text-lg leading-relaxed">
              Read how our software helps schools, hospitals, real estate companies, and businesses automate daily tasks, eliminate paperwork, and get measurable results.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveProjects.map((p, i) => {
              const details = caseStudiesDetails[p.slug];

              return (
                <Reveal key={p.slug} delay={i * 0.04}>
                  <Link
                    href={`/case-studies/${p.slug}`}
                    className="group card card-hover flex h-full flex-col justify-between overflow-hidden p-5 border-white/10 bg-[#070b16] hover:border-electric/40 transition-all duration-300"
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1b] border border-white/10 shadow-xl mb-4">
                        {p.image ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                          </div>
                        ) : (
                          <ProductArt hue={p.hue} compact className="h-48 transition-transform duration-500 group-hover:scale-105" />
                        )}
                        <span className="absolute top-3 left-3 tag bg-midnight/90 backdrop-blur-md border border-white/10 font-mono text-[10px]">
                          {p.industry}
                        </span>
                        <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                          Verified Story
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-electric mb-1.5">
                        <span>{p.type}</span>
                        {details?.timeline && (
                          <span className="text-[11px] text-cool/70 flex items-center gap-1">
                            <Clock size={11} /> {details.timeline.split(" ")[0]} {details.timeline.split(" ")[1]}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-white leading-snug group-hover:text-electric transition-colors">
                        {p.name}
                      </h2>

                      {details?.clientScale && (
                        <div className="mt-2 text-[11px] font-mono text-white/70 line-clamp-1 flex items-center gap-1.5">
                          <Building2 size={12} className="text-electric shrink-0" />
                          <span>{details.clientScale}</span>
                        </div>
                      )}

                      <p className="mt-2.5 text-xs text-cool leading-relaxed line-clamp-3">
                        {details?.overview || p.result}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 flex items-center justify-between text-xs text-cool border-t border-line/60">
                      <div className="flex gap-1.5 flex-wrap">
                        {(p.tech || ["Next.js", "PostgreSQL"]).slice(0, 2).map((t) => (
                          <span key={t} className="rounded border border-line bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/80">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-electric font-medium text-xs group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Improve Your Daily Operations?"
        text="Tell us what your business needs, and our team will show you how our software makes your daily work simple and efficient."
        primary={["Talk to an Expert", "/contact"]}
        secondary={["Explore Software Products", "/marketplace"]}
      />
    </>
  );
}
