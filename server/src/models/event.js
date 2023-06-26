const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const { Schema } = mongoose;

const eventSchema = new Schema({
  isApproved: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    collation: { locale: 'en', strength: 2 },
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    enum: ['HCMC', 'HaNoi', 'Others'],
    default: 'HCMC',
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  image: String,
});
eventSchema.index(
  { name: 'text' },
  { collation: { locale: 'en', strength: 2 } }
);

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'seats',
    model: 'Seat',
  }).populate('user');
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
    throw new AppError('Invalid seat updated', 400);
  }
};

eventSchema.statics.queryEvent = async function (searchTerm) {
  try {
    const suggestions = await this.aggregate([
      {
        $match: {
          name: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          slug: 1,
          name: 1,
          dateStart: 1,
          venue: 1,
        },
      },
    ]);
    return suggestions;
  } catch (e) {
    throw new AppError('Fail for querying event', 400);
  }
};
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
