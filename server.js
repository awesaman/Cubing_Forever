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
  socket.on('join room', (roomID, username) => {
    socket.join(roomID);
    socket.to(roomID).emit('user connected', username);
  });
  socket.on('input message', (roomID, msg) => {
    socket.to(roomID).emit('output message', msg);
    console.log('listened');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
