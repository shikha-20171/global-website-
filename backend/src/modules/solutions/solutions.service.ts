import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateSolutionInput, UpdateSolutionInput } from "./solutions.schema.js";

export class SolutionsService {
  async listPublicSolutions() {
    return prisma.solution.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { displayOrder: "asc" },
    });
  }

  async getPublicSolutionBySlug(slug: string) {
    const solution = await prisma.solution.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!solution) {
      throw new NotFoundError(`Solution "${slug}" not found or not published`);
    }

    return solution;
  }

  async listAdminSolutions() {
    return prisma.solution.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  async createSolution(input: CreateSolutionInput, actorName: string) {
    const existing = await prisma.solution.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Solution with slug "${input.slug}" already exists`);
    }

    const created = await prisma.solution.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Solution",
      module: "Solutions & Architecture",
      entityType: "Solution",
      entityId: created.id,
      details: `Created enterprise solution "${created.name}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateSolution(id: string, input: UpdateSolutionInput, actorName: string) {
    const updated = await prisma.solution.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Solution",
      module: "Solutions & Architecture",
      entityType: "Solution",
      entityId: id,
      details: `Updated enterprise solution "${updated.name}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteSolution(id: string, actorName: string) {
    const solution = await prisma.solution.findUnique({ where: { id } });
    if (!solution) throw new NotFoundError("Solution not found");

    await prisma.solution.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Solution",
      module: "Solutions & Architecture",
      entityType: "Solution",
      entityId: id,
      details: `Deleted enterprise solution "${solution.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const solutionsService = new SolutionsService();
