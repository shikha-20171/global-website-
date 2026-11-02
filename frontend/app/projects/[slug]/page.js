import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import ProjectDetailView from "@/components/ProjectDetailView";
import api from "@/lib/axios";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const safeSlug = params?.slug;
  if (!safeSlug) return {};

  let live = null;
  try {
    const res = await api.get(`/api/v1/projects/${safeSlug}`);
    const data = res.data?.data || res.data?.project || res.data;
    if (data && typeof data === "object" && (data.name || data.slug)) {
      live = data;
    }
  } catch (err) {}

  const matchedStatic = projects.find((x) => x.slug === safeSlug) || {};
  const p = {
    ...matchedStatic,
    ...(live || {}),
    name: live?.name || live?.title || matchedStatic.name || safeSlug,
  };

  return buildMetadata({
    title: `${p.name} — Technical Architecture & Specifications | DEZORYN`,
    description: `Production implementation specifications, system architecture, database schema, and delivery milestones for ${p.name}.`,
    path: `/projects/${safeSlug}`,
    keywords: [
      p.name,
      `${p.name} architecture`,
      "enterprise software specifications",
      "cloud database design",
      "DEZORYN portfolio",
    ],
  });
}

export default async function ProjectDetailPage({ params }) {
  const safeSlug = params?.slug;
  let rawProject = null;
  try {
    const res = await api.get(`/api/v1/projects/${safeSlug}`);
    const data = res.data?.data || res.data?.project || res.data;
    if (data && typeof data === "object" && (data.name || data.slug)) {
      rawProject = data;
    }
  } catch (err) {}

  const matchedStatic = projects.find((x) => x.slug === safeSlug);
  if (!rawProject && !matchedStatic) {
    notFound();
  }

  const project = {
    ...(matchedStatic || {}),
    ...(rawProject || {}),
    slug: safeSlug,
    name: rawProject?.name || rawProject?.title || matchedStatic?.name || "Enterprise Project",
    industry: rawProject?.industry || rawProject?.category || matchedStatic?.industry || "Enterprise",
    type: rawProject?.type || rawProject?.category || matchedStatic?.type || "SaaS",
    result: rawProject?.result || rawProject?.shortDescription || rawProject?.summary || matchedStatic?.result || "Enterprise software architecture and cloud infrastructure deployment.",
    tech: Array.isArray(rawProject?.techStack)
      ? rawProject.techStack
      : Array.isArray(rawProject?.tech)
      ? rawProject.tech
      : Array.isArray(matchedStatic?.tech)
      ? matchedStatic.tech
      : ["Next.js", "Node.js", "Cloud Architecture"],
    image: rawProject?.featuredImage || rawProject?.image || matchedStatic?.image,
    hue: rawProject?.hue ?? matchedStatic?.hue ?? 210,
    product: rawProject?.product || matchedStatic?.product,
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: project.name, url: `/projects/${safeSlug}` },
  ]);

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ProjectDetailView params={params} initialProject={project} />
    </>
  );
}
