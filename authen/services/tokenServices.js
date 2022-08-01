const model = require('../models/index');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
dotenv.config();


exports.signToken = async (req, res, user) => {
    try {
        // sign token
        const accessToken = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });
        req.token = accessToken;
        const refreshToken = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
    }
};

exports.destroyToken = async (value) => {
    try {
        const token = await model.tokenModel.findOne({
            where: {
                data_token: value
            }
        });
        if (token) {
            const result = await token.destroy({
                where: {
                    [Op.or]: [{ user_id: value }, { data_token: value }]
                },
            });
            return result;
        }
    } catch (error) {
        console.log(error);
    }
};
exports.createToken = async (user_id, refreshToken) => {
    try {
        const newToken = await model.tokenModel.create({ data_token: refreshToken, user_id: user_id });
        return newToken;
    } catch (error) {
        console.log(error);
    }
};
exports.findToken = async (refreshToken) => {
    try {
        const findToken = await model.tokenModel.findOne({
            where: {
                data_token: refreshToken
            }
        });
        return findToken;
    } catch (error) {
        console.log(error);
    }
};
exports.updateToken = async (refreshToken, token_id) => {
    try {
        const newToken = await model.tokenModel.update({ data_token: refreshToken }, { where: { token_id: token_id } });
        return newToken;
    } catch (error) {
        console.log(error);
    }
}