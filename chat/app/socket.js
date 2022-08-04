const socket = (io) => {
    io.on('connection', (socket) => {
        console.log("user connected");
        socket.on('disconnect', () => {
          const userId = socket.id;
          console.log("user disconnected");
      
        });;
        socket.on('join', (user_id) => {
          socket.id = user_id;
          socket.join(user_id);
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
      
};

module.exports = socket;
