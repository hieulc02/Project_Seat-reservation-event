const mongoose = require('mongoose');

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
    throw new Error('Seat reservation fail!');
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
    throw new Error('Check seat fail');
  }
};
seatSchema.statics.deleteSeatEvent = async function (id) {
  try {
    await this.deleteMany({
      eventId: { $eq: id },
    });
    mapOccupied.delete(key);
  } catch (e) {
    throw new Error('Fail to delete seat');
  }
};
const Seat = mongoose.model('Seat', seatSchema);

module.exports = { Seat, initSeat, updateTempSeat };
