import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import {
  BlogPostQueryInput,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  CreateFaqInput,
  UpdateFaqInput,
  CreateJobPostingInput,
  UpdateJobPostingInput,
  CreatePartnerInput,
  UpdatePartnerInput,
  CreateInsightReportInput,
  UpdateInsightReportInput,
} from "./resources.schema.js";

export class ResourcesService {
  // --- 1. Blog Posts ---
  async listPublicBlogPosts(query: BlogPostQueryInput) {
    const where: any = { status: PublishStatus.PUBLISHED };

    if (query.category) {
      where.category = { equals: query.category, mode: "insensitive" };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { excerpt: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: query.limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getPublicBlogPostBySlug(slug: string) {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
    });

    if (!post) {
      throw new NotFoundError(`Blog post "${slug}" not found or not published`);
    }

    return post;
  }

  async listAdminBlogPosts() {
    return prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createBlogPost(input: CreateBlogPostInput, actorName: string) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Blog post with slug "${input.slug}" already exists`);
    }

    const created = await prisma.blogPost.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
        publishedAt: input.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Blog Post",
      module: "Resources Hub",
      entityType: "BlogPost",
      entityId: created.id,
      details: `Created article "${created.title}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateBlogPost(id: string, input: UpdateBlogPostInput, actorName: string) {
    const data: any = { ...input };
    if (input.status === PublishStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Blog Post",
      module: "Resources Hub",
      entityType: "BlogPost",
      entityId: id,
      details: `Updated article "${updated.title}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteBlogPost(id: string, actorName: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundError("Blog post not found");

    await prisma.blogPost.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Blog Post",
      module: "Resources Hub",
      entityType: "BlogPost",
      entityId: id,
      details: `Deleted article "${post.title}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 2. Insight Reports & Whitepapers ---
  async listPublicInsights() {
    return prisma.insightReport.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
    });
  }

  async listAdminInsights() {
    return prisma.insightReport.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createInsight(input: CreateInsightReportInput, actorName: string) {
    const existing = await prisma.insightReport.findUnique({ where: { slug: input.slug } });
    if (existing) throw new BadRequestError(`Insight report with slug "${input.slug}" already exists`);

    const created = await prisma.insightReport.create({ data: input as any });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Insight Report",
      module: "Resources Hub",
      entityType: "InsightReport",
      entityId: created.id,
      details: `Created insight report "${created.title}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateInsight(id: string, input: UpdateInsightReportInput, actorName: string) {
    const updated = await prisma.insightReport.update({ where: { id }, data: input as any });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Insight Report",
      module: "Resources Hub",
      entityType: "InsightReport",
      entityId: id,
      details: `Updated insight report "${updated.title}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteInsight(id: string, actorName: string) {
    const report = await prisma.insightReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundError("Insight report not found");

    await prisma.insightReport.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Insight Report",
      module: "Resources Hub",
      entityType: "InsightReport",
      entityId: id,
      details: `Deleted insight report "${report.title}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 3. Documentation Runbooks ---
  async listPublicRunbooks() {
    return prisma.documentationRunbook.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { displayOrder: "asc" },
    });
  }

  // --- 4. API Resources ---
  async listPublicApiResources() {
    return prisma.apiResource.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { displayOrder: "asc" },
    });
  }

  // --- 5. FAQs ---
  async listPublicFaqs() {
    return prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  }

  async listAdminFaqs() {
    return prisma.faq.findMany({
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  }

  async createFaq(input: CreateFaqInput, actorName: string) {
    const created = await prisma.faq.create({ data: input });

    await logAuditEvent({
      adminName: actorName,
      action: "Created FAQ",
      module: "Resources Hub",
      entityType: "Faq",
      entityId: created.id,
      details: `Created FAQ "${created.question.slice(0, 40)}..."`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateFaq(id: string, input: UpdateFaqInput, actorName: string) {
    const updated = await prisma.faq.update({ where: { id }, data: input });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated FAQ",
      module: "Resources Hub",
      entityType: "Faq",
      entityId: id,
      details: `Updated FAQ ID ${id}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteFaq(id: string, actorName: string) {
    await prisma.faq.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted FAQ",
      module: "Resources Hub",
      entityType: "Faq",
      entityId: id,
      details: `Deleted FAQ ID ${id}`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 6. Careers / Job Postings ---
  async listPublicJobPostings() {
    return prisma.jobPosting.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
    });
  }

  async listAdminJobPostings() {
    return prisma.jobPosting.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createJobPosting(input: CreateJobPostingInput, actorName: string) {
    const created = await prisma.jobPosting.create({
      data: {
        ...input,
        requirements: input.requirements ?? [],
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Job Posting",
      module: "Resources Hub",
      entityType: "JobPosting",
      entityId: created.id,
      details: `Created career opening "${created.title}" in ${created.department}`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateJobPosting(id: string, input: UpdateJobPostingInput, actorName: string) {
    const updated = await prisma.jobPosting.update({ where: { id }, data: input });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Job Posting",
      module: "Resources Hub",
      entityType: "JobPosting",
      entityId: id,
      details: `Updated career opening "${updated.title}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteJobPosting(id: string, actorName: string) {
    await prisma.jobPosting.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Job Posting",
      module: "Resources Hub",
      entityType: "JobPosting",
      entityId: id,
      details: `Deleted job posting ID ${id}`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 7. Partners ---
  async listPublicPartners() {
    return prisma.partner.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ tier: "asc" }, { displayOrder: "asc" }],
    });
  }

  async listAdminPartners() {
    return prisma.partner.findMany({
      orderBy: [{ tier: "asc" }, { displayOrder: "asc" }],
    });
  }

  async createPartner(input: CreatePartnerInput, actorName: string) {
    const created = await prisma.partner.create({ data: input });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Strategic Partner",
      module: "Resources Hub",
      entityType: "Partner",
      entityId: created.id,
      details: `Created partner record "${created.name}" (${created.tier})`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updatePartner(id: string, input: UpdatePartnerInput, actorName: string) {
    const updated = await prisma.partner.update({ where: { id }, data: input });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Strategic Partner",
      module: "Resources Hub",
      entityType: "Partner",
      entityId: id,
      details: `Updated partner "${updated.name}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deletePartner(id: string, actorName: string) {
    await prisma.partner.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Strategic Partner",
      module: "Resources Hub",
      entityType: "Partner",
      entityId: id,
      details: `Deleted partner ID ${id}`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const resourcesService = new ResourcesService();
