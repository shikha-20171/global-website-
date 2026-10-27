import { FastifyReply, FastifyRequest } from "fastify";
import { projectsService } from "./projects.service.js";
import { createProjectSchema, updateProjectSchema } from "./projects.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class ProjectsController {
  // Public
  async listPublicProjects(_request: FastifyRequest, reply: FastifyReply) {
    const projects = await projectsService.listPublicProjects();
    return reply.status(200).send(successResponse(projects));
  }

  async getPublicProjectBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const project = await projectsService.getPublicProjectBySlug(slug);
    return reply.status(200).send(successResponse(project));
  }

  // Admin
  async listAdminProjects(_request: FastifyRequest, reply: FastifyReply) {
    const projects = await projectsService.listAdminProjects();
    return reply.status(200).send(successResponse(projects));
  }

  async createProject(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createProjectSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await projectsService.createProject(input, actorName);
    return reply.status(201).send(successResponse(created, "Project created successfully"));
  }

  async updateProject(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateProjectSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await projectsService.updateProject(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Project updated successfully"));
  }

  async deleteProject(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await projectsService.deleteProject(id, actorName);
    return reply.status(200).send(successResponse(result, "Project deleted successfully"));
  }
}

export const projectsController = new ProjectsController();
