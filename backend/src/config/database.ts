import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Normalize connection URL if using Neon pooler to prevent idle socket drop errors
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("-pooler")) {
  if (!process.env.DATABASE_URL.includes("pgbouncer=true")) {
    const sep = process.env.DATABASE_URL.includes("?") ? "&" : "?";
    process.env.DATABASE_URL = `${process.env.DATABASE_URL}${sep}pgbouncer=true&connect_timeout=30&pool_timeout=30`;
  }
}

declare global {
  // Allow global `var` declarations in TypeScript
  var __prismaClient: PrismaClient | undefined;
  var __dbKeepAliveTimer: NodeJS.Timeout | undefined;
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

    // Maintain a 45s keepalive ping to prevent Neon / Cloud pooler idle connection disconnects
    if (!(globalThis as any).__dbKeepAliveTimer) {
      (globalThis as any).__dbKeepAliveTimer = setInterval(async () => {
        try {
          await prisma.$queryRaw`SELECT 1;`;
        } catch {
          // Silent catch for background heartbeat
        }
      }, 45000);
      if ((globalThis as any).__dbKeepAliveTimer.unref) {
        (globalThis as any).__dbKeepAliveTimer.unref();
      }
    }

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
  if ((globalThis as any).__dbKeepAliveTimer) {
    clearInterval((globalThis as any).__dbKeepAliveTimer);
    (globalThis as any).__dbKeepAliveTimer = undefined;
  }
  await prisma.$disconnect();
}
