const redisDb = require('../app/redis');

const handleLeave = async (userId) => {
  await redisDb.del(userId);
};

const handleJoin = async (userId, socketId) => {
  const cachedUser = await redisDb.get(userId);
  if (!cachedUser){
    await redisDb.set(userId, socketId);
  }
};

const socket = (io) => {
  io.on('connect', (socket) => {
      socket.emit('message',  'Welcome to Chat');
      socket.broadcast.emit('message','A user has joined the chat');

      socket.on('disconnect', () => {
          const userId = socket.userId;
          if (userId) handleLeave(socket.userId);
          console.log('disconnected');
      });
      socket.on('join', (userId) => {
          socket.userId = userId;
          handleJoin(userId, socket.id);
          socket.emit('joined', `${userId} has joined the chat`);
      });

      socket.on('join-conversations', (conversationIds) => {
          conversationIds.forEach((id) => socket.join(id));
      });

      socket.on('join-conversation', (conversationId) => {
          socket.join(conversationId);
          socket.emit('joined-conversation', `You has joined the room ${conversationId}`);
      });

      socket.on('leave-conversation', (conversationId) => {
          socket.leave(conversationId);
      });

      socket.on('sendMessage', ({conversationId, content}) => {
        io.sockets
            .in(conversationId)
            .emit('getMessage', {conversationId, content});
      });

  });
};

module.exports = socket;
