import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../shared/errors.js";
import { errorResponse } from "../shared/response.js";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | AppError | ZodError | any, request: FastifyRequest, reply: FastifyReply) => {
    // 1. Zod Validation Errors
    if (error instanceof ZodError) {
      reply.status(400).send(
        errorResponse(
          "Validation Error",
          error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }))
        )
      );
      return;
    }

    // 2. Custom Domain AppErrors
    if (error instanceof AppError) {
      reply.status(error.statusCode).send(errorResponse(error.message, error.details));
      return;
    }

    // 3. Fastify Native Validation Errors
    if (error.validation) {
      const detailedMsg = Array.isArray(error.validation) && error.validation.length > 0
        ? error.validation
            .map((v: any) => {
              const field = v.instancePath ? v.instancePath.replace(/^\//, "") : (v.params?.missingProperty || "field");
              return `${field}: ${v.message || "invalid value"}`;
            })
            .join("; ")
        : "Invalid request parameters";

      reply.status(400).send(errorResponse(detailedMsg, error.validation));
      return;
    }

    // 4. Prisma Known Request Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") || "field";
        reply.status(409).send(errorResponse(`Unique constraint violation: ${target} already exists`));
        return;
      }
      if (error.code === "P2025") {
        reply.status(404).send(errorResponse("Requested database record not found"));
        return;
      }
    }

    // 5. Unhandled / Server Errors
    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message || "An unexpected error occurred";

    request.log.error(error);
    reply.status(statusCode).send(errorResponse(message));
  });
}
