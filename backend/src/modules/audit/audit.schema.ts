import { z } from "zod";
import { AuditResult } from "@prisma/client";

export const auditQuerySchema = z.object({
  module: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  result: z.nativeEnum(AuditResult).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  page: z.coerce.number().int().min(1).default(1),
});

export type AuditQueryInput = z.infer<typeof auditQuerySchema>;
