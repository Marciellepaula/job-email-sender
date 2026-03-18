"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("sent_logs", "provider", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "subject", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "recruiter_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "has_attachment", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("sent_logs", "provider");
    await queryInterface.removeColumn("sent_logs", "subject");
    await queryInterface.removeColumn("sent_logs", "recruiter_name");
    await queryInterface.removeColumn("sent_logs", "has_attachment");
  },
};
