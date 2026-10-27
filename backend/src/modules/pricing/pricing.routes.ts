import { FastifyInstance } from "fastify";
import { pricingController } from "./pricing.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function pricingRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/pricing",
    {
      schema: {
        tags: ["Products & Catalog"],
        summary: "Retrieve public enterprise pricing tiers and product-specific licensing plans",
      },
    },
    pricingController.getPublicPricing.bind(pricingController)
  );

  // Admin
  app.get(
    "/admin/pricing",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "List all configured pricing plans and tiers",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pricingController.listAdminPlans.bind(pricingController)
  );

  app.post(
    "/admin/pricing",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Create a new pricing plan tier",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pricingController.createPlan.bind(pricingController)
  );

  app.put(
    "/admin/pricing/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Update pricing plan price, quota, or features (audited)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pricingController.updatePlan.bind(pricingController)
  );

  app.delete(
    "/admin/pricing/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Delete pricing plan",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pricingController.deletePlan.bind(pricingController)
  );
}
