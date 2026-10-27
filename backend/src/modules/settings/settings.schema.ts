import { z } from "zod";
import { SettingGroup } from "@prisma/client";

export const updateSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  description: z.string().optional(),
  group: z.nativeEnum(SettingGroup).default(SettingGroup.GENERAL),
  isSecret: z.boolean().default(false),
});

export const bulkUpdateSettingsSchema = z.record(z.string());

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
export type BulkUpdateSettingsInput = z.infer<typeof bulkUpdateSettingsSchema>;
