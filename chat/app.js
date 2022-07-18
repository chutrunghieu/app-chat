const express = require('express')
const bodyParser = require('body-parser');
const db = require("./config/database");
const index = require('./models/index');
const morgan = require('morgan');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');
const routes = require('./routes')
const kafka = require('kafka-node');
const app = express()

//connect database
const testDatabase = async (req, res) => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
testDatabase();

//parse json request body
app.use(express.json());

//parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//audit log
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
//socket.io
const server = http.createServer(app);
const io = socketio(server
  //   , {cors: {

  //   origin: "http://localhost:1209",

  //   credentials: true,

  // },}
);

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const userId = socket.user_id;
  });;
  socket.on('join', (user_id) => {
    socket.user_id = user_id;
    socket.join(user_id);
    console.log(user_id);
  });
  socket.on('join-conversations', (conversation_ids) => {
    conversation_ids.forEach((id) => socket.join(id));
  });
  socket.on('join-conversation', (conversation_id) => {
    socket.join(conversation_id);
  });
  socket.on('leave-conversation', (conversation_id) => {
    socket.leave(conversation_id);
  });
  socket.on('chat-message', (conversation_id, message) => {
    socket.broadcast
      .to(conversation_id)
      .emit('chat-message', conversation_id, message);
  });
})

//api routes
routes(app, io);

//kafka
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BOOSTRAP_SERVER || "kafka:9092" })
client.createTopics([{
  topic: 'topic',
  partitions: 1,
}], (err, result) => {
  if (err) {
    console.log(err);
  } else {
    return result
  }
})
const consumer = new kafka.Consumer(client, [{ topic: process.env.KAFKA_TOPIC || 'topic', partition: 0 }],
  {
    autoCommit: false
  });


const PORT = process.env.PORT || 1209;

server.listen(PORT);

module.exports = { app, consumer };