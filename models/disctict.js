const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");

const District = sequilize.define(
  "District",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(111),
      allowNull: false,
      validate: {},
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = District;
