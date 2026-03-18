"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("sent_logs", "message_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "delivered_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "opened_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "clicked_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "bounced_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("sent_logs", "open_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addIndex("sent_logs", ["message_id"]);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("sent_logs", "message_id");
    await queryInterface.removeColumn("sent_logs", "delivered_at");
    await queryInterface.removeColumn("sent_logs", "opened_at");
    await queryInterface.removeColumn("sent_logs", "clicked_at");
    await queryInterface.removeColumn("sent_logs", "bounced_at");
    await queryInterface.removeColumn("sent_logs", "open_count");
  },
};
