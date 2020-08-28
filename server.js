const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { wsEngine: 'ws', forceNew: true });
const bodyParser = require('body-parser');
connectDB();

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(cors());
app.use(express.json());

// Set Static Folder in Production Build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

// Socket Connection
var rooms = {};
io.on('connection', socket => {
  socket.on('join room', (roomID, socketID, info) => {
    socket.join(roomID);
    socket.to(roomID).emit('user connected', socketID, info);
  });
  socket.on('leave room', (roomID, info) => {
    socket.to(roomID).emit('user left', info);
    socket.leave(roomID);
  });

  socket.on('input message', (roomID, msg) => {
    socket.to(roomID).emit('output message', msg);
  });

  socket.on('solved', (roomID, username, session) => {
    socket.to(roomID).emit('stats', username, session);
  });

  socket.on('new scramble', (roomID, scramble) => {
    socket.to(roomID).emit('get scramble', scramble);
  });

  socket.on('new event', (roomID, event) => {
    rooms = { ...rooms, [roomID]: { ...rooms[roomID], event } };
    socket.to(roomID).emit('get event', event);
  });

  socket.on(
    'send room info',
    (event, scramble, stats, desc, locked, socketID) => {
      socket
        .to(socketID)
        .emit('get room info', event, scramble, stats, desc, locked);
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

  socket.on('initialize room', (roomID, hostname, event, desc, locked) => {
    rooms = {
      ...rooms,
      [roomID]: { hostname, event, desc, locked, numusers: 0 },
    };
  });

  socket.on('request rooms', () => {
    let update_rooms = io.sockets.adapter.rooms;
    let send_rooms = [];
    if (update_rooms) {
      for (var roomID in update_rooms) {
        if (
          rooms[roomID] && // checks its a room we created
          rooms[roomID].locked !== true && // checks its not a private room
          rooms[roomID].hostname !== '' // checks it has a host currently
        ) {
          if (update_rooms[roomID].length > 0) {
            send_rooms = [
              ...send_rooms,
              {
                [roomID]: {
                  ...rooms[roomID],
                  numusers: update_rooms[roomID].length,
                },
              },
            ];
          } else {
            // if no users left, delete the room
            delete rooms[roomID];
          }
        }
      }
    }

    socket.emit('send the rooms', send_rooms);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port${PORT}`);
});
