import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import MotionRoot from "@/components/MotionRoot";
import Intro from "@/components/Intro";
import CompareTray from "@/components/CompareTray";
import { CompareProvider } from "@/components/CompareContext";
import ScrollToTop from "@/components/ScrollToTop";

import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DEZORYN TECHNOLOGY — Enterprise SaaS, Software Platforms & AI Solutions",
    template: "%s | DEZORYN TECHNOLOGY",
  },
  description:
    "DEZORYN TECHNOLOGY engineers production-tested SaaS platforms, multi-tenant cloud software, and AI automation systems built for business scalability worldwide.",
  keywords: [
    "Enterprise SaaS",
    "Cloud ERP Software",
    "AI Automation Platforms",
    "Multi-Tenant Architecture",
    "Custom Enterprise Software",
    "DEZORYN TECHNOLOGY",
    "Bhopal Tech Headquarters",
  ],
  authors: [{ name: "DEZORYN TECHNOLOGY", url: SITE_URL }],
  creator: "DEZORYN TECHNOLOGY",
  publisher: "DEZORYN TECHNOLOGY",
  robots: {
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
  },
  openGraph: {
    title: "DEZORYN TECHNOLOGY — Enterprise SaaS & Cloud Platforms",
    description:
      "Intelligent SaaS platforms, multi-tenant cloud systems, and AI automation designed for global business scalability.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "DEZORYN TECHNOLOGY — Technology That Moves Businesses Forward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEZORYN TECHNOLOGY — Enterprise SaaS & Cloud Platforms",
    description:
      "Intelligent SaaS platforms, multi-tenant cloud systems, and AI automation designed for global business scalability.",
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body>
        <MotionRoot>
        <CompareProvider>
          <ScrollToTop />
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-electric focus:px-3 focus:py-2">Skip to content</a>
          <Intro />
          <Effects />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CompareTray />
        </CompareProvider>
        </MotionRoot>
      </body>
    </html>
  );
}
