import { FastifyReply, FastifyRequest } from "fastify";
import { solutionsService } from "./solutions.service.js";
import { createSolutionSchema, updateSolutionSchema } from "./solutions.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class SolutionsController {
  // Public
  async listPublicSolutions(_request: FastifyRequest, reply: FastifyReply) {
    const solutions = await solutionsService.listPublicSolutions();
    return reply.status(200).send(successResponse(solutions));
  }

  async getPublicSolutionBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const solution = await solutionsService.getPublicSolutionBySlug(slug);
    return reply.status(200).send(successResponse(solution));
  }

  // Admin
  async listAdminSolutions(_request: FastifyRequest, reply: FastifyReply) {
    const solutions = await solutionsService.listAdminSolutions();
    return reply.status(200).send(successResponse(solutions));
  }

  async createSolution(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createSolutionSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await solutionsService.createSolution(input, actorName);
    return reply.status(201).send(successResponse(created, "Solution created successfully"));
  }

  async updateSolution(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateSolutionSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await solutionsService.updateSolution(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Solution updated successfully"));
  }

  async deleteSolution(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await solutionsService.deleteSolution(id, actorName);
    return reply.status(200).send(successResponse(result, "Solution deleted successfully"));
  }
}

export const solutionsController = new SolutionsController();
