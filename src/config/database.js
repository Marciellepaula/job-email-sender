import { Sequelize } from "sequelize";
import { config } from "./index.js";

const isProduction = config.nodeEnv === "production";

const sequelize = new Sequelize(config.database.url, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
