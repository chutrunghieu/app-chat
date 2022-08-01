const model = require('../models/index');
const bcrypt = require("bcrypt");
exports.findUser = async (user_id) => {
    try {
        const findUser = await model.userModel.findOne({ where: { user_id: user_id } });
        return findUser;
    } catch (error) {
        console.log(error);
    }
}
exports.findUserExist = async (email) => {
    try {
        const findUserExist = await model.userModel.findOne({ where: { email: email } });
        return findUserExist;
    } catch (error) {
        console.log(error);
    }
}
exports.createUser = async (email, password) => {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        const newUser = await model.userModel.create({
            email: email,
            password: hashPassword,
        });
        return newUser;
    } catch (error) {
        console.log(error);
    }
};
exports.updateUser = async (name, phone, address, user_id) => {
    try {
        const updateUser = await model.userModel.update({
            name: name,
            phone: phone,
            address: address,
        }, { where: { user_id: user_id } });
        return updateUser;
    } catch (error) {
        console.log(error);
    }
}

exports.deleteUser = async (user_id) => {
    try {
        const deleteUser = await model.userModel.destroy(user_id);
        return deleteUser;
    } catch (error) {
        console.log(error);
    }
}