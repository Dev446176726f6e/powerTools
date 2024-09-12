const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");
const Shop = require("./shop");
const Tool = require("./tool");

const ShopTool = sequilize.define(
  "ShopTool",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tool_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rent_price: {
      type: DataTypes.DECIMAL(10, 3),
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 3),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

ShopTool.belongsTo(Shop);
Shop.hasMany(ShopTool);

ShopTool.belongsTo(Tool);
Tool.hasMany(ShopTool);

module.exports = ShopTool;
