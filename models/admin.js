const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");

const Admin = sequilize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Admin;
