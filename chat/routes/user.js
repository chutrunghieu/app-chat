const express = require("express");
const router = require('express').Router();
const userC = require('../controllers/userC');

const routerUser = (io) => {
    const userController = new userC(io);
    router.post('/createUser', userController.createUser);
    router.post('/addMessage', userController.addMessage);
    router.post('/createConversation', userController.createConversation);
    router.get('/showChat/:conversation_id', userController.showChat);
    return router;
};

module.exports = routerUser;