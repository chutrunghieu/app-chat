const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/database');
const { userModel } = require("./index.js");


const message = db.define('message',{
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT
    },
    createAt: {
        type: 'TIMESTAMP',
        // type: DataTypes.NOW,
        defaultValue: Sequelize.fn('NOW'),
    },
    conversation_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
    }
});

userModel.hasMany(message, {
    targetKey: 'user_id',
    foreignKey: 'user_id',
});
message.belongsTo(userModel, { foreignKey: 'user_id', targetKey: 'user_id' });

module.exports = message;