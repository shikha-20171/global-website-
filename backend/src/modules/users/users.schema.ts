import { z } from "zod";
import { AdminStatus } from "@prisma/client";

export const createUserSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").default("DezorynAdmin2026!"),
  roleId: z.string().min(1, "Role ID is required"),
  status: z.nativeEnum(AdminStatus).default(AdminStatus.ACTIVE),
  twoFactorEnforced: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  roleId: z.string().min(1).optional(),
  status: z.nativeEnum(AdminStatus).optional(),
  twoFactorEnforced: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
