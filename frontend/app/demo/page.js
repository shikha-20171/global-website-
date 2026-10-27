import { Suspense } from "react";
import DemoFlow from "@/components/DemoFlow";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book an Interactive Enterprise Product Demo | DEZORYN",
  description:
    "Schedule a guided live walk-through with DEZORYN engineers or launch a hands-on sandbox environment across any of our cloud SaaS platforms.",
  path: "/demo",
  keywords: [
    "book software demo",
    "SaaS product walkthrough",
    "interactive enterprise demo",
    "DEZORYN trial",
  ],
});

export default function DemoPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Book a Demo", url: "/demo" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="pb-28 pt-32">
        <div className="container-x">
          <Breadcrumb items={[{ label: "Book a Demo" }]} />
          <div className="mb-10 text-center mt-6">
            <h1 className="h-display text-4xl sm:text-5xl">See It In Action.</h1>
            <p className="lead mt-3">Book an interactive demo or test a live sandbox environment in minutes.</p>
          </div>
          <Suspense fallback={<div className="skeleton mx-auto h-96 max-w-2xl rounded-xl" />}>
            <DemoFlow />
          </Suspense>
        </div>
      </section>
    </>
  );
}
