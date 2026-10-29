import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

declare global {
  // Allow global `var` declarations in TypeScript
  var __prismaClient: PrismaClient | undefined;
}

export const prisma =
  (globalThis as any).__prismaClient ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  (globalThis as any).__prismaClient = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✓ Connected to PostgreSQL database successfully");

    // Auto-migrate / Self-heal new columns on production PostgreSQL without downtime
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "DemoRequest" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
      console.log("✓ Schema self-heal verified: DemoRequest.phone");
    } catch (healErr: any) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE demorequest ADD COLUMN IF NOT EXISTS phone TEXT;`);
      } catch (inner: any) {
        console.warn("Schema self-heal notice (DemoRequest):", inner?.message || inner);
      }
    }

    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "LeadEnquiry" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
      console.log("✓ Schema self-heal verified: LeadEnquiry.phone");
    } catch (healErr: any) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE leadenquiry ADD COLUMN IF NOT EXISTS phone TEXT;`);
      } catch (inner: any) {
        console.warn("Schema self-heal notice (LeadEnquiry):", inner?.message || inner);
      }
    }
  } catch (error) {
    console.error("✗ Failed to connect to PostgreSQL database:", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
