const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const { Schema } = mongoose;

const seatSchema = new Schema({
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    require: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
});

let ioInstance;

const initSeat = (io) => {
  ioInstance = io;
};

const seatOccupied = new Set();
const mapOccupied = new Map();
let key;

const updateTempSeat = (reservedSeats) => {
  key = `event/${reservedSeats[0].eventId}`;
  if (mapOccupied.get(key)) {
    reservedSeats.forEach((seat) => {
      seatOccupied.add(seat._id);
    });
    const serializedSet = [...seatOccupied.values()];
    mapOccupied.set(key, serializedSet);
  } else {
    seatOccupied.clear();
    reservedSeats.forEach((seat) => {
      seatOccupied.add(seat._id);
    });
    const serializedSet = [...seatOccupied.values()];
    mapOccupied.set(key, serializedSet);
  }
  const event = mapOccupied.get(key);
  ioInstance.to(key).emit('seat-occupied', event);
};

seatSchema.statics.reservedSeats = async function (reservedSeats, eventId) {
  try {
    await this.updateMany(
      {
        _id: { $in: reservedSeats },
        eventId: eventId,
        isOccupied: false,
      },
      {
        $set: { isOccupied: true },
      }
    );
  } catch (e) {
    throw new AppError('Seat reservation fail!', 400);
  }
};

seatSchema.statics.checkExistSeats = async function (reservedSeats, eventId) {
  try {
    const existingSeats = await this.find({
      _id: { $in: reservedSeats },
      eventId: eventId,
      isOccupied: true,
    });
    return existingSeats;
  } catch (e) {
    throw new AppError('Fail to check seat', 400);
  }
};
seatSchema.statics.deleteSeatEvent = async function (id) {
  try {
    await this.deleteMany({
      eventId: { $eq: id },
    });
    mapOccupied.delete(key);
  } catch (e) {
    throw new AppError('Fail to delete seat', 400);
  }
};
const Seat = mongoose.model('Seat', seatSchema);

module.exports = { Seat, initSeat, updateTempSeat };
