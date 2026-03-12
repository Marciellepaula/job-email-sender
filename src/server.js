import app from "./app.js";
import { config } from "./config/index.js";
import { sequelize } from "./models/index.js";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("[Database] PostgreSQL connected");

    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║  Job Email Sender API                         ║
║  http://localhost:${config.port}                       ║
║  PostgreSQL connected                         ║
║  Swagger: http://localhost:${config.port}/api/docs      ║
╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error("[Fatal]", err);
    process.exit(1);
  }
}

start();
