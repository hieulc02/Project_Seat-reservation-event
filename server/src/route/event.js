const express = require('express');
const eventController = require('../controller/event');
const authController = require('../controller/authentication');
const imageController = require('../controller/image');
const userController = require('../controller/user');
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

eventRoute.get('/user/:username', userController.getEventUser);
eventRoute.get('/pending', eventController.getAllEventsPending);
eventRoute.get('/suggestion', eventController.getSuggestionEvent);
eventRoute.get('/:slug', eventController.getEvent);
eventRoute
  .route('/:id')
  .patch(authController.protect, eventController.updateEvent)
  .delete(authController.protect, eventController.deleteEventWithSeat);
eventRoute
  .route('/status/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.updateEventStatus
  );
module.exports = eventRoute;
