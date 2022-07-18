const dotenv = require("dotenv");
const { userServices, messageServices, conversationServices } = require('../services/index');
dotenv.config();

class userC {
    constructor(io) {
        this.io = io;
        // this.getList = this.getList.bind(this);
        // this.getListByChannelId = this.getListByChannelId.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.showChat = this.showChat.bind(this);
        // this.addFile = this.addFile.bind(this);
        // this.addFileWithBase64 = this.addFileWithBase64.bind(this);
        // this.deleteById = this.deleteById.bind(this);
        // this.addReaction = this.addReaction.bind(this);
        // this.shareMessage = this.shareMessage.bind(this);
    }

    async createUser(req, res) {
        const { email, password, confPassword } = req.body;
        try {
            if (password !== confPassword) {
                return res.status(400).json({ message: "Confirm Password Error!" });
            } else {
                const newUser = await userServices.createUser(email, password);
                res.status(200).json({ message: "Register success!", data: [newUser] });
            };
        } catch (error) {
            res.status(404).json({ message: "Error!" });
            console.log(error);
        };
    };

    async addMessage(req, res) {
        const { content, user_id, conversation_id, name } = req.body;
        const member = [user_id];
        try {
            const findOneConversation = await conversationServices.findOneConversation(conversation_id);
            if (findOneConversation.conversation_id === conversation_id) {
                const message = await messageServices.createMessage(user_id, content, findOneConversation.conversation_id);
                if (message) {
                    this.io.to(conversation_id + '')
                        .emit('new-message', conversation_id, message);
                    res.status(200).json({ msg: "Success", message });
                }
            } else {
                const createConversation = await conversationServices.createConversation(user_id, name, member);
                if (createConversation) {
                    const message = await messageServices.createMessage(user_id, content, createConversation.conversation_id);
                    if (message) {
                        this.io.to(conversation_id + '')
                            .emit('new-message', conversation_id, message);
                        res.status(200).json({ msg: "Success", message});
                    }
                }
            }
            this.io.on('message', (message) => {
                console.log(message);
              });
        } catch (error) {
            console.log(error);
        }
    }

    async createConversation(req, res) {
        const { name, user_id, member_id } = req.body;
        const member = [user_id];
        try {
            member_id.forEach((user) => {
                member.push(user);
            })
            const createConversation = await conversationServices.createConversation(user_id, name, member);
            return res.status(200).json({ msg: "Success", createConversation });
        } catch (error) {
            console.log(error);
        }
    }

    async getConversation(req, res) {
        const { user_id } = req.body;
        try {
            const findUser = await userServices.findUser(user_id);
            const getConversation = await conversationServices.findAllConversation(findUser.user_id);
            return res.status(200).json({ msg: "Success", getConversation });
        } catch (error) {
            console.log(error);
        }
    }

    async showChat(req, res) {
        const { conversation_id } = req.params;
        try {
            const getOneConversation = await conversationServices.showChat(conversation_id);
            if (getOneConversation) {
                this.io.to(conversation_id + '')
                    .emit('conversation', getOneConversation);
                return res.status(200).json({ msg: "Success", getOneConversation });
            }
            return res.status(200).json({ msg: "Success", getOneConversation });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = userC;