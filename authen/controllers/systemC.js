const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { tokenServices, userServices } = require('../services/index');
dotenv.config();
const { Kafka } = require('kafkajs')
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092']
})


exports.authentication = async (req, res, next) => {
    const consumer = kafka.consumer({ groupId: 'authen' })
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || 'Authen', fromBeginning: true })
    await consumer.run({
        eachMessage: async ({ message }) => {
            const token = message.value.toString();
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    res.status(404).json({ message: "Error!" });
                    console.log(err);
                } else {
                    const user = await userServices.findUser(decoded.user_id);
                    if (user) {
                        return res.json({ user_id: user.user_id, accessToken: token });
                    }
                }
            })
        },
    })
};


exports.authorization = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            res.status(404).json({ message: "Error!" });
            console.log(err);
        } else {
            const user = await userServices.findUser(decoded.user_id);
            if (user) {
                return res.json({user_id: user.user_id, user_role: user.role});
            }
        }
    })
}


exports.register = async (req, res) => {
    const { email, password, confPassword } = req.body;
    try {
        const usr = await userServices.findUserExist(email);
        if (usr) {
            return res.status(400).json({ message: "Email has already existed !" });
        } else if (password !== confPassword) {
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

exports.login = async (req, res) => {
    try {
        const user = await userServices.findUserExist(req.body.email);
        if (!user) {
            return res.status(400).json({ message: "The email does not exist or has been locked !!!" });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Wrong Password", data: {} });
        }
        const { accessToken, refreshToken } = await tokenServices.signToken(req, res, user);
        const newToken = await tokenServices.createToken(user.user_id, refreshToken);
        const producer = kafka.producer()
        await producer.connect()
        await producer.send({
            topic: process.env.KAFKA_TOPIC || 'Authen',
            messages: [
                { value: accessToken },
            ],
        })
        return res.status(200).json({ message: "Success!", data: [accessToken, refreshToken] });
    } catch (error) {
        res.status(404).json({ message: "Error!" });
        console.log(error);
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const data = await tokenServices.destroyToken(refreshToken);
        return res.status(200).json({ message: "Success!", data });
    } catch (error) {
        res.status(404).json({ message: "Error!" });
        console.log(error);
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) return res.sendStatus(401).json({ message: "Error!" });;
        const token = await tokenServices.findToken(refreshToken);
        if (!token) return res.sendStatus(403).json({ message: "Token not found!" });
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            console.log("--------------------------------------------", decoded)
            if (err) return res.sendStatus(403).json({ message: "Expired" });
            const accessToken = jwt.sign({ user_id: decoded.user_id, email: decoded.email, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            const refreshToken = jwt.sign({ user_id: decoded.user_id, email: decoded.email, role: decoded.role }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            const newToken = await tokenServices.updateToken(refreshToken, token.token_id);
            return res.status(200).json({ message: "Success!!", data: [accessToken, refreshToken] });
        });
    } catch (error) {
        res.status(404).json({ message: "Error!" });
        console.log(error);
    }
};
