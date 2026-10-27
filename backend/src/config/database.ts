import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

declare global {
  // Allow global `var` declarations in TypeScript
  var __prismaClient: PrismaClient | undefined;
}

export const prisma =
  global.__prismaClient ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prismaClient = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✓ Connected to PostgreSQL database successfully");
  } catch (error) {
    console.error("✗ Failed to connect to PostgreSQL database:", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
