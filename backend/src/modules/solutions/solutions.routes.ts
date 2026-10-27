import { FastifyInstance } from "fastify";
import { solutionsController } from "./solutions.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function solutionsRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/solutions",
    {
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "List all published enterprise solutions architecture blueprints",
      },
    },
    solutionsController.listPublicSolutions.bind(solutionsController)
  );

  app.get(
    "/solutions/:slug",
    {
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Retrieve single enterprise solution details, capabilities, and associated products by slug",
      },
    },
    solutionsController.getPublicSolutionBySlug.bind(solutionsController)
  );

  // Admin
  app.get(
    "/admin/solutions",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "List all solutions for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    solutionsController.listAdminSolutions.bind(solutionsController)
  );

  app.post(
    "/admin/solutions",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Create a new enterprise solution",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    solutionsController.createSolution.bind(solutionsController)
  );

  app.put(
    "/admin/solutions/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Update enterprise solution details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    solutionsController.updateSolution.bind(solutionsController)
  );

  app.delete(
    "/admin/solutions/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Solutions & Verticals"],
        summary: "Delete enterprise solution",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    solutionsController.deleteSolution.bind(solutionsController)
  );
}
