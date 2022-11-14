const dotenv = require("dotenv");
const { userServices, messageServices, conversationServices } = require('../services/index');
dotenv.config();

class userC {
    constructor(io) {
        this.io = io;
        this.addMessage = this.addMessage.bind(this);
        this.showChat = this.showChat.bind(this);
        this.createConversation = this.createConversation.bind(this);
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
            res.status(400).json({ message: "Error!" });
        };
    };

    async addMessage(req, res) {
        const { content, conversation_id, name } = req.body;
        const member = [req.user.user_id];
        try {
            const findOneConversation = await conversationServices.findOneConversation(conversation_id);
            if (findOneConversation) {
                    const message = await messageServices.createMessage(req.user.user_id, content, findOneConversation.conversation_id);
                    if (message) {
                        this.io.sockets
                            .in(conversation_id)
                            .emit('new-message', conversation_id, message);
                        return res.status(200).json({ msg: "Success", message });
                    }
            } else {
                const createConversation = await conversationServices.createConversation(req.user.user_id, name, member);
                if (createConversation) {
                    const message = await messageServices.createMessage(req.user.user_id, content, createConversation.conversation_id);
                    if (message) {
                        this.io.sockets
                            .in(conversation_id)
                            .emit('new-message', conversation_id, message);
                        return res.status(200).json({ msg: "Success", message });
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: "Error!" });
        }
    }

    async createConversation(req, res) {
        const { name, member_id } = req.body;
        const member = [req.user.user_id];
        try {
            member_id.forEach((user) => {
                member.push(user);
            })
            const createConversation = await conversationServices.createConversation(req.user.user_id, name, member);
            member.forEach((userId) => {
                this.io.sockets
                .in(userId)
                .emit('create-conversation', createConversation)
            })
            return res.status(200).json({ msg: "Success", createConversation });
        } catch (error) {
            res.status(400).json({ message: "Error!" });
            console.log(error);
        }
    }

    async getConversation(req, res) {
        try {
            const findUser = await userServices.findUser(req.user.user_id);
            const getConversation = await conversationServices.findAllConversation(findUser.user_id);
            return res.status(200).json({ msg: "Success", getConversation });
        } catch (error) {
            res.status(400).json({ message: "Error!" });
        }
    }

    async showChat(req, res) {
        const { conversation_id } = req.params;
        try {
            const getOneConversation = await conversationServices.showChat(conversation_id);
            if (getOneConversation) {
                this.io.sockets
                    .in(conversation_id)
                    .emit('conversation', getOneConversation);
                return res.status(200).json({ msg: "Success", getOneConversation });
            }
            return res.status(200).json({ msg: "Success", getOneConversation });
        } catch (error) {
            res.status(400).json({ message: "Error!" });
        }
    }
}

module.exports = userC;