import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { resolve, join } from "path";
import { existsSync } from "fs";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

// ─── Security & parsing ─────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────
app.use(morgan("dev"));

// ─── Rate limiting ───────────────────────────────────────
app.use("/api", apiLimiter);

// ─── Static files ────────────────────────────────────────
const uploadsDir = resolve("uploads");
app.use("/uploads", express.static(uploadsDir));

// ─── Swagger docs ────────────────────────────────────────
setupSwagger(app);

// ─── Frontend (pre-built) ────────────────────────────────
const frontendDist = resolve("frontend/dist");
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// ─── API routes ──────────────────────────────────────────
app.use("/api", routes);

// ─── Frontend fallback (SPA) ─────────────────────────────
if (existsSync(frontendDist)) {
  app.get("*", (_req, res) => {
    res.sendFile(join(frontendDist, "index.html"));
  });
}

// ─── Centralized error handler ───────────────────────────
app.use(errorHandler);

export default app;
