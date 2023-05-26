const express = require('express');
const resController = require('../controller/reservationController');
const router = express.Router();
const authController = require('../controller/authController');

router.use(authController.protect);
router.get('/', resController.getAllReservation);
router.patch('/:id', resController.updateReservation);

module.exports = router;
