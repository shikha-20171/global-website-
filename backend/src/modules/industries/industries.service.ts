import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateIndustryInput, UpdateIndustryInput } from "./industries.schema.js";

export class IndustriesService {
  async listPublicIndustries() {
    return prisma.industry.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { displayOrder: "asc" },
    });
  }

  async getPublicIndustryBySlug(slug: string) {
    const industry = await prisma.industry.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!industry) {
      throw new NotFoundError(`Industry "${slug}" not found or not published`);
    }

    return industry;
  }

  async listAdminIndustries() {
    return prisma.industry.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  async createIndustry(input: CreateIndustryInput, actorName: string) {
    const existing = await prisma.industry.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Industry with slug "${input.slug}" already exists`);
    }

    const created = await prisma.industry.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
        metrics: input.metrics ?? [],
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Industry Vertical",
      module: "Solutions & Architecture",
      entityType: "Industry",
      entityId: created.id,
      details: `Created industry vertical "${created.name}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateIndustry(id: string, input: UpdateIndustryInput, actorName: string) {
    const updated = await prisma.industry.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Industry Vertical",
      module: "Solutions & Architecture",
      entityType: "Industry",
      entityId: id,
      details: `Updated industry vertical "${updated.name}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteIndustry(id: string, actorName: string) {
    const industry = await prisma.industry.findUnique({ where: { id } });
    if (!industry) throw new NotFoundError("Industry not found");

    await prisma.industry.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Industry Vertical",
      module: "Solutions & Architecture",
      entityType: "Industry",
      entityId: id,
      details: `Deleted industry vertical "${industry.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const industriesService = new IndustriesService();
