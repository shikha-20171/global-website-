import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createPageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Page title is required"),
  subtitle: z.string().optional(),
  pageType: z.string().default("Core"),
  template: z.string().default("Standard"),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

export const updatePageSchema = createPageSchema.partial();

export const updateSectionSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  content: z.string().optional(),
  settings: z.any().optional(),
  isEnabled: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
