import rateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export function registerRateLimit(app: FastifyInstance) {
  app.register(rateLimit, {
    max: env.NODE_ENV === "test" ? 10000 : 300,
    timeWindow: "1 minute",
    allowList: ["127.0.0.1", "localhost"],
    errorResponseBuilder: () => ({
      success: false,
      message: "Rate limit exceeded. Please throttle your requests and try again shortly.",
    }),
  });
}
