import multipart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import { MAX_UPLOAD_SIZE_BYTES } from "../config/constants.js";

export function registerMultipart(app: FastifyInstance) {
  app.register(multipart, {
    limits: {
      fileSize: MAX_UPLOAD_SIZE_BYTES,
      files: 1,
    },
  });
}
