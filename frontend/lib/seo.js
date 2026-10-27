// Centralized SEO and Structured Data Utilities for DEZORYN TECHNOLOGY

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.dezoryn.com";
export const SITE_NAME = "DEZORYN TECHNOLOGY";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = "@dezoryn";

// Build standardized Next.js page metadata
export function buildMetadata({
  title,
  description,
  path = "",
  keywords = [],
  openGraph = {},
  twitter = {},
  robots,
  alternates = {},
}) {
  const canonical = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;

  const defaultRobots = {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };

  const finalTitle = title.includes("DEZORYN")
    ? title
    : `${title} | ${SITE_NAME}`;

  return {
    title: finalTitle,
    description,
    keywords: keywords.length > 0 ? keywords : [
      "Enterprise SaaS",
      "Cloud ERP Software",
      "AI Automation Platforms",
      "Multi-Tenant Architecture",
      "Custom Enterprise Software",
      "DEZORYN TECHNOLOGY",
    ],
    authors: [{ name: "DEZORYN TECHNOLOGY", url: SITE_URL }],
    creator: "DEZORYN TECHNOLOGY",
    publisher: "DEZORYN TECHNOLOGY",
    alternates: {
      canonical,
      ...alternates,
    },
    robots: robots !== undefined ? robots : defaultRobots,
    openGraph: {
      title: finalTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: openGraph.image || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} — DEZORYN TECHNOLOGY`,
        },
      ],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: [twitter.image || openGraph.image || DEFAULT_OG_IMAGE],
      ...twitter,
    },
  };
}

// Generate Organization JSON-LD Schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "DEZORYN TECHNOLOGY",
    legalName: "DEZORYN TECHNOLOGY PRIVATE LIMITED",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Global technology company engineering specialized SaaS platforms, enterprise software, and AI automation systems.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Prajapati Complex, Kolar Road",
        addressLocality: "Bhopal",
        addressRegion: "Madhya Pradesh",
        postalCode: "462042",
        addressCountry: "IN",
      },
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@dezoryn.com",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@dezoryn.com",
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      "https://linkedin.com/company/dezoryn",
      "https://twitter.com/dezoryn",
      "https://github.com/dezoryn",
    ],
  };
}

// Generate WebSite JSON-LD Schema with SearchAction
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "DEZORYN TECHNOLOGY",
    description: "Technology That Moves Businesses Forward — Enterprise SaaS & Cloud Platforms",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/marketplace/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Generate BreadcrumbList JSON-LD Schema
export function generateBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

// Generate SoftwareApplication JSON-LD Schema
export function generateSoftwareApplicationSchema(product) {
  if (!product) return null;
  const price = product.plans?.[0]?.monthly_price_usd || product.plans?.[0]?.price || 29;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    headline: product.tagline,
    description: product.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cloud, Web, iOS, Android",
    url: `${SITE_URL}/products/${product.slug}`,
    image: product.image ? (product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`) : DEFAULT_OG_IMAGE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "52",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    featureList: Array.isArray(product.features)
      ? product.features.map((f) => (typeof f === "string" ? f : f.title)).filter(Boolean).join(", ")
      : undefined,
  };
}

// Generate Service or Solution JSON-LD Schema
export function generateServiceSchema(solution) {
  if (!solution) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.title || solution.name,
    serviceType: "Enterprise Cloud Software Architecture & Engineering",
    description: solution.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    url: `${SITE_URL}/solutions/${solution.slug}`,
  };
}

// Generate Article JSON-LD Schema for Blog Posts
export function generateArticleSchema(post) {
  if (!post) return null;
  const authorName = typeof post.author === "string" ? post.author : (post.author?.name || "DEZORYN Engineering Team");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date || "2026-10-14T00:00:00Z",
    dateModified: post.date || "2026-10-14T00:00:00Z",
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

// Generate FAQPage JSON-LD Schema
export function generateFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q || f.question || f.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a || f.answer || f.desc || f.description,
      },
    })),
  };
}

// Generate ItemList JSON-LD Schema
export function generateItemListSchema(name, items = [], url = "") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name || item.title,
      url: item.url ? (item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`) : undefined,
    })),
  };
}

// Generate ContactPage JSON-LD Schema
export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DEZORYN TECHNOLOGY",
    url: `${SITE_URL}/contact`,
    description: "Connect with DEZORYN enterprise software specialists, solutions architects, and customer success teams.",
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

// Generate AboutPage JSON-LD Schema
export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About DEZORYN TECHNOLOGY",
    url: `${SITE_URL}/company`,
    description: "Corporate background, engineering philosophy, executive leadership, and mission statement of DEZORYN TECHNOLOGY.",
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}
