const Reservation = require('../models/reservation');
const Event = require('../models/event');
const { Seat } = require('../models/seat');
const factory = require('./factory');
const catchAsync = require('../utils/catchAsync');

exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
exports.updateEvent = factory.updateOne(Event);

exports.deleteEventWithSeat = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteEventPromise = Event.findByIdAndDelete(id);
  const deleteSeatPromise = Seat.deleteSeatEvent(id);
  const deleteReservationPromise = Reservation.deleteReservationEvent(id);

  await Promise.all([
    deleteEventPromise,
    deleteSeatPromise,
    deleteReservationPromise,
  ]);
  res.status(204).json({
    status: 'success',
  });
});

exports.createEventWithSeat = catchAsync(async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const user = JSON.parse(req.body.user);
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
    const rows = [];
    for (let j = 0; j < col; j++) {
      const seat = await Seat.create({
        row: i + 1,
        col: j + 1,
        eventId: event._id,
      });
      rows.push(seat);
    }
    seats.push(rows);
  }
  const createdSeats = await Promise.all(seats);
  if (user.role === 'admin') {
    event.status = 'approved';
  }
  event.seats = createdSeats;
  event.seatAvailable = rows * col;
  await event.save();

  res.status(201).json({
    status: 'Event created successfully',
  });
});

exports.getAllEventsPending = catchAsync(async (req, res, next) => {
  const event = await Event.find({ status: 'pending' });

  res.status(200).json(event);
});

exports.updateEventStatus = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const { status } = req.body;

  const event = await Event.findByIdAndUpdate(
    eventId,
    { status },
    { new: true }
  );

  res.status(200).json({ status: 'success', event });
});
