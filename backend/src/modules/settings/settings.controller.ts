import { FastifyReply, FastifyRequest } from "fastify";
import { settingsService } from "./settings.service.js";
import { updateSettingSchema } from "./settings.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class SettingsController {
  async getPublicSettings(_request: FastifyRequest, reply: FastifyReply) {
    const settings = await settingsService.getPublicSettings();
    return reply.status(200).send(successResponse(settings));
  }

  async getAdminSettings(_request: FastifyRequest, reply: FastifyReply) {
    const settings = await settingsService.getAdminSettings();
    return reply.status(200).send(successResponse(settings));
  }

  async saveSetting(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const body = request.body as any;
    const actorName = authReq.adminUser?.name || "Super Admin";

    // Handle bulk key-value dictionary update (common from admin settings UI)
    if (typeof body === "object" && !body.key && !body.value) {
      const result = await settingsService.bulkSaveAdminSettings(body, actorName);
      return reply.status(200).send(successResponse(result, "Settings updated successfully"));
    }

    const input = updateSettingSchema.parse(body);
    const setting = await settingsService.saveAdminSetting(input, actorName);
    return reply.status(200).send(successResponse(setting, "Setting updated successfully"));
  }
}

export const settingsController = new SettingsController();
