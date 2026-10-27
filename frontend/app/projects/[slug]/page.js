import { projects } from "@/lib/data";
import ProjectDetailView from "@/components/ProjectDetailView";
import { getLiveProjects, getLiveProjectBySlug } from "@/lib/api";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  try {
    // Fetch all project slugs
    const live = await getLiveProjects();
    if (Array.isArray(live) && live.length > 0) {
      return live.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {}
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  let p = null;
  try {
    // Fetch project metadata
    p = await getLiveProjectBySlug(params.slug);
  } catch (err) {}
  if (!p) {
    p = projects.find((x) => x.slug === params.slug);
  }
  return p
    ? buildMetadata({
        title: `${p.name} — Technical Architecture & Specifications | DEZORYN`,
        description: `Production implementation specifications, system architecture, database schema, and delivery milestones for ${p.name}.`,
        path: `/projects/${params.slug}`,
        keywords: [
          p.name,
          `${p.name} architecture`,
          "enterprise software specifications",
          "cloud database design",
          "DEZORYN portfolio",
        ],
      })
    : {};
}

export default async function ProjectDetailPage({ params }) {
  let project = null;
  try {
    // Fetch project details by slug
    project = await getLiveProjectBySlug(params.slug);
  } catch (err) {}
  if (!project) {
    project = projects.find((x) => x.slug === params.slug);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: project?.name || "Project Specs", url: `/projects/${params.slug}` },
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
