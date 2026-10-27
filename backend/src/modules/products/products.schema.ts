import { z } from "zod";
import { PublishStatus, BusinessSize, DeploymentType } from "@prisma/client";

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  size: z.nativeEnum(BusinessSize).optional(),
  deployment: z.nativeEnum(DeploymentType).optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const createProductSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Product name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  image: z.string().optional(),
  size: z.nativeEnum(BusinessSize).default(BusinessSize.MEDIUM),
  deployment: z.nativeEnum(DeploymentType).default(DeploymentType.CLOUD),
  isAiPowered: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  rating: z.string().default("4.9/5"),
  hue: z.number().int().default(210),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  displayOrder: z.number().int().default(0),
  tags: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  featuresList: z.any().default([]),
  modules: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  badge: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
