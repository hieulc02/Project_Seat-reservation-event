const express = require('express');
const resController = require('../controller/reservationController');
const router = express.Router();
const authController = require('../controller/authController');

router.use(authController.protect);
router
  .route('/')
  .post(resController.createReservationWithSeat)
  .get(resController.getAllReservation);

router.route('/:id').patch(resController.updateReservation);

module.exports = router;
