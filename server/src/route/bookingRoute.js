const express = require('express');
const authController = require('../controller/authController');
const paypal = require('../controller/bookingController');
const bookRoute = express.Router();

//bookRoute.use(authController.protect);
