const Reservation = require('../models/reservation');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Seat = require('../models/seat');
const Event = require('../models/event');

exports.createReservation = factory.createOne(Reservation);
exports.getAllReservation = factory.getAll(Reservation);
exports.updateReservation = factory.updateOne(Reservation);

exports.createReservationWithSeat = catchAsync(async (req, res, next) => {
  const reservation = Reservation(req.body);
  const { selectedSeats, total, event } = req.body;
  if (!event) {
    return res.status(400).json({
      error: 'Please select a seat to proceed with the checkout',
    });
  }
  const existingSeats = await Seat.checkExistSeats(selectedSeats, event);
  if (existingSeats.length > 0) {
    const reservedSeat = existingSeats.map((s) => ` ${s.row}-${s.col}`);
    return res.json({
      error: `Seat at: ${reservedSeat} already been reserved`,
    });
  }
  const updatedSeats = await Seat.reservedSeats(selectedSeats, event);
  await Event.seatUpdated(total, event);
  await reservation.save();
  res.status(200).json({
    status: 'Reservation created successfully',
    data: {
      reservation,
      updatedSeats,
    },
  });
});
