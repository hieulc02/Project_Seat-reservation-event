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

seatSchema.statics.reservedSeats = async function (reservedSeats, eventId) {
  try {
    const updatedSeats = await this.updateMany(
      {
        _id: { $in: reservedSeats },
        eventId: eventId,
        isOccupied: false,
      },
      {
        $set: { isOccupied: true },
      }
    );
    return updatedSeats;
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

module.exports = Seat;
