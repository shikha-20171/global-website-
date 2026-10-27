import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateCaseStudyInput, UpdateCaseStudyInput } from "./case-studies.schema.js";

export class CaseStudiesService {
  async listPublicCaseStudies() {
    return prisma.caseStudy.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { displayOrder: "asc" },
    });
  }

  async getPublicCaseStudyBySlug(slug: string) {
    const caseStudy = await prisma.caseStudy.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!caseStudy) {
      throw new NotFoundError(`Case study "${slug}" not found or not published`);
    }

    return caseStudy;
  }

  async listAdminCaseStudies() {
    return prisma.caseStudy.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  async createCaseStudy(input: CreateCaseStudyInput, actorName: string) {
    const existing = await prisma.caseStudy.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Case study with slug "${input.slug}" already exists`);
    }

    const created = await prisma.caseStudy.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Case Study",
      module: "Projects & Portfolio",
      entityType: "CaseStudy",
      entityId: created.id,
      details: `Created customer case study "${created.title}" for client "${created.client}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateCaseStudy(id: string, input: UpdateCaseStudyInput, actorName: string) {
    const updated = await prisma.caseStudy.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Case Study",
      module: "Projects & Portfolio",
      entityType: "CaseStudy",
      entityId: id,
      details: `Updated case study "${updated.title}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteCaseStudy(id: string, actorName: string) {
    const caseStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!caseStudy) throw new NotFoundError("Case study not found");

    await prisma.caseStudy.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Case Study",
      module: "Projects & Portfolio",
      entityType: "CaseStudy",
      entityId: id,
      details: `Deleted case study "${caseStudy.title}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const caseStudiesService = new CaseStudiesService();
