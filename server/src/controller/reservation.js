const Reservation = require('../models/reservation');
const factory = require('./factory');
const catchAsync = require('../utils/catchAsync');
const Seat = require('../models/seat');
const Event = require('../models/event');
const AppError = require('../utils/appError');

exports.createReservation = factory.createOne(Reservation);
exports.getAllReservation = factory.getAll(Reservation);
exports.getAllReservationByUser = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const userReservation = await Reservation.find({ user: id });
  res.status(200).json({
    status: 'success',
    userReservation,
  });
});
exports.getReservation = factory.getOne(Reservation);
exports.updateReservation = factory.updateOne(Reservation);
exports.createReservationWithSeat = catchAsync(async (req, res, next) => {
  const { selectedSeats, total, eventId } = req.body;
  const seatIds = selectedSeats.map((s) => s._id);
  const reservation = new Reservation({
    seats: seatIds,
    total: req.body.total,
    user: req.body.user,
    eventId: req.body.eventId,
  });

  if (!eventId) {
    return next(
      new AppError('Please select a seat to proceed with the checkout', 400)
    );
  }
  const existingSeats = await Seat.checkExistSeats(selectedSeats, eventId);
  if (existingSeats.length > 0) {
    const reservedSeat = existingSeats.map((s) => ` ${s.row}-${s.col}`);
    return next(
      new AppError(`Seat at:${reservedSeat} already been reserved`, 400)
    );
  }
  await Seat.reservedSeats(selectedSeats, eventId);
  await Event.seatUpdated(total, eventId);
  await reservation.save();

  next();
});
