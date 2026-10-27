import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateProjectInput, UpdateProjectInput } from "./projects.schema.js";

export class ProjectsService {
  async listPublicProjects() {
    return prisma.project.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }],
    });
  }

  async getPublicProjectBySlug(slug: string) {
    const project = await prisma.project.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!project) {
      throw new NotFoundError(`Project "${slug}" not found or not published`);
    }

    return project;
  }

  async listAdminProjects() {
    return prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  async createProject(input: CreateProjectInput, actorName: string) {
    const existing = await prisma.project.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Project with slug "${input.slug}" already exists`);
    }

    const created = await prisma.project.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
        metrics: input.metrics ?? [],
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Project",
      module: "Projects & Portfolio",
      entityType: "Project",
      entityId: created.id,
      details: `Created showcase project "${created.name}" for client "${created.client}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateProject(id: string, input: UpdateProjectInput, actorName: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Project",
      module: "Projects & Portfolio",
      entityType: "Project",
      entityId: id,
      details: `Updated project "${updated.name}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteProject(id: string, actorName: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError("Project not found");

    await prisma.project.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Project",
      module: "Projects & Portfolio",
      entityType: "Project",
      entityId: id,
      details: `Deleted project "${project.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const projectsService = new ProjectsService();
