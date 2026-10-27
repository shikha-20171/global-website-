import { z } from "zod";
import { AssetType } from "@prisma/client";

export const createMediaAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  altText: z.string().optional(),
  filePath: z.string().min(1, "File path is required"),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  dimensions: z.string().optional(),
  assetType: z.nativeEnum(AssetType).default(AssetType.PRODUCT_ART),
});

export const updateMediaAssetSchema = createMediaAssetSchema.partial();

export type CreateMediaAssetInput = z.infer<typeof createMediaAssetSchema>;
export type UpdateMediaAssetInput = z.infer<typeof updateMediaAssetSchema>;
