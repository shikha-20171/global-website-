import { FastifyInstance } from "fastify";
import { caseStudiesController } from "./case-studies.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function caseStudiesRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/case-studies",
    {
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "List all published customer case studies with ROI metric highlights",
      },
    },
    caseStudiesController.listPublicCaseStudies.bind(caseStudiesController)
  );

  app.get(
    "/case-studies/:slug",
    {
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Retrieve full customer case study breakdown, challenges, solutions, and testimonial by slug",
      },
    },
    caseStudiesController.getPublicCaseStudyBySlug.bind(caseStudiesController)
  );

  // Admin
  app.get(
    "/admin/case-studies",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "List all customer case studies for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    caseStudiesController.listAdminCaseStudies.bind(caseStudiesController)
  );

  app.post(
    "/admin/case-studies",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Create a new customer case study",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    caseStudiesController.createCaseStudy.bind(caseStudiesController)
  );

  app.put(
    "/admin/case-studies/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Update customer case study details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    caseStudiesController.updateCaseStudy.bind(caseStudiesController)
  );

  app.delete(
    "/admin/case-studies/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Projects & Portfolio"],
        summary: "Delete customer case study",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    caseStudiesController.deleteCaseStudy.bind(caseStudiesController)
  );
}
