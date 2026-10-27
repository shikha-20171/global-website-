import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { MenuLocation, AuditResult } from "@prisma/client";
import { CreateNavItemInput, UpdateNavItemInput } from "./navigation.schema.js";

export class NavigationService {
  async getPublicNavigation() {
    const items = await prisma.navigationItem.findMany({
      where: {
        isPublished: true,
        parentId: null,
      },
      include: {
        children: {
          where: { isPublished: true },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    const header = items.filter((i) => i.menuLocation === MenuLocation.HEADER);
    const footer = items.filter((i) => i.menuLocation === MenuLocation.FOOTER);
    const mobile = items.filter((i) => i.menuLocation === MenuLocation.MOBILE);

    return {
      header,
      footer,
      mobile: mobile.length > 0 ? mobile : header,
      totalLinks: items.length,
    };
  }

  async listAdminNavigation() {
    return prisma.navigationItem.findMany({
      include: {
        parent: { select: { id: true, label: true } },
        children: { orderBy: { displayOrder: "asc" } },
      },
      orderBy: [{ menuLocation: "asc" }, { displayOrder: "asc" }],
    });
  }

  async createNavItem(input: CreateNavItemInput, actorName: string) {
    const created = await prisma.navigationItem.create({
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Navigation Item",
      module: "Website CMS",
      entityType: "NavigationItem",
      entityId: created.id,
      details: `Created menu link "${created.label}" -> "${created.href}" in ${created.menuLocation}`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateNavItem(id: string, input: UpdateNavItemInput, actorName: string) {
    const updated = await prisma.navigationItem.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Navigation Item",
      module: "Website CMS",
      entityType: "NavigationItem",
      entityId: id,
      details: `Updated navigation link "${updated.label}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteNavItem(id: string, actorName: string) {
    const item = await prisma.navigationItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Navigation item not found");

    await prisma.navigationItem.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Navigation Item",
      module: "Website CMS",
      entityType: "NavigationItem",
      entityId: id,
      details: `Deleted navigation item "${item.label}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const navigationService = new NavigationService();
