const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/database'); 
const { userModel } = require("./index.js");


const token = db.define('token',{
    token_id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    data_token: {
        type:DataTypes.TEXT,
    },
    type: {
        type: DataTypes.ENUM(["refreshToken", "expired"]),
        defaultValue: "refreshToken",
    },
    user_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
}); 

userModel.hasMany(token, {
    targetKey: 'user_id',
    foreignKey: 'user_id',
  });
token.belongsTo(userModel, { foreignKey: 'user_id', targetKey: 'user_id' });

module.exports = token;