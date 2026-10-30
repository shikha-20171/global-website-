import { projects } from "@/lib/data";
import ProjectDetailView from "@/components/ProjectDetailView";
import api from "@/lib/axios";
import { buildMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  try {
    // Direct Axios call for project slugs
    const res = await api.get("/api/v1/projects");
    const live = res.data?.data || res.data?.projects || (Array.isArray(res.data) ? res.data : null);
    if (Array.isArray(live) && live.length > 0) {
      return live.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {}
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  let p = null;
  try {
    // Direct Axios call for project metadata
    const res = await api.get(`/api/v1/projects/${params.slug}`);
    p = res.data?.data || res.data?.project || res.data;
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
    // Direct Axios call inside Project Detail page
    const res = await api.get(`/api/v1/projects/${params.slug}`);
    project = res.data?.data || res.data?.project || res.data;
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
