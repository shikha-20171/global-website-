import { FastifyReply, FastifyRequest } from "fastify";
import { pagesService } from "./pages.service.js";
import { createPageSchema, updatePageSchema, updateSectionSchema } from "./pages.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";
import { PublishStatus } from "@prisma/client";

export class PagesController {
  // Public
  async getPublicPages(_request: FastifyRequest, reply: FastifyReply) {
    const pages = await pagesService.listPublicPages();
    return reply.status(200).send(successResponse(pages));
  }

  async getPublicPageBySlug(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { slug?: string; "*": string };
    const slug = params["*"] || params.slug || "";
    const page = await pagesService.getPublicPageBySlug(slug);
    return reply.status(200).send(successResponse(page));
  }

  // Admin
  async getAdminPages(_request: FastifyRequest, reply: FastifyReply) {
    const pages = await pagesService.listAdminPages();
    return reply.status(200).send(successResponse(pages));
  }

  async getAdminPageById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const page = await pagesService.getAdminPageById(id);
    return reply.status(200).send(successResponse(page));
  }

  async previewPage(request: FastifyRequest, reply: FastifyReply) {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const page = await pagesService.getPreviewPage(idOrSlug);
    return reply.status(200).send(successResponse(page, "Preview loaded"));
  }

  async createPage(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createPageSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const created = await pagesService.createPage(input, actorName);
    return reply.status(201).send(successResponse(created, "Page created successfully"));
  }

  async updatePage(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updatePageSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const updated = await pagesService.updatePage(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Page updated successfully"));
  }

  async publishPage(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const body = (request.body as { status?: PublishStatus }) || {};
    const status = body.status || PublishStatus.PUBLISHED;
    const actorName = authReq.adminUser?.name || "Admin";

    const updated = await pagesService.publishPage(id, status, actorName);
    return reply.status(200).send(successResponse(updated, `Page status changed to ${status}`));
  }

  async deletePage(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Admin";

    const result = await pagesService.deletePage(id, actorName);
    return reply.status(200).send(successResponse(result, "Page deleted successfully"));
  }

  // Sections
  async listSections(_request: FastifyRequest, reply: FastifyReply) {
    const sections = await pagesService.listAllSections();
    return reply.status(200).send(successResponse(sections));
  }

  async updateSection(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateSectionSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const updated = await pagesService.updateSection(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Page section updated successfully"));
  }
}

export const pagesController = new PagesController();
