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

const init = (io) => {
  ioInstance = io;
};

const seatOccupied = new Set();
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
    reservedSeats.forEach((seat) => {
      seatOccupied.add(seat._id);
    });
    const serializedSet = [...seatOccupied.values()];
    ioInstance
      .to(`event/${reservedSeats[0].eventId}`)
      .emit('seat-occupied', serializedSet);
    seatOccupied.clear();
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
  } catch (e) {
    throw new Error('Fail to delete seat');
  }
};
const Seat = mongoose.model('Seat', seatSchema);

module.exports = { Seat, init };
