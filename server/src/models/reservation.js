const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      require: true,
    },
    seats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    checkIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reservationSchema.pre(/^find/, function (next) {
  this.populate('user').populate('eventId').populate('seats');

  next();
});
reservationSchema.statics.deleteReservationEvent = async function (id) {
  try {
    await this.deleteMany({
      eventId: { $eq: id },
    });
  } catch (e) {
    throw new AppError('Fail to delete reservation!', 400);
  }
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
