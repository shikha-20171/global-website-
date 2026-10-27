import { FastifyInstance } from "fastify";
import { projectsController } from "./projects.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function projectsRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/projects",
    {
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "List all published customer engineering projects and showcases",
      },
    },
    projectsController.listPublicProjects.bind(projectsController)
  );

  app.get(
    "/projects/:slug",
    {
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Retrieve single customer engineering showcase details and tech stack by slug",
      },
    },
    projectsController.getPublicProjectBySlug.bind(projectsController)
  );

  // Admin
  app.get(
    "/admin/projects",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "List all projects for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    projectsController.listAdminProjects.bind(projectsController)
  );

  app.post(
    "/admin/projects",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Create a new customer showcase project",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    projectsController.createProject.bind(projectsController)
  );

  app.put(
    "/admin/projects/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Update customer showcase project details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    projectsController.updateProject.bind(projectsController)
  );

  app.delete(
    "/admin/projects/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Delete showcase project",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    projectsController.deleteProject.bind(projectsController)
  );
}
