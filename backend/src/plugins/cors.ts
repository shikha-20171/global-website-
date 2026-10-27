import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export function registerCors(app: FastifyInstance) {
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

  app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === "development" || env.NODE_ENV === "test") {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
  });
}
