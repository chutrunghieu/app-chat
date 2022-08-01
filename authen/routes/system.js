const express = require ("express");
const systemC = require('../controllers/systemC');
const router = express.Router();

router.get('/authen', systemC.authentication);

router.get('/author',systemC.authorization)

router.post('/register', systemC.register);
router.post('/login', systemC.login);
router.get('/logout', systemC.logout);
router.post('/refreshToken', systemC.refreshToken);


module.exports = router;

