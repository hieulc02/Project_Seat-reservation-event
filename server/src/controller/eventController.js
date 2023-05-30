const Reservation = require('../models/reservation');
const Event = require('../models/event');
const Seat = require('../models/seat');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
exports.updateEvent = factory.updateOne(Event);

exports.deleteEventWithSeat = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  await Seat.deleteSeatEvent(id);
  await Reservation.deleteReservationEvent(id);
  res.status(204).json({
    status: 'success',
  });
});

exports.createEventWithSeat = catchAsync(async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const event = new Event({ ...data, image: req.body.image });
  const rows = event.row;
  const col = event.col;

  if (
    typeof rows !== 'number' ||
    typeof col !== 'number' ||
    typeof event.ticketPrice !== 'number'
  ) {
    return res.status(400).json({
      error: 'Invalid input. Please check the input type!',
    });
  }

  const seats = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < col; j++) {
      const seat = await Seat.create({
        row: i + 1,
        col: j + 1,
        eventId: event._id,
      });
      row.push(seat);
      //seats.push(seat);
    }
    seats.push(row);
  }
  event.seats = await Promise.all(seats);
  event.seatAvailable = seats.flat().length;

  await event.save();
  res.status(201).json({
    status: 'Event created successfully',
    data: {
      event,
    },
  });
});
