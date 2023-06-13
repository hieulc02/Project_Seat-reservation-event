const Reservation = require('../models/reservation');
const factory = require('./factory');
const catchAsync = require('../utils/catchAsync');
const { Seat, updateTempSeat } = require('../models/seat');
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
exports.createReservationWithSeat = async (
  date,
  venue,
  selectedSeats,
  total,
  eventId,
  user
) => {
  const seatIds = selectedSeats.map((s) => s._id);
  const reservation = new Reservation({
    date: date,
    venue: venue,
    seats: seatIds,
    total: total,
    user: user,
    eventId: eventId,
  });

  if (!eventId) {
    throw new AppError(
      'Please select a seat to proceed with the checkout',
      400
    );
  }
  try {
    const existingSeats = await Seat.checkExistSeats(selectedSeats, eventId);
    if (existingSeats.length > 0) {
      const reservedSeat = existingSeats.map((s) => ` ${s.row}-${s.col}`);
      throw new AppError(`Seat at:${reservedSeat} already been reserved`, 400);
    }

    if (reservation) {
      await Promise.all([
        Seat.reservedSeats(selectedSeats, eventId),
        Event.seatUpdated(total, eventId),
      ]);
      updateTempSeat(selectedSeats);
    }

    await reservation.save();
    await reservation.populate('seats');
    return reservation;
  } catch (e) {
    throw e;
  }
};
