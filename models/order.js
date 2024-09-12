const { Client } = require("pg");
const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");
const ShopTool = require("./shop_tool");

const Order = sequilize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_Id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shop_tool_Id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
    },
    period: {
      type: DataTypes.BIGINT,
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

Order.belongsTo(Client);
Client.hasMany(Order);

Order.belongsTo(ShopTool);
ShopTool.hasMany(Order);

module.exports = Order;
