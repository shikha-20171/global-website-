import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import path from "path";
import fs from "fs";

export function registerStatic(app: FastifyInstance) {
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: "/uploads/",
    decorateReply: false,
  });
}
