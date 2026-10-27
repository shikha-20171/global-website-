import { FastifyInstance } from "fastify";
import { industriesController } from "./industries.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function industriesRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/industries",
    {
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "List all supported industry verticals and frameworks",
      },
    },
    industriesController.listPublicIndustries.bind(industriesController)
  );

  app.get(
    "/industries/:slug",
    {
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Retrieve single industry vertical details, challenges, solutions, and related products by slug",
      },
    },
    industriesController.getPublicIndustryBySlug.bind(industriesController)
  );

  // Admin
  app.get(
    "/admin/industries",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "List all industry verticals for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    industriesController.listAdminIndustries.bind(industriesController)
  );

  app.post(
    "/admin/industries",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Create a new industry vertical blueprint",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    industriesController.createIndustry.bind(industriesController)
  );

  app.put(
    "/admin/industries/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Update industry vertical blueprint details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    industriesController.updateIndustry.bind(industriesController)
  );

  app.delete(
    "/admin/industries/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Delete industry vertical",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    industriesController.deleteIndustry.bind(industriesController)
  );
}
