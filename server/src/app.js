const path = require('path');
const morgan = require('morgan');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
//const { createServer } = require('http');
//const { Server } = require('socket.io');
const eventController = require('./controller/eventController');
const userRoute = require('./route/userRoute');
const eventRoute = require('./route/eventRoute');
const resRoute = require('./route/reservationRoute');
const Event = require('./models/event');
//const bookingRoute = require('./route/bookingRoute');

const app = express();

//const httpServer = createServer(app);
//const io = new Server(httpServer);
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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: true,
    },
  })
);
app.use((req, res, next) => {
  //console.log(req.body);
  next();
});
app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);
app.use('/api/reservation', resRoute);

// const roomToReservation = {};
// const clientIdToReservation = {};

// io.on('connection', (socket) => {
//   console.log('new client', socket.id);
//   socket.on('join-room', (room) => {
//     socket.join(room);
//     if (roomToReservation[room] === undefined) return;
//     for (const seat of roomToReservation[room].values()) {
//       socket.emit('temp-book-seat', seat);
//     }
//   });
//   socket.on('temp-book-seat', (params) => {
//     if (params.state) {
//       (roomToReservation[params.room] =
//         roomToReservation[params.room] || new Set()).add(params);
//       (clientIdToReservation[socket.id] =
//         clientIdToReservation[socket.id] || new Set()).add(params);
//     }
//   });
// });

module.exports = app;
