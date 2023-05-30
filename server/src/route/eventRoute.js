const express = require('express');
const eventController = require('../controller/eventController');
const authController = require('../controller/authController');
const imageController = require('../controller/imageController');
const eventRoute = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

eventRoute
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    upload.single('file'),
    imageController.imageToCloudinary,
    eventController.createEventWithSeat
  );
eventRoute
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.updateEvent
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.deleteEventWithSeat
  );
module.exports = eventRoute;
