import { Sequelize } from "sequelize";
import { config } from "./index.js";

const useSSL = process.env.DATABASE_SSL === "true";

const sequelize = new Sequelize(config.database.url, {
  dialect: "postgres",
  logging: false,
  ...(useSSL && {
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  }),
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
