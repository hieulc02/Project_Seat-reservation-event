const express = require('express');
const resController = require('../controller/reservation');
const router = express.Router();
const authController = require('../controller/authentication');

router.use(authController.protect);
router.get('/', resController.getAllReservation);
router.post('/me', resController.getAllReservationByUser);
router
  .route('/:id')
  .get(resController.getReservation)
  .patch(resController.updateReservation);

module.exports = router;
