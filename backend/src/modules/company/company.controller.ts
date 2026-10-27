import { FastifyReply, FastifyRequest } from "fastify";
import { companyService } from "./company.service.js";
import { updateCompanyProfileSchema } from "./company.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class CompanyController {
  async getProfile(_request: FastifyRequest, reply: FastifyReply) {
    const profile = await companyService.getProfile();
    return reply.status(200).send(successResponse(profile));
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = updateCompanyProfileSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const updated = await companyService.updateProfile(input, actorName);
    return reply.status(200).send(successResponse(updated, "Company profile updated"));
  }
}

export const companyController = new CompanyController();
