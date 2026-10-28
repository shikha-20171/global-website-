import Link from "next/link";
import Button from "@/components/Button";
import Reveal, { TextReveal } from "@/components/Reveal";
import AnimatedHeroTitle from "@/components/AnimatedHeroTitle";
import HeroStage from "@/components/HeroStage";
import FeaturedRail from "@/components/FeaturedRail";
import Bento from "@/components/Bento";
import HomeIndustries from "@/components/HomeIndustries";
import WhyChoose from "@/components/WhyChoose";
import GlobalPresence from "@/components/GlobalPresence";
import HomeCareers from "@/components/HomeCareers";
import HomeFAQ from "@/components/HomeFAQ";
import CTASection from "@/components/CTASection";
import { products } from "@/lib/data";
import { getLivePage, getLiveProducts } from "@/lib/api";
import { buildMetadata, generateFAQSchema, generateItemListSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  let seoTitle = "Enterprise SaaS Platforms, Cloud Architecture & AI Automation | DEZORYN TECHNOLOGY";
  let seoDesc =
    "DEZORYN TECHNOLOGY engineers production-tested SaaS platforms, multi-tenant cloud software, and AI automation systems built for business scalability worldwide.";
  let canonical = "/";

  try {
    // Fetch page
    const livePage = await getLivePage("home");
    if (livePage) {
      if (livePage.seoTitle) seoTitle = livePage.seoTitle;
      if (livePage.metaDescription) seoDesc = livePage.metaDescription;
      if (livePage.canonicalUrl) canonical = livePage.canonicalUrl;
    }
  } catch (e) {
    // Fallback to defaults
  }

  return buildMetadata({
    title: seoTitle,
    description: seoDesc,
    path: canonical,
    keywords: [
      "Enterprise SaaS Platforms",
      "Cloud Architecture",
      "AI Automation",
      "Multi-Tenant ERP Software",
      "B2B Software Development",
      "DEZORYN TECHNOLOGY",
    ],
  });
}

export default async function Home() {
  let heroHeadline = "Technology That Moves Businesses Forward.";
  let heroSubheadline =
    "We build software products, enterprise platforms, and digital solutions that help businesses simplify operations, improve efficiency, and grow.";
  let primaryCta = ["Explore Products", "/marketplace"];
  let secondaryCta = ["Talk to an Expert", "/contact"];
  let railProducts = products.slice(0, 4);

  try {
    // Fetch page
    const [pageRes, productsRes] = await Promise.allSettled([
      getLivePage("home"),
      getLiveProducts(),
    ]);

    if (pageRes.status === "fulfilled" && pageRes.value?.sections) {
      const hero = pageRes.value.sections.find(
        (s) => s.sectionKey === "sec_hero" || s.name?.toLowerCase().includes("hero")
      );
      if (hero) {
        if (hero.headline) heroHeadline = hero.headline;
        if (hero.subheadline) heroSubheadline = hero.subheadline;
        if (hero.settings?.primaryCtaLabel) {
          primaryCta = [hero.settings.primaryCtaLabel, hero.settings.primaryCtaUrl || "/marketplace"];
        }
        if (hero.settings?.secondaryCtaLabel) {
          secondaryCta = [hero.settings.secondaryCtaLabel, hero.settings.secondaryCtaUrl || "/contact"];
        }
      }
    }

    if (
      productsRes.status === "fulfilled" &&
      Array.isArray(productsRes.value) &&
      productsRes.value.length > 0
    ) {
      const featuredItems = productsRes.value.filter((p) => p.isFeatured || p.featured);
      railProducts = featuredItems.length > 0 ? featuredItems.slice(0, 4) : productsRes.value.slice(0, 4);
    }
  } catch (err) {
    // Fallback to baseline
  }

  const homeFaqSchema = generateFAQSchema([
    {
      q: "What services does DEZORYN Technology provide?",
      a: "DEZORYN Technology designs and builds ready-to-deploy software products, bespoke enterprise software, AI and workflow automation tools, and responsive web and mobile applications tailored to help organizations streamline operations.",
    },
    {
      q: "Can you build custom software for our business?",
      a: "Yes. In addition to our core SaaS platforms, we build custom business software platforms tailored around your unique organizational workflows, administrative approval hierarchies, and specific data requirements.",
    },
    {
      q: "Which industries do you serve?",
      a: "We develop solutions across education, healthcare, real estate, residential communities, manufacturing, and retail sectors, addressing domain-specific operational challenges in each area.",
    },
    {
      q: "Can you integrate with existing systems?",
      a: "Yes. Our applications can connect with your existing databases, third-party software tools, payment providers, and communication channels using standard REST APIs, webhooks, and secure authentication mechanisms.",
    },
    {
      q: "What ongoing maintenance, updates, and SLAs does DEZORYN provide?",
      a: "All DEZORYN deployments include guaranteed 99.99% uptime SLAs, automated daily cloud backups, continuous security updates, and 24/7 priority technical support with dedicated engineers.",
    },
  ]);

  const featuredProductsSchema = generateItemListSchema(
    "Featured DEZORYN SaaS Software",
    railProducts.map((p) => ({
      name: p.name,
      url: `/products/${p.slug}`,
    })),
    "/"
  );

  return (
    <>
      {homeFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
        />
      )}
      {featuredProductsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredProductsSchema) }}
        />
      )}
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[600px] rounded-full bg-electric/15 blur-[90px]" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[360px] w-[360px] rounded-full bg-violet/15 blur-[90px]" />

        <div className="container-x relative grid items-center gap-8 pb-16 lg:py-8 lg:grid-cols-[1fr_1.05fr] xl:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1 text-xs text-cool">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
              <span>SOFTWARE PRODUCTS &amp; ENTERPRISE PLATFORMS</span>
            </div>

            <h1 className="h-display text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-7xl leading-[1.08] break-words">
              <AnimatedHeroTitle text={heroHeadline} />
            </h1>

            <Reveal delay={0.4}>
              <p className="lead mt-6 max-w-xl text-base sm:text-lg text-cool/90 leading-relaxed">
                {heroSubheadline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={primaryCta[1]} arrow>
                  {primaryCta[0]}
                </Button>
                <Button href={secondaryCta[1]} variant="secondary" arrow>
                  {secondaryCta[0]}
                </Button>
              </div>
            </Reveal>
          </div>

          <HeroStage />
        </div>
      </section>

      {/* ─── 2. TECHNOLOGY SOLUTIONS FOR MODERN BUSINESSES ─── */}
      <Bento />

      {/* ─── 3. FEATURED PRODUCTS ─── */}
      <section className="bg-midnight/60">
        <FeaturedRail items={railProducts} />
      </section>

      {/* ─── 4. INDUSTRIES WE SERVE ─── */}
      <HomeIndustries />

      {/* ─── 5. WHY CHOOSE DEZORYN (4 Spotlight Capability Cards) ─── */}
      <WhyChoose />

      {/* ─── 6. ENGINEERING WHAT'S NEXT (3D Flipping Architecture Cards) ─── */}
      <GlobalPresence />

      {/* ─── 7. CAREERS & ENGINEERING CULTURE ─── */}
      <HomeCareers />

      {/* ─── 8. FAQS ─── */}
      <div id="faq">
        <HomeFAQ />
      </div>

      {/* ─── 8. FINAL HOMEPAGE CTA ─── */}
      <CTASection
        title="Ready to Move Your Business Forward?"
        text="Tell us about your business goals, book a free live demo, or explore our software products today."
        primary={["Talk to an Expert", "/contact"]}
        secondary={["Explore Software Products", "/marketplace"]}
      />
    </>
  );
}
