import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ProductArt from "@/components/ProductArt";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { posts, getPost } from "@/lib/data";
import api from "@/lib/axios";
import { buildMetadata, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Zap,
  BookmarkCheck,
  Terminal,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    // Direct Axios call for blog slugs
    const res = await api.get("/api/v1/resources/blog");
    const live = res.data?.data || res.data?.posts || (Array.isArray(res.data) ? res.data : null);
    if (Array.isArray(live) && live.length > 0) {
      return live.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {}
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  let live = null;
  try {
    // Direct Axios call for blog metadata
    const res = await api.get(`/api/v1/resources/blog/${params.slug}`);
    live = res.data?.data || res.data?.post || res.data;
  } catch (err) {}

  const p = live ? { ...getPost(params.slug), ...live } : getPost(params.slug);
  if (!p) {
    return buildMetadata({
      title: "Blog Post | DEZORYN",
      path: `/blog/${params.slug}`,
    });
  }

  const title = p.seoTitle || `${p.title} | DEZORYN Engineering & Architecture`;
  const description = p.seoDescription || p.summary;

  return buildMetadata({
    title,
    description,
    path: `/blog/${params.slug}`,
    keywords: [
      p.cat || "Software Architecture",
      "cloud computing",
      "enterprise software",
      "DEZORYN engineering",
    ],
  });
}

export default async function BlogPostPage({ params }) {
  let p = null;
  try {
    // Direct Axios call inside Blog slug page
    const res = await api.get(`/api/v1/resources/blog/${params.slug}`);
    const live = res.data?.data || res.data?.post || res.data;
    if (live) {
      p = {
        ...getPost(params.slug),
        ...live,
      };
    }
  } catch (err) {
  }
  if (!p) p = getPost(params.slug);
  if (!p) notFound();

  const authorName = typeof p.author === "string" ? p.author : (p.author?.name || "DEZORYN Engineering");
  const otherPosts = posts.filter((x) => x.slug !== p.slug).slice(0, 3);

  const articleSchema = generateArticleSchema(p);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: p.title, url: `/blog/${params.slug}` },
  ]);

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <article className="pb-28 pt-32">
        <div className="container-x max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Insights & Blueprints", href: "/resources" },
              { label: p.title },
            ]}
          />

          {/* ─── ARTICLE HEADER ─── */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-cool mb-4 font-mono">
              <span className="tag border-electric/40 bg-electric/10 text-electric font-medium">
                {p.cat} Blueprint
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-electric" /> {p.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-electric" /> {p.read} read
              </span>
              <span className="flex items-center gap-1">
                <User size={13} className="text-electric" /> {p.author}
              </span>
            </div>

            <h1 className="h-display text-3xl sm:text-5xl lg:text-6xl text-white leading-tight">
              {p.title}
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-cool leading-relaxed font-normal border-l-2 border-electric pl-5">
              {p.summary}
            </p>
          </div>

          {/* ─── FEATURED HERO IMAGE ─── */}
          <div className="my-10 relative overflow-hidden rounded-2xl border border-white/10 bg-midnight shadow-2xl shadow-black/80">
            <ProductArt
              hue={220}
              variant={1}
              image={p.image}
              title={p.title}
              className="h-64 sm:h-96 w-full"
            />
          </div>

          {/* ─── KEY ARCHITECTURAL TAKEAWAYS ─── */}
          {p.takeaways && p.takeaways.length > 0 && (
            <Reveal>
              <div className="my-10 rounded-xl border border-electric/40 bg-gradient-to-br from-electric/10 via-[#070e24] to-[#040a1a] p-6 sm:p-8 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric/20 text-electric">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#9db8ff]">
                    Executive Summary &amp; Key Architectural Takeaways
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-cool/95">
                  {p.takeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-electric flex-shrink-0" />
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* ─── TECHNICAL BLUEPRINT BOX (If available) ─── */}
          {p.blueprint && (
            <Reveal delay={0.05}>
              <div className="my-10 rounded-xl border border-white/10 bg-[#070b16] p-6 font-mono text-xs text-cool shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-electric" />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-electric">
                      Technical Specification: {p.blueprint.type}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                    Verified Schema
                  </span>
                </div>
                <div className="mt-3.5 rounded-lg bg-black/60 p-4 border border-white/5 text-[#c4d6ff] leading-relaxed break-words">
                  <code>{p.blueprint.spec}</code>
                </div>
              </div>
            </Reveal>
          )}

          {/* ─── MAIN ARTICLE SECTIONS ─── */}
          <div className="space-y-12 text-white/90">
            {p.sections && p.sections.length > 0 ? (
              p.sections.map((sec, idx) => (
                <Reveal key={idx} delay={idx * 0.04}>
                  <section className="space-y-4 rounded-xl border border-white/5 bg-[#070b16]/40 p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-mono text-electric">
                      <span className="h-6 w-6 rounded-full bg-electric/15 flex items-center justify-center text-[11px]">
                        0{idx + 1}
                      </span>
                      <span className="uppercase tracking-wider">SECTION ARCHITECTURE</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                      {sec.heading}
                    </h2>
                    <div className="text-base sm:text-lg text-cool leading-relaxed font-normal space-y-4">
                      {sec.text ? (
                        sec.text.split("\n\n").map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed text-cool/90">
                            {para}
                          </p>
                        ))
                      ) : (
                        <p className="leading-relaxed text-cool/90">{sec.content || ""}</p>
                      )}
                    </div>
                  </section>
                </Reveal>
              ))
            ) : p.content ? (
              <section className="space-y-6 rounded-xl border border-white/5 bg-[#070b16]/40 p-6 sm:p-8 text-base sm:text-lg text-cool leading-relaxed">
                {p.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="leading-relaxed text-cool/90">
                    {para}
                  </p>
                ))}
              </section>
            ) : null}
          </div>

          {/* ─── IMPLEMENTATION CHECKLIST ─── */}
          {p.checklist && p.checklist.length > 0 && (
            <Reveal delay={0.08}>
              <div className="my-12 rounded-xl border border-white/10 bg-[#070b16] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                  <BookmarkCheck size={18} className="text-emerald-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                    Production Implementation Checklist
                  </span>
                </div>
                <div className="space-y-3">
                  {p.checklist.map((item, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs sm:text-sm text-cool"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={cIdx < 2}
                        className="rounded border-white/20 bg-midnight accent-electric h-4 w-4"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ─── AUTHOR BIO & NAVIGATION ─── */}
          <div className="mt-14 border-t border-line pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-electric/20 border border-electric/40 flex items-center justify-center font-bold text-electric">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-cool font-mono">Published by</div>
                <div className="font-semibold text-white text-sm">{authorName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/resources" className="btn btn-secondary h-10 px-4 text-xs font-mono">
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/demo" className="btn btn-primary h-10 px-4 text-xs font-mono">
                Book Architecture Demo
              </Link>
            </div>
          </div>

          {/* ─── RELATED BLUEPRINTS ─── */}
          {otherPosts.length > 0 && (
            <div className="mt-20 border-t border-line pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-mono text-electric uppercase tracking-wider">
                    Extended Knowledge Base
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Related Blueprints &amp; Architecture
                  </h3>
                </div>
                <Link
                  href="/resources"
                  className="text-xs font-mono text-electric hover:underline hidden sm:inline-flex items-center gap-1"
                >
                  View All Resources <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {otherPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group card card-hover flex flex-col justify-between overflow-hidden p-2.5 border-white/10 bg-[#070b16] transition-all duration-300 hover:border-electric/40 hover:-translate-y-1.5"
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <ProductArt
                          hue={220}
                          variant={1}
                          compact
                          image={post.image}
                          title={post.title}
                          className="h-32 transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 tag bg-midnight/90 text-[9px] font-mono border border-white/10">
                          {post.cat}
                        </span>
                      </div>
                      <div className="px-1.5">
                        <div className="text-[10px] font-mono text-cool/70 mb-1">
                          {post.read} read
                        </div>
                        <h4 className="font-bold text-white text-xs group-hover:text-electric transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                    <div className="mt-4 px-1.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-electric">
                      <span>Read Blueprint</span>
                      <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTASection
        title="Need Custom Architectural Engineering?"
        text="DEZORYN solutions architects will review your multi-tenant database requirements, API integrations, and security boundary benchmarks."
        primary={["Talk to Solutions Architect", "/contact-sales"]}
        secondary={["Explore Marketplace", "/marketplace"]}
      />
    </>
  );
}
