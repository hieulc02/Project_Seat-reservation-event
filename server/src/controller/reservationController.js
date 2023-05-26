const Reservation = require('../models/reservation');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Seat = require('../models/seat');
const Event = require('../models/event');
const AppError = require('../utils/appError');

exports.createReservation = factory.createOne(Reservation);
exports.getAllReservation = factory.getAll(Reservation);
exports.updateReservation = factory.updateOne(Reservation);

exports.createReservationWithSeat = catchAsync(async (req, res, next) => {
  const reservation = Reservation(req.body);
  const { selectedSeats, total, eventId } = req.body;

  if (!eventId) {
    return next(
      AppError('Please select a seat to proceed with the checkout', 400)
    );
  }
  const existingSeats = await Seat.checkExistSeats(selectedSeats, eventId);
  if (existingSeats.length > 0) {
    const reservedSeat = existingSeats.map((s) => ` ${s.row}-${s.col}`);
    return next(
      AppError(`Seat at: ${reservedSeat} already been reserved`, 400)
    );
  }
  await Seat.reservedSeats(selectedSeats, eventId);
  await Event.seatUpdated(total, eventId);
  await reservation.save();
  next();
  // res.status(200).json({
  //   status: 'Reservation created successfully',
  //   data: {
  //     reservation,
  //     updatedSeats,
  //   },
  // });
});
