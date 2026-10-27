import { FastifyReply, FastifyRequest } from "fastify";
import { rolesService } from "./roles.service.js";
import { successResponse } from "../../shared/response.js";

export class RolesController {
  async listRoles(_request: FastifyRequest, reply: FastifyReply) {
    const roles = await rolesService.listRoles();
    return reply.status(200).send(successResponse(roles));
  }

  async getRoleById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const role = await rolesService.getRoleById(id);
    return reply.status(200).send(successResponse(role));
  }

  async listPermissions(_request: FastifyRequest, reply: FastifyReply) {
    const permissions = await rolesService.listPermissions();
    return reply.status(200).send(successResponse(permissions));
  }
}

export const rolesController = new RolesController();
