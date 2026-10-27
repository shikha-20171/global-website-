import { FastifyInstance } from "fastify";
import { mediaController } from "./media.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function mediaRoutes(app: FastifyInstance) {
  // Public Media Listing (used for public gallery / assets)
  app.get(
    "/media",
    {
      schema: {
        tags: ["Media Assets"],
        summary: "List media assets and CDN files",
      },
    },
    mediaController.listMedia.bind(mediaController)
  );

  // Admin Media Endpoints
  app.get(
    "/admin/media",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "List all media assets for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.listMedia.bind(mediaController)
  );

  app.get(
    "/admin/media/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "Get media asset details by ID",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.getMediaById.bind(mediaController)
  );

  app.post(
    "/admin/media/upload",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "Upload image, SVG, or document asset (multipart/form-data)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.uploadFile.bind(mediaController)
  );

  app.post(
    "/admin/media",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "Register new media asset record",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.createMediaRecord.bind(mediaController)
  );

  app.put(
    "/admin/media/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "Update media metadata",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.updateMedia.bind(mediaController)
  );

  app.delete(
    "/admin/media/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Media Assets"],
        summary: "Delete media asset and clean up storage",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    mediaController.deleteMedia.bind(mediaController)
  );
}
