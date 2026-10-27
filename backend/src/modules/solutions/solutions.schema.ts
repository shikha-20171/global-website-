import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createSolutionSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  problemStatement: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  capabilities: z.array(z.string()).default([]),
  relatedProducts: z.array(z.string()).default([]),
  icon: z.string().default("Layers"),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  displayOrder: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateSolutionSchema = createSolutionSchema.partial();

export type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
export type UpdateSolutionInput = z.infer<typeof updateSolutionSchema>;
