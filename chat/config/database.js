const Sequelize = require('sequelize');

const db = new Sequelize(process.env.POSTGRES_URL);
db.sync();
module.exports = db;
