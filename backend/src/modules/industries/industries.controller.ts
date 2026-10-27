import { FastifyReply, FastifyRequest } from "fastify";
import { industriesService } from "./industries.service.js";
import { createIndustrySchema, updateIndustrySchema } from "./industries.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class IndustriesController {
  // Public
  async listPublicIndustries(_request: FastifyRequest, reply: FastifyReply) {
    const industries = await industriesService.listPublicIndustries();
    return reply.status(200).send(successResponse(industries));
  }

  async getPublicIndustryBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const industry = await industriesService.getPublicIndustryBySlug(slug);
    return reply.status(200).send(successResponse(industry));
  }

  // Admin
  async listAdminIndustries(_request: FastifyRequest, reply: FastifyReply) {
    const industries = await industriesService.listAdminIndustries();
    return reply.status(200).send(successResponse(industries));
  }

  async createIndustry(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createIndustrySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await industriesService.createIndustry(input, actorName);
    return reply.status(201).send(successResponse(created, "Industry created successfully"));
  }

  async updateIndustry(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateIndustrySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await industriesService.updateIndustry(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Industry updated successfully"));
  }

  async deleteIndustry(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await industriesService.deleteIndustry(id, actorName);
    return reply.status(200).send(successResponse(result, "Industry deleted successfully"));
  }
}

export const industriesController = new IndustriesController();
