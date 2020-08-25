const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const { log } = require('console');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { wsEngine: 'ws', forceNew: true });

connectDB();

app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

// Socket Connection
var rooms = {};
// var rooms = io.sockets.adapter.rooms;
io.on('connection', socket => {
  socket.on('join room', (roomID, socketID, info) => {
    // let room = io.sockets.adapter.rooms[roomID];
    // let newnum = room === undefined ? 1 : room.length + 1;
    socket.join(roomID);
    socket.to(roomID).emit('user connected', socketID, info);
    // rooms = { ...rooms, [roomID]: { ...rooms[roomID], numusers: newnum } };
  });
  socket.on('leave room', (roomID, info) => {
    // let room = io.sockets.adapter.rooms[roomID];
    // let newnum = room === undefined ? 0 : room.length - 1;
    // if (newnum === 0) {
    //   // console.log(newnum);
    //   // console.log('should be 0 users');
    //   delete rooms[roomID]; //not working
    // } else {
    //   rooms = { ...rooms, [roomID]: { ...rooms[roomID], numusers: newnum } };
    socket.to(roomID).emit('user left', info);
    // }
    socket.leave(roomID);
    // console.log('auto: ', io.sockets.adapter.rooms[roomID].length);
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
    rooms = { ...rooms, [roomID]: { ...rooms[roomID], event } };
    // rooms[roomID] = event;
    // console.log('room: ', rooms[roomID]);
    socket.to(roomID).emit('get event', event);
  });

  socket.on(
    'send room info',
    (event, scramble, stats, speedrange, socketID) => {
      socket
        .to(socketID)
        .emit('get room info', event, scramble, stats, speedrange);
    }
  );

  socket.on('host left', roomID => {
    rooms = { ...rooms, [roomID]: { ...rooms[roomID], hostname: '' } };
    socket.to(roomID).emit('host open');
  });

  socket.on('new host', (roomID, hostname) => {
    rooms = { ...rooms, [roomID]: { ...rooms[roomID], hostname } };
    socket.to(roomID).emit('host closed');
  });

  socket.on('initialize room', (roomID, hostname, event, speedrange) => {
    rooms = {
      ...rooms,
      [roomID]: { hostname, event, speedrange, numusers: 0 },
    };
  });

  socket.on('request rooms', () => {
    let update_rooms = io.sockets.adapter.rooms;
    let send_rooms = [];
    if (update_rooms) {
      for (var roomID in update_rooms) {
        if (
          rooms[roomID] &&
          update_rooms[roomID].length > 0 &&
          rooms[roomID].hostname !== ''
        ) {
          send_rooms = [
            ...send_rooms,
            {
              [roomID]: {
                ...rooms[roomID],
                numusers: update_rooms[roomID].length,
              },
            },
          ];
        }
      }
    }
    // privaterooms =
    console.log(send_rooms);
    socket.emit('send the rooms', send_rooms);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
server.on('error', error => {
  throw new Error(`[Server]::ERROR:${error.message}`);
});
