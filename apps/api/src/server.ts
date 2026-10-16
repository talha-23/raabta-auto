import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env.js";

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
  },
});

await app.register(cors, {
  origin: true,
  credentials: true,
});

// Root — friendly sanity check
app.get("/", async () => {
  return {
    service: "Raabta Auto API",
    status: "ok",
    message: "Government Vehicle Compliance AI Agent — API is running.",
    docs: "/health for liveness, /ready for readiness.",
  };
});

// Liveness — "is the process up?"
app.get("/health", async () => {
  return {
    status: "ok",
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  };
});

// Readiness — "is it ready to serve traffic?"
// For now this is identical to /health. In later slices we will add
// database + AI provider checks here.
app.get("/ready", async () => {
  return {
    status: "ready",
    checks: {
      api: "ok",
      database: "not_configured_yet",
      ai_provider: "not_configured_yet",
    },
  };
});

async function start() {
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Raabta Auto API listening on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();