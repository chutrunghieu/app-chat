const express = require('express')
const bodyParser = require('body-parser');
const db = require("./config/database");
const index = require('./models/index');
const morgan = require('morgan');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');
const routes = require('./routes')
const { Kafka } = require('kafkajs')

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
// api routes
routes(app, io);


const PORT = process.env.PORT || 1209;

server.listen(PORT);

console.log(PORT);

module.exports = { app};