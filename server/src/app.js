const morgan = require('morgan');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const userRoute = require('./route/user');
const eventRoute = require('./route/event');
const resRoute = require('./route/reservation');
const bookRoute = require('./route/payment');
const { initSeat } = require('./models/seat');

dotenv.config({ path: '../config.env' });

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
}
//app.set('trust proxy', 1);

app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  //  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
initSeat(io);

const setToRoom = new Set();
io.on('connection', (socket) => {
  console.log('new client', socket.id);
  socket.on('join-room', (room) => {
    socket.join(room);
    const serializedSet = [...setToRoom.values()];
    socket.to(room).emit('seat-book', serializedSet);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    if (setToRoom.size > 1) {
      setToRoom.forEach((s) => {
        if (s.room === room) {
          setToRoom.delete(s);
        }
        const serializedSet = [...setToRoom.values()];
        socket.broadcast?.to(s.room)?.emit('seat-book', serializedSet);
      });
    }
  });

  socket.on('disconnect', () => {
    setToRoom.forEach((s) => {
      if (s.socketId === socket.id) {
        setToRoom.delete(s);
        const serializedSet = [...setToRoom.values()];
        socket.broadcast?.to(s.room)?.emit('seat-book', serializedSet);
      }
    });
  });

  socket.on('seat-book', (params) => {
    if (params.state) {
      setToRoom.add({ ...params, socketId: socket.id });
    } else {
      setToRoom.forEach((s) => {
        if (s.seatId === params.seatId) {
          setToRoom.delete(s);
        }
      });
    }
    const serializedSet = [...setToRoom.values()];
    socket.broadcast?.to(params.room)?.emit('seat-book', serializedSet);
  });

  socket.on('event-approve', (event) => {
    socket.broadcast.emit('event-update', { ...event, tempStatus: 'approved' });
  });
});

app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);
app.use('/api/reservation', resRoute);
app.use('/api/booking', bookRoute);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err.message,
  });
});
module.exports = server;
