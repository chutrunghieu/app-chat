
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.POSTGRES_URL
  // 'auth_chat', 'postgres', 'acevip123', {
  //   host:'postgresAuth',
  //   dialect: 'postgres',
  //   port: 2345
  // }
  );
db.sync();
module.exports = db;