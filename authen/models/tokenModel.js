const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/database'); 

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
 
module.exports = token;