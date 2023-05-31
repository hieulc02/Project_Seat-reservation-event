const express = require('express');
const authController = require('../controller/authController');
const resController = require('../controller/reservationController');
const bookingController = require('../controller/bookingController');
const momo = require('../controller/momo');
const bookRoute = express.Router();

bookRoute.use(authController.protect);
bookRoute.post(
  '/create_payment_url',
  resController.createReservationWithSeat,
  bookingController.createPaymentUrl
);
bookRoute.get('/vnpay_return', bookingController.vnpStatusReturn);

bookRoute.post('/momo_payment_url', momo.createPaymentUrl);
module.exports = bookRoute;
