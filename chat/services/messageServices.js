const model = require('../models/index');

exports.createMessage = async(user_id, content, conversation_id) =>{
    try {
        const createMessage = await model.messageModel.create({user_id: user_id, content : content, conversation_id: conversation_id });
        return createMessage;
    } catch (error) {
        console.log(error);
    }
}

exports.updateMessage = async(content, message_id) =>{
    try {
        const updateMessage = await model.messageModel.create({content : content}, {where : {message_id : message_id}});
        return updateMessage;
    } catch (error) {
        console.log(error);
    }
}

exports.deleteMessage = async(message_id) =>{
    try {
        const deleteMessage = await model.messageModel.destroy({where: {message_id: message_id}});
        return deleteMessage;
    } catch (error) {
        console.log(error);
    }
}

exports.findOneMessage = async(message_id) =>{
    try {
        const findOneMessage = await model.messageModel.findOne({where: {message_id:message_id}});
        return findOneMessage;
    } catch (error) {
        console.log(error);
    }
}

exports.findAllMessage = async(conversation_id) =>{
    try {
        const findAllMessage = await model.messageModel.findAll({where:{conversation_id: conversation_id}});
        return findAllMessage;
    } catch (error) {
        console.log(error);
    }
}