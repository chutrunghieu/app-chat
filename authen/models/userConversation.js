const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/database');
const { conversationModel, userModel } = require("./index.js");

const userConversation = db.define('userConversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

userModel.belongsToMany(conversationModel, { through: userConversation });
conversationModel.belongsToMany(userModel, { through: userConversation });

module.exports = userConversation;