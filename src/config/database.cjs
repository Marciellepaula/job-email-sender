require("dotenv").config();

const isSSL = process.env.DATABASE_SSL === "true";

module.exports = {
  development: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5434/job_email_sender",
    dialect: "postgres",
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    ...(isSSL && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
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
  },
};
