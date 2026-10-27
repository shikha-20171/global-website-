import { FastifyReply, FastifyRequest } from "fastify";
import { mediaService } from "./media.service.js";
import { createMediaAssetSchema, updateMediaAssetSchema } from "./media.schema.js";
import { successResponse } from "../../shared/response.js";
import { BadRequestError } from "../../shared/errors.js";
import { AuthenticatedRequest } from "../../shared/types.js";
import { AssetType } from "@prisma/client";

export class MediaController {
  async listMedia(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const assets = await mediaService.listMedia(query.type as AssetType);
    return reply.status(200).send(successResponse(assets));
  }

  async getMediaById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const asset = await mediaService.getMediaById(id);
    return reply.status(200).send(successResponse(asset));
  }

  async uploadFile(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const file = await request.file();
    if (!file) {
      throw new BadRequestError("No file payload attached in multipart request");
    }

    const uploaderId = authReq.adminUser?.id;
    const actorName = authReq.adminUser?.name || "Super Admin";

    const asset = await mediaService.uploadFile(file, uploaderId, actorName);
    return reply.status(201).send(successResponse(asset, "Media uploaded successfully"));
  }

  async createMediaRecord(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createMediaAssetSchema.parse(request.body);
    const uploaderId = authReq.adminUser?.id;
    const actorName = authReq.adminUser?.name || "Super Admin";

    const asset = await mediaService.createMediaRecord(input, uploaderId, actorName);
    return reply.status(201).send(successResponse(asset, "Media record registered"));
  }

  async updateMedia(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateMediaAssetSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await mediaService.updateMedia(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Media metadata updated"));
  }

  async deleteMedia(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await mediaService.deleteMedia(id, actorName);
    return reply.status(200).send(successResponse(result, "Media asset deleted successfully"));
  }
}

export const mediaController = new MediaController();
