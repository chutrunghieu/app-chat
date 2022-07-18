const Sequelize = require('sequelize');

const db = new Sequelize(process.env.POSTGRES_URL
  // 'app_chat', 'postgres', 'acevip123', {
  //   host:'postgresChat',
  //   dialect: 'postgres',
  //   port: 5432
  // }
  );
db.sync();
module.exports = db;
