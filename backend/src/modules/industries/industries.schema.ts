import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createIndustrySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().min(1, "Full description is required"),
  metrics: z.any().default([]),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  productsUsed: z.array(z.string()).default([]),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  displayOrder: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateIndustrySchema = createIndustrySchema.partial();

export type CreateIndustryInput = z.infer<typeof createIndustrySchema>;
export type UpdateIndustryInput = z.infer<typeof updateIndustrySchema>;
