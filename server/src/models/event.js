const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    enum: ['AllVenue', 'HCMC', 'HaNoi', 'Others'],
    default: 'AllVenue',
    require: true,
  },
  dateStart: {
    type: String,
    required: true,
  },
  dateEnd: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    require: true,
  },
  col: {
    type: Number,
    require: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  seats: [
    [
      {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
  ],
  seatAvailable: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image: String,
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'seats',
    model: 'Seat',
  });
  next();
});

eventSchema.statics.seatUpdated = async function (totalSeatReserved, eventId) {
  try {
    await this.updateOne(
      {
        _id: { $eq: eventId },
      },
      {
        $inc: { seatAvailable: -totalSeatReserved },
      }
    );
  } catch (e) {
    throw new Error('Invalid seat updated');
  }
};
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
