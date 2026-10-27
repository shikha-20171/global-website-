import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z.coerce.number().default(5001),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET must be at least 16 characters long")
    .default("dezoryn-super-secret-jwt-key-2026-production-grade"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().default("admin@dezoryn.com"),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).default("SuperSecretAdminPassword2026!"),
  ADMIN_BOOTSTRAP_NAME: z.string().default("Shikha Gour"),
  ADMIN_URL: z.string().optional(),
  SMTP_SERVICE: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
