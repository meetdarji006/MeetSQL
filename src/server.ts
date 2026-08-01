import app from "./app";
import { env } from "./config/env";
import { pgPool } from "./config/postgres";
import { closeOraclePool } from "./config/oracle";

async function main() {
  const server = app.listen(env.PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║           🚀 MeetSQL API Server              ║
╠══════════════════════════════════════════════╣
║  Port:        ${String(env.PORT).padEnd(30)}║
║  Environment: ${env.NODE_ENV.padEnd(30)}║
║  Database:    PostgreSQL                     ║
║  SQL Engine:  Oracle XE                      ║
╚══════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      console.log("🔌 HTTP server closed");

      try {
        await pgPool.end();
        console.log("🔌 PostgreSQL pool closed");
      } catch (err) {
        console.error("Error closing PostgreSQL pool:", err);
      }

      try {
        await closeOraclePool();
      } catch (err) {
        console.error("Error closing Oracle pool:", err);
      }

      process.exit(0);
    });

    // Force shutdown after 10s
    setTimeout(() => {
      console.error("⚠️ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
