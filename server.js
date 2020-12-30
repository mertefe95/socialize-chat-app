const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./misc/messages');
const {
  userJoined,
  getTheCurrentUser,
  userLeft,
  getTheRoomUsers
} = require('./misc/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Application Director Mr. John  ';

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoined(socket.id, username, room);

    socket.join(user.room);

    
    socket.emit('message', formatMessage(adminName, 'Welcome to Socialize!'));

    
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(adminName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getTheRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getTheCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeft(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(adminName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getTheRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
