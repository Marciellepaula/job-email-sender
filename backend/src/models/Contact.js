import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  recruiterName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

export default Contact;
