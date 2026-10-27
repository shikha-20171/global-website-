import { prisma } from "../../config/database.js";

export class HealthService {
  async getHealthStatus() {
    const startTime = Date.now();
    const [dbResult] = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
    const dbLatencyMs = Date.now() - startTime;

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: "connected",
        dialect: "PostgreSQL",
        latencyMs: dbLatencyMs,
        serverTime: dbResult.now.toISOString(),
      },
      environment: process.env.NODE_ENV || "development",
    };
  }
}

export const healthService = new HealthService();
