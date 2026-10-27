import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createProductPlanSchema = z.object({
  productId: z.string().nullable().optional(),
  slug: z.string().min(1, "Plan slug is required"),
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  monthlyPriceUsd: z.number().nullable().optional(),
  annualPriceUsd: z.number().nullable().optional(),
  annualDiscountPercent: z.number().int().default(20),
  userLimit: z.string().optional(),
  usageQuota: z.string().optional(),
  features: z.array(z.string()).default([]),
  isHighlighted: z.boolean().default(false),
  isTrialEligible: z.boolean().default(true),
  isEnterprise: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
});

export const updateProductPlanSchema = createProductPlanSchema.partial();

export type CreateProductPlanInput = z.infer<typeof createProductPlanSchema>;
export type UpdateProductPlanInput = z.infer<typeof updateProductPlanSchema>;
