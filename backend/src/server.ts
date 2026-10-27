import { buildApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  const app = buildApp();

  try {
    // 1. Establish database connection
    await connectDatabase();

    // 2. Start Fastify HTTP server
    const address = await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`✓ Backend server running on ${address} [${env.NODE_ENV}]`);

    // 3. Graceful shutdown handler
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}. Shutting down gracefully...`);
        await app.close();
        await disconnectDatabase();
        process.exit(0);
      });
    }
  } catch (error) {
    console.error("Failed to start DEZORYN server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

startServer();
