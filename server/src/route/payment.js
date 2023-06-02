const express = require('express');
const authController = require('../controller/authentication');
const vnpay = require('../controller/payment/vnpay');
const momo = require('../controller/payment/momo');
const bookRoute = express.Router();

bookRoute.use(authController.protect);
bookRoute.post('/vnpay_payment_url', vnpay.createPaymentUrl);
bookRoute.get('/vnpay_return', vnpay.verifyPaymentUrl);

bookRoute.post('/momo_payment_url', momo.createPaymentUrl);
bookRoute.get('/momo_return', momo.verifyPaymentUrl);
module.exports = bookRoute;
