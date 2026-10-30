import Link from "next/link";
import ProductArt from "@/components/ProductArt";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { posts } from "@/lib/data";
import { ArrowUpRight, BookOpen } from "lucide-react";
import api from "@/lib/axios";

import { buildMetadata, generateBreadcrumbSchema, generateItemListSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Engineering & Architecture Blog | DEZORYN",
  description:
    "Official insights on multi-tenant cloud software architectures, enterprise AI automation, PostgreSQL security, and scalable SaaS engineering from DEZORYN.",
  path: "/blog",
  keywords: [
    "enterprise software blog",
    "cloud architecture insights",
    "SaaS engineering blog",
    "AI automation articles",
    "DEZORYN technology blog",
  ],
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let livePosts = posts;
  try {
    // Direct Axios API call inside Blog page
    const res = await api.get("/api/v1/resources/blog");
    const list = res.data?.data || res.data?.posts || (Array.isArray(res.data) ? res.data : null);
    if (Array.isArray(list) && list.length > 0) {
      livePosts = list;
    }
  } catch (err) {
    console.warn("Using baseline blog posts:", err?.message || err);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "Blog", url: "/blog" },
  ]);

  const blogListSchema = generateItemListSchema(
    "DEZORYN Technology Articles",
    livePosts.map((p) => ({
      name: p.title,
      url: `/blog/${p.slug}`,
    })),
    "/blog"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <section className="pb-28 pt-32">
      <div className="container-x">
        <Breadcrumb items={[{ label: "Resources", href: "/resources" }, { label: "Blog" }]} />
        <div className="max-w-5xl mt-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs text-[#9db8ff]">
            <BookOpen size={13} className="text-electric" />
            <span>DEZORYN Engineering &amp; Strategy Blog</span>
          </div>
          <h1 className="h-display text-4xl sm:text-6xl">Blog &amp; Thought Leadership</h1>
          <p className="lead mt-4">
            In-depth perspectives on modern multi-tenant cloud systems, enterprise automation, and AI workflows.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {livePosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${p.slug}`}
                className="group card card-hover flex h-full flex-col overflow-hidden p-2.5 transition-all duration-300 hover:border-electric/40 hover:shadow-xl hover:shadow-electric/10 hover:-translate-y-1.5"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <ProductArt
                    hue={200 + i * 35}
                    variant={i}
                    compact
                    image={p.image}
                    title={p.title}
                    className="h-48 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 tag bg-midnight/90 backdrop-blur-md border border-white/15 text-white font-mono text-[10px]">
                    {p.cat}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="text-[11px] font-mono text-cool/80 mb-2">{p.date} · {p.read} read</div>
                  <h2 className="text-lg font-bold leading-snug group-hover:text-electric transition-colors line-clamp-2">{p.title}</h2>
                  <p className="mt-2 text-xs text-cool/90 line-clamp-3 leading-relaxed">{p.summary}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-cool border-t border-line/60">
                    <span className="text-[11px] font-mono text-cool/80">{p.author}</span>
                    <span className="inline-flex items-center gap-1 text-electric font-medium transition-transform duration-300 group-hover:translate-x-1">
                      Read article <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <CTASection
          title="Want to Read Our Complete Technical Architecture?"
          text="Explore detailed multi-tenant database models, security runbooks, and RESTful developer APIs in our documentation portal."
          primary={["Read Platform Documentation", "/resources/docs"]}
          secondary={["Explore Developer APIs", "/resources/api"]}
        />
      </div>
    </section>
  </>
);
}
