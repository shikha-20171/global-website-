import fastifyCookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export function registerCookie(app: FastifyInstance) {
  app.register(fastifyCookie, {
    secret: env.JWT_SECRET,
    hook: "onRequest",
  });
}
