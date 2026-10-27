import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreateAttributeInput, UpdateAttributeInput, SetComparisonValueInput } from "./comparison.schema.js";

export class ComparisonService {
  async getComparisonMatrix() {
    const [attributes, products] = await Promise.all([
      prisma.comparisonAttribute.findMany({
        where: { isPublished: true },
        orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
      }),
      prisma.product.findMany({
        where: { status: PublishStatus.PUBLISHED },
        select: {
          id: true,
          slug: true,
          name: true,
          tagline: true,
          category: { select: { id: true, name: true, slug: true } },
          comparisonValues: {
            select: {
              attributeId: true,
              valueBool: true,
              valueText: true,
            },
          },
        },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    return {
      attributes,
      products,
    };
  }

  async listAttributes() {
    return prisma.comparisonAttribute.findMany({
      include: {
        _count: { select: { productValues: true } },
      },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  }

  async createAttribute(input: CreateAttributeInput, actorName: string) {
    const created = await prisma.comparisonAttribute.create({
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Comparison Attribute",
      module: "Products & Catalog",
      entityType: "ComparisonAttribute",
      entityId: created.id,
      details: `Created comparison criteria "${created.name}" (${created.key})`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateAttribute(id: string, input: UpdateAttributeInput, actorName: string) {
    const updated = await prisma.comparisonAttribute.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Comparison Attribute",
      module: "Products & Catalog",
      entityType: "ComparisonAttribute",
      entityId: id,
      details: `Updated comparison attribute "${updated.name}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteAttribute(id: string, actorName: string) {
    const attr = await prisma.comparisonAttribute.findUnique({ where: { id } });
    if (!attr) throw new NotFoundError("Comparison attribute not found");

    await prisma.comparisonAttribute.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Comparison Attribute",
      module: "Products & Catalog",
      entityType: "ComparisonAttribute",
      entityId: id,
      details: `Deleted comparison attribute "${attr.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  async setComparisonValue(input: SetComparisonValueInput, actorName: string) {
    const updated = await prisma.productComparisonValue.upsert({
      where: {
        productId_attributeId: {
          productId: input.productId,
          attributeId: input.attributeId,
        },
      },
      update: {
        valueBool: input.valueBool,
        valueText: input.valueText,
      },
      create: {
        productId: input.productId,
        attributeId: input.attributeId,
        valueBool: input.valueBool,
        valueText: input.valueText,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Set Product Comparison Value",
      module: "Products & Catalog",
      entityType: "ProductComparisonValue",
      entityId: updated.id,
      details: `Set comparison value for product ID ${input.productId} on attribute ID ${input.attributeId}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }
}

export const comparisonService = new ComparisonService();
