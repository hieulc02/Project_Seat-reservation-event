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
eventRoute.get('/latest', eventController.getLatestEvent);
eventRoute.get('/user/:username', userController.getEventUser);
eventRoute.get('/pending', eventController.getAllEventsPending);
eventRoute.get('/suggestion', eventController.getSuggestionEvent);
eventRoute.get('/:slug', eventController.getEvent);
eventRoute.use(authController.protect);

eventRoute
  .route('/:id')
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEventWithSeat);
eventRoute.patch(
  '/status/:id',
  authController.restrictTo('admin'),
  eventController.updateEventStatus
);
module.exports = eventRoute;
