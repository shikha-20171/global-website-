import { FastifyInstance } from "fastify";
import { companyController } from "./company.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { PERMISSIONS } from "../../config/constants.js";

export async function companyRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/company",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve company profile, mission, vision, core values, leadership roster, and offices",
      },
    },
    companyController.getProfile.bind(companyController)
  );

  app.get(
    "/website/company",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve company profile (compatibility endpoint)",
      },
    },
    companyController.getProfile.bind(companyController)
  );

  // Admin
  app.get(
    "/admin/company",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.SETTINGS_MANAGE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve corporate brand narrative and leadership details (admin)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    companyController.getProfile.bind(companyController)
  );

  app.put(
    "/admin/company",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.SETTINGS_MANAGE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Update corporate brand narrative and leadership details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    companyController.updateProfile.bind(companyController)
  );
}
