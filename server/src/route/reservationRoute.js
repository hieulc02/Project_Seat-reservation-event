const express = require('express');
const resController = require('../controller/reservationController');
const router = express.Router();
const authController = require('../controller/authController');

router.use(authController.protect);
router.get('/', resController.getAllReservation);
router.post('/me', resController.getAllReservationByUser);
router
  .route('/:id')
  .get(resController.getReservation)
  .patch(resController.updateReservation);

module.exports = router;
