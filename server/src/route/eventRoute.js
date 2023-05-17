const express = require('express');
const Event = require('../models/event');
const eventController = require('../controller/eventController');
const authController = require('../controller/authController');
const eventRoute = express.Router();

eventRoute.route('/').get(eventController.getAllEvents).post(
  authController.protect,
  authController.restrictTo('admin'),
  // eventController.createEvent
  eventController.createEventWithSeat
);
eventRoute.route('/seat').delete(eventController.deleteAllSeat);
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
    eventController.deleteEvent
  );
module.exports = eventRoute;
