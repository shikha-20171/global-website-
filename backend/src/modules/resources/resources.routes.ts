import { FastifyInstance } from "fastify";
import { resourcesController } from "./resources.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function resourcesRoutes(app: FastifyInstance) {
  // Public Resources Endpoints
  app.get(
    "/content/blog",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List all published engineering blog articles with category filters and pagination",
      },
    },
    resourcesController.listPublicBlogPosts.bind(resourcesController)
  );

  app.get(
    "/content/blog/:slug",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "Retrieve published technical blog post content by slug",
      },
    },
    resourcesController.getPublicBlogPostBySlug.bind(resourcesController)
  );

  app.get(
    "/content/insights",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List all executive whitepapers and insight research reports",
      },
    },
    resourcesController.listPublicInsights.bind(resourcesController)
  );

  app.get(
    "/content/whitepapers",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List all executive whitepapers (alias endpoint)",
      },
    },
    resourcesController.listPublicInsights.bind(resourcesController)
  );

  app.get(
    "/content/docs",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List all technical documentation runbooks and architecture topologies",
      },
    },
    resourcesController.listPublicRunbooks.bind(resourcesController)
  );

  app.get(
    "/content/runbooks",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List all technical documentation runbooks (alias endpoint)",
      },
    },
    resourcesController.listPublicRunbooks.bind(resourcesController)
  );

  app.get(
    "/content/api-reference",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List public REST API documentation specifications and parameters",
      },
    },
    resourcesController.listPublicApiResources.bind(resourcesController)
  );

  app.get(
    "/content/api-resources",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List public REST API specifications (alias endpoint)",
      },
    },
    resourcesController.listPublicApiResources.bind(resourcesController)
  );

  app.get(
    "/content/faqs",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List frequently asked questions across products and enterprise services",
      },
    },
    resourcesController.listPublicFaqs.bind(resourcesController)
  );

  app.get(
    "/content/careers",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List open engineering and corporate job positions",
      },
    },
    resourcesController.listPublicJobPostings.bind(resourcesController)
  );

  app.get(
    "/content/partners",
    {
      schema: {
        tags: ["Content & Resources"],
        summary: "List strategic technology, solution, and channel partners",
      },
    },
    resourcesController.listPublicPartners.bind(resourcesController)
  );

  // Admin Resources Endpoints
  // Blog
  app.get(
    "/admin/blog",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "List all articles for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.listAdminBlogPosts.bind(resourcesController)
  );

  app.post(
    "/admin/blog",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Create a new technical blog post",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.createBlogPost.bind(resourcesController)
  );

  app.put(
    "/admin/blog/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Update blog post content",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.updateBlogPost.bind(resourcesController)
  );

  app.delete(
    "/admin/blog/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Delete blog post",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.deleteBlogPost.bind(resourcesController)
  );

  // Insights / Whitepapers
  app.get(
    "/admin/insights",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "List all insight reports and whitepapers for administration",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.listAdminInsights.bind(resourcesController)
  );

  app.post(
    "/admin/insights",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Create insight report",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.createInsight.bind(resourcesController)
  );

  app.put(
    "/admin/insights/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Update insight report",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.updateInsight.bind(resourcesController)
  );

  app.delete(
    "/admin/insights/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Delete insight report",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.deleteInsight.bind(resourcesController)
  );

  // FAQs
  app.get(
    "/admin/faqs",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "List all FAQs for administration",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.listAdminFaqs.bind(resourcesController)
  );

  app.post(
    "/admin/faqs",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Create FAQ entry",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.createFaq.bind(resourcesController)
  );

  app.put(
    "/admin/faqs/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Update FAQ entry",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.updateFaq.bind(resourcesController)
  );

  app.delete(
    "/admin/faqs/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Delete FAQ entry",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.deleteFaq.bind(resourcesController)
  );

  // Careers
  app.get(
    "/admin/careers",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "List career postings for administration",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.listAdminJobPostings.bind(resourcesController)
  );

  app.post(
    "/admin/careers",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Create career opening",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.createJobPosting.bind(resourcesController)
  );

  app.put(
    "/admin/careers/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Update career opening",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.updateJobPosting.bind(resourcesController)
  );

  app.delete(
    "/admin/careers/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Delete career opening",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.deleteJobPosting.bind(resourcesController)
  );

  // Partners
  app.get(
    "/admin/partners",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "List partners for administration",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.listAdminPartners.bind(resourcesController)
  );

  app.post(
    "/admin/partners",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Create partner record",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.createPartner.bind(resourcesController)
  );

  app.put(
    "/admin/partners/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Update partner record",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.updatePartner.bind(resourcesController)
  );

  app.delete(
    "/admin/partners/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Content & Resources"],
        summary: "Delete partner record",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    resourcesController.deletePartner.bind(resourcesController)
  );
}
