import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export function registerCors(app: FastifyInstance) {
  // Support Chrome Private Network Access (PNA / Local Network Access)
  app.addHook("onRequest", async (req, reply) => {
    if (req.headers["access-control-request-private-network"]) {
      reply.header("Access-Control-Allow-Private-Network", "true");
    }
  });

  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

  app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin, matched origin, cloud preview domains, local network IP, or dev/test
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith("dezoryn.com") ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://172.") ||
        env.NODE_ENV === "development" ||
        env.NODE_ENV === "test"
      ) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Cookie",
      "Access-Control-Request-Private-Network",
    ],
    exposedHeaders: ["Access-Control-Allow-Private-Network"],
  });
}

