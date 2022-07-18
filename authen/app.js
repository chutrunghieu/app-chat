const express = require('express')
const bodyParser = require('body-parser');
const db = require("./config/database");
const index =  require('./models/index');
const config = require('./config/passport');
const passport = require('passport');
const morgan = require('morgan');
const systemRouter = require('./routes/system')
const kafka = require('kafka-node');
const app = express()

//connect database
const testDatabase = async (req, res) => {
  try {
    const check = await db.authenticate();
    if(check){
    console.log('Connection has been established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
testDatabase();

//parse json request body
app.use(express.json());

//parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//audit log
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//api routes
app.use('/', systemRouter);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', config.jwtStrategy);

//kafka
const client = new kafka.KafkaClient({kafkaHost: process.env.KAFKA_BOOSTRAP_SERVER|| "kafka:9092"})
const producer = new kafka.Producer(client);


const PORT = process.env.PORT || 3000;

app.listen(PORT);

module.exports = {app,producer};