import { FastifyInstance } from "fastify";
import { healthController } from "./health.controller.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Check service health and database connectivity",
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string" },
                  uptimeSeconds: { type: "number" },
                  database: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      dialect: { type: "string" },
                      latencyMs: { type: "number" },
                      serverTime: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    healthController.checkHealth.bind(healthController)
  );
}
