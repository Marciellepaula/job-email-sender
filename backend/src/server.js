import app from "./app.js";
import { config } from "./config/index.js";
import { sequelize, User } from "./models/index.js";

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

    // Seed admin user on boot (avoids relying on sequelize-cli migrations/seed in Render)
    const adminEmail = config.admin.email;
    if (adminEmail) {
      const adminExists = await User.findOne({ where: { email: adminEmail } });
      if (!adminExists) {
        await User.create({
          name: config.admin.name || "Admin",
          email: adminEmail,
          password: config.admin.password,
        });
        console.log("[Database] Admin user seeded");
      }
    }

    app.listen(config.port, "0.0.0.0", () => {
      console.log("[Server] Running on port " + config.port);
    });
  } catch (err) {
    console.error("[Fatal] " + err.message);
    process.exit(1);
  }
}

start();
