const express = require('express');
const authController = require('../controller/authController');
const resController = require('../controller/reservationController');
const bookingController = require('../controller/bookingController');
const bookRoute = express.Router();

bookRoute.use(authController.protect);
bookRoute.post(
  '/create_payment_url',
  resController.createReservationWithSeat,
  bookingController.createPaymentUrl
);
bookRoute.post('/vnpay_return', bookingController.vnpStatusReturn);

module.exports = bookRoute;
