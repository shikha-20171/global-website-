import { FastifyReply, FastifyRequest } from "fastify";
import { caseStudiesService } from "./case-studies.service.js";
import { createCaseStudySchema, updateCaseStudySchema } from "./case-studies.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class CaseStudiesController {
  // Public
  async listPublicCaseStudies(_request: FastifyRequest, reply: FastifyReply) {
    const caseStudies = await caseStudiesService.listPublicCaseStudies();
    return reply.status(200).send(successResponse(caseStudies));
  }

  async getPublicCaseStudyBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const caseStudy = await caseStudiesService.getPublicCaseStudyBySlug(slug);
    return reply.status(200).send(successResponse(caseStudy));
  }

  // Admin
  async listAdminCaseStudies(_request: FastifyRequest, reply: FastifyReply) {
    const caseStudies = await caseStudiesService.listAdminCaseStudies();
    return reply.status(200).send(successResponse(caseStudies));
  }

  async createCaseStudy(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createCaseStudySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await caseStudiesService.createCaseStudy(input, actorName);
    return reply.status(201).send(successResponse(created, "Case study created successfully"));
  }

  async updateCaseStudy(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateCaseStudySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await caseStudiesService.updateCaseStudy(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Case study updated successfully"));
  }

  async deleteCaseStudy(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await caseStudiesService.deleteCaseStudy(id, actorName);
    return reply.status(200).send(successResponse(result, "Case study deleted successfully"));
  }
}

export const caseStudiesController = new CaseStudiesController();
