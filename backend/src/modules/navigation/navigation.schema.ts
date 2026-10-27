import { z } from "zod";
import { MenuLocation } from "@prisma/client";

export const createNavItemSchema = z.object({
  menuLocation: z.nativeEnum(MenuLocation).default(MenuLocation.HEADER),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
  parentId: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  hasMegaMenu: z.boolean().default(false),
  icon: z.string().optional(),
  badge: z.string().optional(),
  isExternal: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const updateNavItemSchema = createNavItemSchema.partial();

export type CreateNavItemInput = z.infer<typeof createNavItemSchema>;
export type UpdateNavItemInput = z.infer<typeof updateNavItemSchema>;
