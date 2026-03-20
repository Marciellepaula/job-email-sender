import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { UPLOADS_DIR } from "./config/paths.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { setupSwagger } from "./docs/swagger.js";
import { config } from "./config/index.js";

const app = express();

const corsOrigin = config.cors.origin;
const corsOptions =
  typeof corsOrigin === "string" && corsOrigin
    ? { origin: corsOrigin.split(",").map((o) => o.trim()) }
    : { origin: true };

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.use("/uploads", express.static(UPLOADS_DIR));

setupSwagger(app);
app.use("/api", routes);

app.use(errorHandler);

export default app;
