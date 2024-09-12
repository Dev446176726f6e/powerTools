const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");
const Owner = require("./owner");
const District = require("./disctict");

const Shop = sequilize.define(
  "Shop",
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
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+998\d{9}$/,
      },
    },
    district_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.BIGINT,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Shop.belongsTo(Owner);
Owner.hasMany(Shop);

Shop.belongsTo(District);
District.hasMany(Shop);

module.exports = Shop;
