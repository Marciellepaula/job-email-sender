import app from "./app.js";
import { config } from "./config/index.js";
import { sequelize } from "./models/index.js";

async function start() {
  console.log("[Boot] NODE_ENV=" + config.nodeEnv);
  console.log("[Boot] DATABASE_URL=" + (config.database.url ? "set" : "NOT SET!"));
  console.log("[Boot] PORT=" + config.port);

  if (!config.database.url) {
    console.error("[Fatal] DATABASE_URL is not set! Add it to environment variables.");
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log("[Database] PostgreSQL connected");

    await sequelize.sync({ alter: true });
    console.log("[Database] Tables synced");

    app.listen(config.port, "0.0.0.0", () => {
      console.log("[Server] Running on port " + config.port);
    });
  } catch (err) {
    console.error("[Fatal] " + err.message);
    process.exit(1);
  }
}

start();
