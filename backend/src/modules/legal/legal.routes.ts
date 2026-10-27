import { FastifyInstance } from "fastify";
import { legalController } from "./legal.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function legalRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/legal",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "List all published legal policies",
      },
    },
    legalController.listPublicPolicies.bind(legalController)
  );

  app.get(
    "/legal/:slug",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve published legal policy clauses and frameworks by slug",
      },
    },
    legalController.getPublicPolicy.bind(legalController)
  );

  app.get(
    "/website/legal/:slug",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve published legal policy (compatibility endpoint)",
      },
    },
    legalController.getPublicPolicy.bind(legalController)
  );

  // Admin
  app.get(
    "/admin/legal",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Website CMS"],
        summary: "List all legal policies for admin editing",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    legalController.listAdminPolicies.bind(legalController)
  );

  app.put(
    "/admin/legal/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Website CMS"],
        summary: "Update legal policy clauses, version, or frameworks",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    legalController.updatePolicy.bind(legalController)
  );
}
