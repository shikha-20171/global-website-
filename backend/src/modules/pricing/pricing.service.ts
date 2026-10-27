import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateProductPlanInput, UpdateProductPlanInput } from "./pricing.schema.js";

export class PricingService {
  async getPublicPricing() {
    const plans = await prisma.productPlan.findMany({
      where: { status: PublishStatus.PUBLISHED },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            tagline: true,
          },
        },
      },
      orderBy: [{ productId: "asc" }, { displayOrder: "asc" }],
    });

    const defaultPlans = plans.filter((p: any) => !p.productId);
    const productPlans = plans.filter((p: any) => !!p.productId);

    return {
      defaultTiers: defaultPlans,
      productSpecificTiers: productPlans,
      totalPlans: plans.length,
    };
  }

  async listAdminPlans() {
    return prisma.productPlan.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ productId: "asc" }, { displayOrder: "asc" }],
    });
  }

  async createPlan(input: CreateProductPlanInput, actorName: string) {
    const created = await prisma.productPlan.create({
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Pricing Plan",
      module: "Pricing & Billing",
      entityType: "ProductPlan",
      entityId: created.id,
      details: `Created pricing plan tier "${created.name}" ($${created.monthlyPriceUsd}/mo)`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updatePlan(id: string, input: UpdateProductPlanInput, actorName: string) {
    const existing = await prisma.productPlan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Pricing plan not found");

    const updated = await prisma.productPlan.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Pricing Plan",
      module: "Pricing & Billing",
      entityType: "ProductPlan",
      entityId: id,
      details: `Updated pricing tier "${updated.name}" from ($${existing.monthlyPriceUsd}/mo) to ($${updated.monthlyPriceUsd}/mo)`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deletePlan(id: string, actorName: string) {
    const plan = await prisma.productPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundError("Pricing plan not found");

    await prisma.productPlan.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Pricing Plan",
      module: "Pricing & Billing",
      entityType: "ProductPlan",
      entityId: id,
      details: `Deleted pricing tier "${plan.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const pricingService = new PricingService();
