const path = require('path');
const morgan = require('morgan');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const eventController = require('./controller/eventController');
const userRoute = require('./route/userRoute');
const eventRoute = require('./route/eventRoute');
const resRoute = require('./route/reservationRoute');

dotenv.config({ path: '../config.env' });

app.use(cors({ credentials: true, origin: true }));

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
//app.use(express.static(path.join(__dirname, '/public')));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60,
//       sameSite: true,
//     },
//   })
// );

app.use((req, res, next) => {
  //console.log(req.headers);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const setToRoom = new Set();
io.on('connection', (socket) => {
  console.log('new client', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    socket.broadcast.to(room).emit('seat-book', [...setToRoom.values()]);
  });
  socket.on('leave-room', (room) => {
    socket.leave(room);
  });
  socket.on('disconnect', () => {
    setToRoom.clear();
  });
  socket.on('seat-book', (params) => {
    //   console.log(params.state);
    if (params.state) {
      setToRoom?.add(params);
    } else {
      setToRoom?.forEach((s) => {
        if (s.seatId === params.seatId) {
          setToRoom?.delete(s);
        }
      });
    }
    socket.broadcast.to(params.room).emit('seat-book', [...setToRoom.values()]);
  });
});

app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);
app.use('/api/reservation', resRoute);

module.exports = server;
