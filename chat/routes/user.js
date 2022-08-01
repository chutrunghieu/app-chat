const express = require("express");
const router = require('express').Router();
const userC = require('../controllers/userC');
const {author, authen} = require('../middleware/auth');

const routerUser = (io) => {
    const userController = new userC(io);
    router.post('/addMessage', author('user'), userController.addMessage);
    router.post('/createConversation', author('user'), userController.createConversation);
    router.get('/showChat/:conversation_id', author('user'), userController.showChat);
    router.get('/getToken', authen);
    return router;
};

module.exports = routerUser;