import { FastifyInstance } from "fastify";
import { settingsController } from "./settings.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function settingsRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/settings/public",
    {
      schema: {
        tags: ["System Settings"],
        summary: "Retrieve public website configuration parameters and branding attributes",
      },
    },
    settingsController.getPublicSettings.bind(settingsController)
  );

  app.get(
    "/website/settings",
    {
      schema: {
        tags: ["System Settings"],
        summary: "Retrieve public website settings (compatibility endpoint)",
      },
    },
    settingsController.getPublicSettings.bind(settingsController)
  );

  // Admin
  app.get(
    "/admin/settings",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["System Settings"],
        summary: "List all system settings with sensitive secret values masked",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    settingsController.getAdminSettings.bind(settingsController)
  );

  app.put(
    "/admin/settings",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["System Settings"],
        summary: "Save or bulk update system settings",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    settingsController.saveSetting.bind(settingsController)
  );
}
