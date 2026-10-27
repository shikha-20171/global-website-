import { FastifyInstance } from "fastify";
import { healthRoutes } from "../modules/health/health.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";
import { rolesRoutes } from "../modules/roles/roles.routes.js";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes.js";
import { pagesRoutes } from "../modules/pages/pages.routes.js";
import { navigationRoutes } from "../modules/navigation/navigation.routes.js";
import { companyRoutes } from "../modules/company/company.routes.js";
import { legalRoutes } from "../modules/legal/legal.routes.js";
import { productsRoutes } from "../modules/products/products.routes.js";
import { comparisonRoutes } from "../modules/comparison/comparison.routes.js";
import { solutionsRoutes } from "../modules/solutions/solutions.routes.js";
import { industriesRoutes } from "../modules/industries/industries.routes.js";
import { projectsRoutes } from "../modules/projects/projects.routes.js";
import { caseStudiesRoutes } from "../modules/case-studies/case-studies.routes.js";
import { resourcesRoutes } from "../modules/resources/resources.routes.js";
import { pricingRoutes } from "../modules/pricing/pricing.routes.js";
import { leadsRoutes } from "../modules/leads/leads.routes.js";
import { mediaRoutes } from "../modules/media/media.routes.js";
import { settingsRoutes } from "../modules/settings/settings.routes.js";
import { auditRoutes } from "../modules/audit/audit.routes.js";
import { notificationsRoutes } from "../modules/notifications/notifications.routes.js";

/**
 * Registers all business domain routes on the Fastify instance
 */
function registerDomainModules(app: FastifyInstance) {
  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(usersRoutes);
  app.register(rolesRoutes);
  app.register(dashboardRoutes);
  app.register(pagesRoutes);
  app.register(navigationRoutes);
  app.register(companyRoutes);
  app.register(legalRoutes);
  app.register(productsRoutes);
  app.register(comparisonRoutes);
  app.register(solutionsRoutes);
  app.register(industriesRoutes);
  app.register(projectsRoutes);
  app.register(caseStudiesRoutes);
  app.register(resourcesRoutes);
  app.register(pricingRoutes);
  app.register(leadsRoutes);
  app.register(mediaRoutes);
  app.register(settingsRoutes);
  app.register(auditRoutes);
  app.register(notificationsRoutes);
}

export function registerRoutes(app: FastifyInstance) {
  // 0. Root status endpoint for Render health probes and root browser visits
  app.route({
    method: ["GET", "HEAD"],
    url: "/",
    handler: async (_req, reply) => {
      return reply.status(200).send({
        success: true,
        message: "DEZORYN TECHNOLOGY Backend & API Engine is online",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "production",
        endpoints: {
          health: "/health",
          documentation: "/documentation",
          apiV1: "/api/v1",
        },
      });
    },
  });

  // 1. Root /health endpoint
  app.register(healthRoutes);

  // 2. Primary Versioned API: /api/v1
  app.register(
    (v1App, _opts, done) => {
      registerDomainModules(v1App);
      done();
    },
    { prefix: "/api/v1" }
  );

  // 3. Backwards Compatibility API: /api (Serves existing frontend & admin client files without changes)
  app.register(
    (legacyApp, _opts, done) => {
      registerDomainModules(legacyApp);
      done();
    },
    { prefix: "/api" }
  );
}
