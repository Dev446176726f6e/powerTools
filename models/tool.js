const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");

const Tool = sequilize.define(
  "Tool",
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
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: [5, 500],
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Tool;
