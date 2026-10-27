import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Administrative email is required"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid administrative email is required"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Password reset token is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
