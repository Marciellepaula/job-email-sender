require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5434/job_email_sender",
    dialect: "postgres",
    define: {
      underscored: true,
      timestamps: true,
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
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
