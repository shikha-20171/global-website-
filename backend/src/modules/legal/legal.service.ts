import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { UpdateLegalPolicyInput } from "./legal.schema.js";

export class LegalService {
  async getPublicPolicyBySlug(slug: string) {
    const policy = await prisma.legalPolicy.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!policy) {
      throw new NotFoundError(`Legal policy with slug "${slug}" not found`);
    }

    return policy;
  }

  async listPublicPolicies() {
    return prisma.legalPolicy.findMany({
      where: { status: PublishStatus.PUBLISHED },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        version: true,
        lastReviewedDate: true,
        frameworks: true,
        displayOrder: true,
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  async listAdminPolicies() {
    return prisma.legalPolicy.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  async updatePolicy(idOrSlug: string, input: UpdateLegalPolicyInput, actorName: string) {
    const existing = await prisma.legalPolicy.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!existing) {
      throw new NotFoundError(`Legal policy "${idOrSlug}" not found`);
    }

    const updated = await prisma.legalPolicy.update({
      where: { id: existing.id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Legal Policy",
      module: "Website CMS",
      entityType: "LegalPolicy",
      entityId: existing.id,
      details: `Updated legal policy "${updated.title}" (${updated.slug})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }
}

export const legalService = new LegalService();
