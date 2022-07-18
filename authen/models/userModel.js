const { Sequelize, DataTypes } = require("sequelize");
const {tokenModel} = require("./index.js");
const db = require('../config/database'); 

const user = db.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.TEXT,
      unique: {
        args: true,
        msg: 'Username already in use!',
        },
    },
    password: {
      type: DataTypes.TEXT,
    },
    role: {
      type: DataTypes.ENUM(["user", "admin"]),
      defaultValue: "user",
    },
  });

  user.hasMany(tokenModel, {
    targetKey: 'user_id',
    foreignKey: 'user_id',
  });
  tokenModel.belongsTo(user, { foreignKey: 'user_id', targetKey: 'user_id' });

module.exports = user;