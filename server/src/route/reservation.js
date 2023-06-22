const express = require('express');
const resController = require('../controller/reservation');
const authController = require('../controller/authentication');
const router = express.Router();

router.use(authController.protect);
router.get('/', resController.getAllReservation);
router.post('/me', resController.getAllReservationByUser);
router
  .route('/:id')
  .get(resController.getReservation)
  .patch(resController.updateReservation);

module.exports = router;
