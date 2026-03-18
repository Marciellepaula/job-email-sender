import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SentLog = sequelize.define("SentLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recruiterName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("sent", "failed", "skipped"),
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasAttachment: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  clickedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  bouncedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  openCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default SentLog;
