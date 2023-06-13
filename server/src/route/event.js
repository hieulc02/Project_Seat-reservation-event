const express = require('express');
const eventController = require('../controller/event');
const authController = require('../controller/authentication');
const imageController = require('../controller/image');
const eventRoute = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

eventRoute
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    upload.single('file'),
    imageController.imageToCloudinary,
    eventController.createEventWithSeat
  );
eventRoute.get('/pending', eventController.getAllEventsPending);
eventRoute
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.updateEvent
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.updateEventStatus
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.deleteEventWithSeat
  );
module.exports = eventRoute;
