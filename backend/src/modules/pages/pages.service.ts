import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import { CreatePageInput, UpdatePageInput, UpdateSectionInput } from "./pages.schema.js";

export class PagesService {
  private normalizeSlug(slug: string): string {
    let clean = slug.trim();
    if (clean === "home" || clean === "/home" || clean === "" || clean === "/") {
      return "/";
    }
    if (!clean.startsWith("/")) clean = `/${clean}`;
    return clean;
  }

  async listPublicPages() {
    return prisma.websitePage.findMany({
      where: { status: PublishStatus.PUBLISHED },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        pageType: true,
        template: true,
        seoTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        publishedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getPublicPageBySlug(slug: string) {
    const normalized = this.normalizeSlug(slug);
    const page = await prisma.websitePage.findFirst({
      where: {
        slug: normalized,
        status: PublishStatus.PUBLISHED,
      },
      include: {
        sections: {
          where: { isEnabled: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!page) {
      throw new NotFoundError(`Published page with slug "${slug}" not found`);
    }

    return page;
  }

  async getPreviewPage(idOrSlug: string) {
    const page = await prisma.websitePage.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: this.normalizeSlug(idOrSlug) }],
      },
      include: {
        sections: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!page) {
      throw new NotFoundError(`Page "${idOrSlug}" not found`);
    }

    return page;
  }

  async listAdminPages() {
    return prisma.websitePage.findMany({
      include: {
        _count: { select: { sections: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getAdminPageById(id: string) {
    const page = await prisma.websitePage.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!page) {
      throw new NotFoundError("Website page not found");
    }

    return page;
  }

  async createPage(input: CreatePageInput, actorName: string) {
    const slug = this.normalizeSlug(input.slug);

    const created = await prisma.websitePage.create({
      data: {
        slug,
        title: input.title,
        subtitle: input.subtitle,
        pageType: input.pageType || "Core",
        template: input.template || "Standard",
        status: input.status || PublishStatus.PUBLISHED,
        seoTitle: input.seoTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl,
        ogImage: input.ogImage,
        publishedAt: input.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Website Page",
      module: "Website CMS",
      entityType: "WebsitePage",
      entityId: created.id,
      details: `Created CMS page "${created.title}" at route "${created.slug}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updatePage(id: string, input: UpdatePageInput, actorName: string) {
    const data: any = { ...input };
    if (input.slug) {
      data.slug = this.normalizeSlug(input.slug);
    }
    if (input.status === PublishStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }

    const updated = await prisma.websitePage.update({
      where: { id },
      data,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Website Page",
      module: "Website CMS",
      entityType: "WebsitePage",
      entityId: id,
      details: `Updated CMS page "${updated.title}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async publishPage(id: string, status: PublishStatus, actorName: string) {
    const updated = await prisma.websitePage.update({
      where: { id },
      data: {
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? new Date() : undefined,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: `Changed Page Status to ${status}`,
      module: "Website CMS",
      entityType: "WebsitePage",
      entityId: id,
      details: `Website page "${updated.title}" status changed to ${status}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deletePage(id: string, actorName: string) {
    const page = await prisma.websitePage.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Website Page",
      module: "Website CMS",
      entityType: "WebsitePage",
      entityId: id,
      details: `Deleted CMS page "${page.title}" (${page.slug})`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- Page Sections (Homepage Builder) ---

  async listAllSections() {
    return prisma.pageSection.findMany({
      include: {
        page: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: [{ pageId: "asc" }, { displayOrder: "asc" }],
    });
  }

  async updateSection(id: string, input: UpdateSectionInput, actorName: string) {
    const updated = await prisma.pageSection.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Page Section",
      module: "Website CMS",
      entityType: "PageSection",
      entityId: id,
      details: `Updated section "${updated.name}" (${updated.sectionKey})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }
}

export const pagesService = new PagesService();
