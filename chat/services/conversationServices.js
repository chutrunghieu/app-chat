const model = require('../models/index');
const { Op } = require("sequelize");


exports.createConversation = async (user_id, name, member) => {
    try {
        const createConversation = await model.conversationModel.create({ user_id: user_id, name: name, member: member });
        return createConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.updateNameConversation = async (name, conversation_id) => {
    try {
        const updateConversation = await model.conversationModel.create({ name: name }, { where: { conversation_id: conversation_id } });
        return updateConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.updateMemberConversation = async (member, conversation_id) => {
    try {
        const updateConversation = await model.conversationModel.create({ member: member }, { where: { conversation_id: conversation_id } });
        return updateConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.deleteConversation = async (conversation_id) => {
    try {
        const deleteConversation = await model.conversationModel.destroy({ where: { conversation_id: conversation_id } });
        return deleteConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.findOneConversation = async (conversation_id) => {
    try {
        const findOneConversation = await model.conversationModel.findOne({ 
            where: { 
                conversation_id: conversation_id
            }},{
            include:[{
                    model: model.userModel,
                    association: 'user'
            },
            {
                model: model.userModel,
                through : {attributes:[]}                
            }
        ]
        });
        return findOneConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.findAllConversation = async (user_id) => {
    try {
        const findAllConversation = await model.conversationModel.findAll({
            where: {
                [Op.or]: [{ user_id: user_id }, { member : user_id}]
            },
        });
        return findAllConversation;
    } catch (error) {
        console.log(error);
    }
}

exports.showChat = async (conversation_id) => {
    try {
        const findOneConversation = await model.messageModel.findAll({ 
            where: { 
                conversation_id: conversation_id
            },
            include:[
                {
                    model: model.userModel,
                    association: "user",
                },
                {
                    model: model.conversationModel,
                    association: "conversation",
                }
            ]
        });
        return findOneConversation;
    } catch (error) {
        console.log(error);
    }
}