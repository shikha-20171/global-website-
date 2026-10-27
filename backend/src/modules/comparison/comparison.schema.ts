import { z } from "zod";
import { ComparisonCategory, AttributeDataType } from "@prisma/client";

export const createAttributeSchema = z.object({
  key: z.string().min(1, "Key is required"),
  name: z.string().min(1, "Name is required"),
  category: z.nativeEnum(ComparisonCategory).default(ComparisonCategory.ARCHITECTURE),
  dataType: z.nativeEnum(AttributeDataType).default(AttributeDataType.BOOLEAN),
  defaultValue: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateAttributeSchema = createAttributeSchema.partial();

export const setComparisonValueSchema = z.object({
  productId: z.string().min(1),
  attributeId: z.string().min(1),
  valueBool: z.boolean().nullable().optional(),
  valueText: z.string().nullable().optional(),
});

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;
export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>;
export type SetComparisonValueInput = z.infer<typeof setComparisonValueSchema>;
