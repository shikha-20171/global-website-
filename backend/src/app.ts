import Fastify, { FastifyInstance } from "fastify";
import { registerCors } from "./plugins/cors.js";
import { registerCookie } from "./plugins/cookie.js";
import { registerRateLimit } from "./plugins/rateLimit.js";
import { registerMultipart } from "./plugins/multipart.js";
import { registerStatic } from "./plugins/static.js";
import { registerSwagger } from "./plugins/swagger.js";
import { registerErrorHandler } from "./plugins/errorHandler.js";
import { registerRoutes } from "./routes/index.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : process.env.NODE_ENV === "test" ? "silent" : "warn",
    },
    trustProxy: true,
  });

  // 1. Plugins Registration
  registerCors(app);
  registerCookie(app);
  registerRateLimit(app);
  registerMultipart(app);
  registerStatic(app);
  registerSwagger(app);
  registerErrorHandler(app);

  // 2. Central API Routes (/api/v1 and /api)
  registerRoutes(app);

  return app;
}
