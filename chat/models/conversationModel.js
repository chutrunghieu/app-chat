const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/database');
const { messageModel, userConversation, userModel } = require("./index.js");

const conversation = db.define('conversation', {
    conversation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT
    },
    member: {
        type : DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

conversation.hasMany(messageModel, {
    targetKey: 'conversation_id',
    foreignKey: 'conversation_id',
});
messageModel.belongsTo(conversation, { foreignKey: 'conversation_id', targetKey: 'conversation_id' });

userModel.hasMany(conversation, {
    targetKey: 'user_id',
    foreignKey: 'user_id',
});
conversation.belongsTo(userModel, { foreignKey: 'user_id', targetKey: 'user_id' });


// conversation.hasMany(userConversation, {
//     targetKey: 'conversation_id',
//     foreignKey: 'conversation_id',
// });
// userConversation.belongsTo(conversation, { foreignKey: 'conversation_id', targetKey: 'conversation_id' });

module.exports = conversation;