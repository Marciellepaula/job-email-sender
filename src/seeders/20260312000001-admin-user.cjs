"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL || "admin@admin.com";
    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = '${email}' LIMIT 1`
    );

    if (existing.length > 0) return;

    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: process.env.ADMIN_NAME || "Admin",
        email,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL || "admin@admin.com";
    await queryInterface.bulkDelete("users", { email });
  },
};
