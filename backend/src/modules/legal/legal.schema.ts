import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const updateLegalPolicySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  version: z.string().optional(),
  lastReviewedDate: z.string().optional(),
  status: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const u = val.toUpperCase().trim();
        if (u === "PUBLISHED" || u === "DRAFT" || u === "ARCHIVED") return u;
      }
      return val;
    }, z.nativeEnum(PublishStatus))
    .optional(),
  frameworks: z.any().optional(),
  clauses: z.any().optional(),
  displayOrder: z.number().int().optional(),
});

export type UpdateLegalPolicyInput = z.infer<typeof updateLegalPolicySchema>;
