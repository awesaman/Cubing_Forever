const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { wsEngine: 'ws' });

connectDB();

app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

// Socket Connection
io.on('connection', socket => {
  socket.on('join room', (roomID, socketID, info) => {
    socket.join(roomID);
    // // var clients = io.sockets.clients(roomID);
    // io.of('/')
    //   .in(roomID)
    //   .clients(function (error, clients) {
    //     // console.log(clients);
    //     // console.log(sID);
    //     // io.clients[sID].send()
    //     socket.to(socketId).emit('give users', clients);
    //   });
    socket.to(roomID).emit('user connected', socketID, info);
  });
  socket.on('input message', (roomID, msg) => {
    socket.to(roomID).emit('output message', msg);
  });
  // socket.on('user info', (socketID, username) => {
  //   io.to(socketID).emit('final', username);
  // });
  // socket.on('give users', (roomID, socketID) => {
  //   socket.to(roomID).emit('send back', socketID);
  // console.log('give users');
  // var clients = io.sockets.adapter.rooms[roomID].sockets;
  // for (var clientID in clients) {
  //   var client = io.sockets.connected[clientID].name;
  //   io.to(socketID).emit('names', client);
  // }
  // });
  socket.on('solved', (roomID, username, session) => {
    socket.to(roomID).emit('stats', username, session);
  });

  socket.on('new scramble', (roomID, scramble) => {
    socket.to(roomID).emit('get scramble', scramble);
  });

  socket.on('new event', (roomID, event) => {
    socket.to(roomID).emit('get event', event);
  });

  socket.on('event scramble', (event, scramble, socketID) => {
    socket.to(socketID).emit('get both', event, scramble);
  });
  socket.on('host left', roomID => {
    socket.to(roomID).emit('host open');
  });
  socket.on('new host', roomID => {
    socket.to(roomID).emit('host closed');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
server.on('error', error => {
  throw new Error(`[Server]::ERROR:${error.message}`);
});
