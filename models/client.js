const sequilize = require("../config/db");
const { DataTypes } = require("sequelize");

const Client = sequilize.define(
  "Client",
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
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+998\d{9}$/,
      },
    },
    otp_id: {
      type: DataTypes.UUID,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Client;
