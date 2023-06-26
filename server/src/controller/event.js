const Reservation = require('../models/reservation');
const Event = require('../models/event');
const User = require('../models/user');
const { Seat } = require('../models/seat');
const factory = require('./factory');
const catchAsync = require('../utils/catchAsync');
const slugify = require('slugify');

exports.getAllEvents = factory.getAll(Event);
exports.updateEvent = factory.updateOne(Event);
//exports.getEvent = factory.getOne(Event);

exports.getEvent = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const event = await Event.findOne({ slug });
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
});

exports.deleteEventWithSeat = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];

  const deleteEventPromise = Event.findByIdAndDelete(id);
  const deleteSeatPromise = Seat.deleteSeatEvent(id);
  const deleteReservationPromise = Reservation.deleteReservationEvent(id);
  const deleteEventUserPromise = User.deleteEvent(id, userId);
  await Promise.all([
    deleteEventPromise,
    deleteSeatPromise,
    deleteReservationPromise,
    deleteEventUserPromise,
  ]);
  res.status(204).json({
    status: 'success',
  });
});

exports.createEventWithSeat = catchAsync(async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  const user = JSON.parse(req.body.user);
  const event = new Event({ ...data, user: user, image: req.body.image });
  const rows = event.row;
  const col = event.col;
  const name = event.name;
  const slug = slugify(name, { lower: true });
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
    event.isApproved = true;
  }
  event.slug = slug;
  event.seats = createdSeats;
  event.seatAvailable = rows * col;
  await event.save();
  await User.updateEvent(user._id, event);
  res.status(201).json({
    status: 'Event created successfully',
  });
});

exports.getAllEventsPending = catchAsync(async (req, res, next) => {
  const event = await Event.find({ isApproved: false });

  res.status(200).json(event);
});

exports.updateEventStatus = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const { status } = req.body; // status : true
  const event = await Event.findByIdAndUpdate(
    eventId,
    { isApproved: status },
    { new: true }
  );

  res.status(200).json({ status: 'success', event });
});

exports.getSuggestionEvent = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.json([]);
  }
  const suggestions = await Event.queryEvent(searchTerm);

  res.status(200).json(suggestions);
});
